import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NHLPrediction } from '../../../types/nhlPredictions';
import { NHLGame } from '../../../types/nhl';
import { OddsFormat } from '../../../types/odds';
import { Bookmaker, getUserBookmakers } from '../../../services/bookmakerService';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { trackBet, getOddsTypes, getBetLegTypes, getSingleBetTypeId } from '../../../services/betTrackingService';
import { CreateBetData, OddsType, BetLegType } from '../../../types/betting';
import { supabase } from '../../../lib/supabase/client';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: NHLPrediction | NHLGame;
  eventId?: string;
  oddsFormat?: OddsFormat;
}

// NHL specific IDs from nhlPredictionsService
const NHL_SPORT_ID = '0f9a163b-f6e3-4743-952c-76909405d482';
const NHL_LEAGUE_ID = '1e4c7e3c-5d07-4705-a608-7e586bbc92b4';

// Bet status ID for "Pending"
const PENDING_STATUS_ID = '986ae62d-e908-4163-8186-6655755cd53d';

const BettingModal = ({ isOpen, onClose, game, eventId, oddsFormat = 'american' }: BettingModalProps) => {
  const [stake, setStake] = useState('');
  const [odds, setOdds] = useState('');
  const [userBookmakers, setUserBookmakers] = useState<Bookmaker[]>([]);
  const [selectedBookmaker, setSelectedBookmaker] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [oddsTypes, setOddsTypes] = useState<OddsType[]>([]);
  const [legTypes, setLegTypes] = useState<BetLegType[]>([]);
  const [legTypeId, setLegTypeId] = useState<string | null>(null);
  const [actualEventId, setActualEventId] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Load bookmakers and odds types first
        const [bookmakers, oddsTypesData, legTypesData] = await Promise.all([
          getUserBookmakers(user.id),
          getOddsTypes(),
          getBetLegTypes()
        ]);
        
        setUserBookmakers(bookmakers);
        setOddsTypes(oddsTypesData);
        setLegTypes(legTypesData);

        // Only fetch prediction data if we have an eventId
        if (eventId) {
          // Fetch prediction_type and event_id from predictions table
          const { data: predictionData, error: predictionError } = await supabase
            .from('predictions')
            .select('prediction_type, event_id')
            .eq('id', eventId)
            .single();

          if (predictionError) {
            console.error('Error fetching prediction:', predictionError);
            throw predictionError;
          }
          
          if (!predictionData) {
            console.error('Prediction not found');
            throw new Error('Prediction not found');
          }

          console.log('Prediction data:', predictionData);
          
          // Store the actual event ID from the prediction
          setActualEventId(predictionData.event_id);

          // Get bet leg type ID based on prediction_type
          const { data: legTypeData, error: legTypeError } = await supabase
            .from('bet_leg_types')
            .select('id')
            .eq('name', predictionData.prediction_type)
            .single();

          if (legTypeError) {
            console.error('Error fetching leg type:', legTypeError);
            throw legTypeError;
          }
          
          if (!legTypeData) {
            console.error('Bet leg type not found');
            throw new Error('Bet leg type not found');
          }

          console.log('Leg type data:', legTypeData);
          setLegTypeId(legTypeData.id);
        }
        
        // Reset selected bookmaker when modal opens
        setSelectedBookmaker('');
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load bet data');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadData();
      // Reset form state when modal opens
      setStake('');
      setOdds('');
      setError(null);
    }
  }, [isOpen, user?.id, eventId]);

  if (!isOpen) return null;

  // Helper function to handle both types
  const getPredictedWinner = () => {
    if ('Predicted Winner' in game && game['Predicted Winner']) {
      return game['Predicted Winner'];
    }
    return null;
  };

  const predictedWinner = getPredictedWinner();

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setStake(value);
    }
  };

  const handleOddsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validation based on odds format
    switch (oddsFormat) {
      case 'american':
        // Allow positive and negative numbers
        if (/^-?\d*$/.test(value)) {
          setOdds(value);
        }
        break;
      case 'decimal':
        // Allow positive numbers with up to 2 decimal places
        if (/^\d*\.?\d{0,2}$/.test(value)) {
          setOdds(value);
        }
        break;
      case 'fractional':
        // Allow format like "5/1", "10/1", etc.
        if (/^\d*\/?\.?\d*$/.test(value)) {
          setOdds(value);
        }
        break;
    }
  };

  const getOddsPlaceholder = () => {
    switch (oddsFormat) {
      case 'american':
        return 'Enter odds (e.g. -110, +150)';
      case 'decimal':
        return 'Enter odds (e.g. 1.91, 2.50)';
      case 'fractional':
        return 'Enter odds (e.g. 10/1, 5/2)';
    }
  };

  const handlePlaceBet = async () => {
    try {
      setError(null);

      // Validate required fields
      if (!stake || !odds || !selectedBookmaker || !legTypeId) {
        setError('Please fill in all required fields');
        return;
      }

      if (!actualEventId) {
        setError('No event ID found');
        return;
      }

      // Find the correct odds type ID based on format
      const oddsType = oddsTypes.find(type => type.name.toLowerCase() === oddsFormat);
      if (!oddsType) {
        setError('Invalid odds format');
        return;
      }

      // Get the single bet type ID
      const singleBetTypeId = await getSingleBetTypeId();

      // Ensure we have valid team names
      const awayTeam = game['Away Team'] as string;
      const homeTeam = game['Home Team'] as string;
      
      // Determine the selection (predicted winner or away team)
      const selection = predictedWinner || awayTeam;

      // Create bet data
      const betData: CreateBetData = {
        bookmaker_id: selectedBookmaker,
        bet_type_id: singleBetTypeId,
        bet_status_id: PENDING_STATUS_ID,
        stake: parseFloat(stake),
        odds_type_id: oddsType.id,
        odds: odds,
        legs: [{
          sport_id: NHL_SPORT_ID,
          league_id: NHL_LEAGUE_ID,
          event_name: `${awayTeam} @ ${homeTeam}`,
          selection,
          event_start: new Date().toISOString(),
          odds_type_id: oddsType.id,
          odds: odds,
          event_id: actualEventId.toString(), // Use the actual event ID from the prediction
          leg_type_id: legTypeId,
          bet_status_id: PENDING_STATUS_ID
        }]
      };

      // Log the complete bet data before sending
      console.log('Sending single bet data:', JSON.stringify(betData, null, 2));

      await trackBet(betData);
      onClose();
    } catch (err) {
      console.error('Error placing bet:', err);
      setError('Failed to place bet');
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
    >
      <div className="bg-[#1A1A23] rounded-xl p-6 w-full max-w-xl mx-4 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold">Place Single Bet</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <div className="text-white">
            <p className="mb-2 text-gray-400">Game:</p>
            <p className="text-lg font-medium">{game['Away Team']} @ {game['Home Team']}</p>
          </div>

          {predictedWinner && (
            <div className="text-white">
              <p className="mb-2 text-gray-400">Prediction:</p>
              <p className="text-lg font-medium text-[#4263EB]">{predictedWinner} to Win</p>
            </div>
          )}

          {'Game State' in game && (
            <div className="text-white">
              <p className="mb-2 text-gray-400">Game Status:</p>
              <p className="text-lg font-medium">{game['Game State']}</p>
            </div>
          )}

          {loading ? (
            <div className="text-white text-center py-4">
              Loading bookmakers...
            </div>
          ) : userBookmakers.length === 0 ? (
            <div className="bg-[#2A2A35] rounded-lg p-4 text-white">
              <p className="mb-2">No bookmakers selected</p>
              <p className="text-sm text-gray-400 mb-3">
                You need to select bookmakers before placing bets.
              </p>
              <Link
                to="/bookmakers"
                className="text-[#4263EB] hover:text-[#3651C9] transition-colors"
              >
                Go to Bookmakers to Select Bookmakers →
              </Link>
            </div>
          ) : (
            <div className="text-white">
              <label htmlFor="bookmaker" className="block mb-2 text-gray-400">Select Bookmaker:</label>
              <select
                id="bookmaker"
                value={selectedBookmaker}
                onChange={(e) => setSelectedBookmaker(e.target.value)}
                className="w-full bg-[#2A2A35] text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4263EB] appearance-none cursor-pointer"
              >
                <option value="">Select a bookmaker</option>
                {userBookmakers.map((bookmaker) => (
                  <option key={bookmaker.id} value={bookmaker.id}>
                    {bookmaker.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-white">
              <label htmlFor="stake" className="block mb-2 text-gray-400">Stake ($)</label>
              <input
                id="stake"
                type="text"
                value={stake}
                onChange={handleStakeChange}
                placeholder="Enter stake amount"
                className="w-full bg-[#2A2A35] text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4263EB]"
              />
            </div>

            <div className="text-white">
              <label htmlFor="odds" className="block mb-2 text-gray-400">
                Odds ({oddsFormat.charAt(0).toUpperCase() + oddsFormat.slice(1)})
              </label>
              <input
                id="odds"
                type="text"
                value={odds}
                onChange={handleOddsChange}
                placeholder={getOddsPlaceholder()}
                className="w-full bg-[#2A2A35] text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4263EB]"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <button
            className="w-full bg-[#4263EB] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#3651C9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            onClick={handlePlaceBet}
            disabled={!stake || !odds || !selectedBookmaker || !legTypeId}
          >
            Place Single Bet
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BettingModal;

import React, { useState, useEffect } from 'react';
import { NHLGame } from '../../../types/nhl';
import { OddsFormat, convertOdds, getServiceOddsFormat } from '../../../types/odds';
import { getBookmakersByLocation, BookmakerWithOdds } from '../../../services/bookmakerService';
import { getRequiredIds } from '../../../services/sportsService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { trackBet, getOddsTypes, getBetLegTypes } from '../../../services/betTrackingService';
import { BetLegType, CreateBetData } from '../../../types/betting';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: NHLGame;
  oddsFormat: OddsFormat;
}

interface RequiredIds {
  nhlSportId?: string;
  nhlLeagueId?: string;
  singleBetTypeId?: string;
  oddsTypeId?: string;
}

type BetTab = 'winner' | 'goals';

const HIGH_CONFIDENCE_THRESHOLD = 60;
const DEFAULT_OVER_UNDER = 5.5;

const BettingModal: React.FC<BettingModalProps> = ({ 
  isOpen, 
  onClose, 
  game, 
  oddsFormat 
}) => {
  const [activeTab, setActiveTab] = useState<BetTab>('winner');
  const [selectedBookie, setSelectedBookie] = useState<BookmakerWithOdds | null>(null);
  const [stake, setStake] = useState<string>('');
  const [bookmakers, setBookmakers] = useState<BookmakerWithOdds[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requiredIds, setRequiredIds] = useState<RequiredIds>({});
  const [betLegTypes, setBetLegTypes] = useState<BetLegType[]>([]);
  const { user } = useAuthContext();

  const getWinningTeam = (game: NHLGame) => {
    const homeProb = parseFloat(game["Pre-Game Home Win Probability"]);
    const awayProb = parseFloat(game["Pre-Game Away Win Probability"]);
    return homeProb >= HIGH_CONFIDENCE_THRESHOLD 
      ? game["Home Team"] 
      : awayProb >= HIGH_CONFIDENCE_THRESHOLD 
        ? game["Away Team"] 
        : null;
  };

  const getSelection = (winningTeam: string | null): string => {
    if (activeTab === 'winner') {
      return winningTeam ? `${winningTeam} to win` : 'AI Unsure';
    }
    return `Over ${DEFAULT_OVER_UNDER} Goals`;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        const serviceOddsFormat = getServiceOddsFormat(oddsFormat);
        
        const [bookies, ids, oddsTypes, legTypes] = await Promise.all([
          getBookmakersByLocation(serviceOddsFormat),
          getRequiredIds(),
          getOddsTypes(),
          getBetLegTypes()
        ]);
        
        const matchingOddsType = oddsTypes.find(type => type.name === serviceOddsFormat);
        if (!matchingOddsType) {
          throw new Error('Could not find matching odds type');
        }

        setBetLegTypes(legTypes);
        setBookmakers(bookies);
        setRequiredIds({
          ...ids,
          oddsTypeId: matchingOddsType.id
        });
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [isOpen, oddsFormat]);

  const handleTrackBet = async () => {
    try {
      // Initial validation
      if (!selectedBookie || !stake || !user || 
          !requiredIds.nhlSportId || !requiredIds.nhlLeagueId || 
          !requiredIds.singleBetTypeId || !requiredIds.oddsTypeId) {
        throw new Error('Missing required data for bet tracking');
      }
  
      // Get winning team from existing function
      const winningTeam = getWinningTeam(game);
      if (activeTab === 'winner' && !winningTeam) {
        throw new Error('No winning team prediction available');
      }
  
      // Get leg type for moneyline or over/under
      const legType = betLegTypes.find(type => 
        type.name === (activeTab === 'winner' ? 'moneyline' : 'over_under')
      );
  
      if (!legType) {
        throw new Error('Could not find appropriate bet leg type');
      }
  
      // Format event name and selection using existing game data
      const eventName = `${game["Away Team"]} @ ${game["Home Team"]}`;
      const selection = activeTab === 'winner'
        ? `${winningTeam} to win`
        : `Over ${DEFAULT_OVER_UNDER} Goals`;
  
      // Convert odds using the selected format
      const convertedOdds = convertOdds(selectedBookie.odds, oddsFormat);
  
      // Create bet data matching the database tables exactly
      const betData: CreateBetData = {
        bookmaker_id: selectedBookie.id,
        bet_type_id: requiredIds.singleBetTypeId,
        stake: parseFloat(stake),
        odds_type_id: requiredIds.oddsTypeId,
        odds: convertedOdds,
        legs: [{
          sport_id: requiredIds.nhlSportId,
          league_id: requiredIds.nhlLeagueId,
          event_name: eventName,
          selection: selection,
          event_start: new Date().toISOString(),
          odds_type_id: requiredIds.oddsTypeId,
          odds: convertedOdds,
          leg_type_id: legType.id
        }]
      };
  
      // Track the bet and close modal
      await trackBet(betData);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error tracking bet:', error.message);
      } else {
        console.error('Unknown error tracking bet:', error);
      }
    }
  };

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setStake(value);
    }
  };

  if (!isOpen) return null;
  const winningTeam = getWinningTeam(game);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-[#2b2c40] rounded-lg border border-[#474E72]" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              {/* Game Info */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">{game["Away Team"]}</span>
                  <span className="text-[#8F9BB3]">vs</span>
                  <span className="text-white">{game["Home Team"]}</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'winner' ? 'bg-[#4263EB] text-white' : 'bg-[#13131A] text-gray-400'
                  }`}
                  onClick={() => setActiveTab('winner')}
                >
                  Winner
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'goals' ? 'bg-[#4263EB] text-white' : 'bg-[#13131A] text-gray-400'
                  }`}
                  onClick={() => setActiveTab('goals')}
                >
                  Goals
                </button>
              </div>

              {/* Current Selection */}
              <div className="bg-[#13131A] p-3 rounded-lg mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00F6FF]"></div>
                  <span className="text-[#00F6FF]">{getSelection(winningTeam)}</span>
                </div>
              </div>

              {/* Clickable Bookmaker Odds */}
              <div className="space-y-2 mb-6">
                <h3 className="text-white text-sm mb-3">Select Bookmaker</h3>
                {bookmakers.map((bookie) => (
                  <div 
                    key={bookie.id} 
                    onClick={() => setSelectedBookie(bookie)}
                    className={`flex justify-between items-center p-3 rounded cursor-pointer transition-all
                      ${selectedBookie?.id === bookie.id 
                        ? 'bg-[#4263EB] text-white border border-[#4263EB]' 
                        : 'bg-[#13131A] text-gray-300 hover:bg-[#323248] border border-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full border ${
                        selectedBookie?.id === bookie.id 
                          ? 'bg-white border-white' 
                          : 'border-gray-400'
                      }`}/>
                      <span>{bookie.name}</span>
                    </div>
                    <span className="font-medium">
                      {convertOdds(bookie.odds, oddsFormat)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stake Input */}
              <div className="mb-6">
                <h3 className="text-white text-sm mb-3">Stake Amount</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={stake}
                    onChange={handleStakeChange}
                    placeholder="Enter stake amount"
                    className="w-full p-3 bg-[#13131A] text-white border border-[#474E72] rounded-lg focus:outline-none focus:border-[#4263EB]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={handleTrackBet}
                  disabled={!selectedBookie || !stake}
                  className="flex-1 px-4 py-2 bg-[#4263EB] hover:bg-[#3451C6] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Track Bet
                </button>
                <button 
                  disabled={!selectedBookie || !stake}
                  className="flex-1 px-4 py-2 bg-[#13131A] hover:bg-[#323248] text-white border border-[#474E72] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Auto Bet
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BettingModal;
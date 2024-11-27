import { useEffect, useState } from 'react';
import { NHLPredictionsResponse, NHLPrediction } from '../../../types/nhlPredictions';
import { fetchNHLPredictions, getTeamAbbreviation } from '../../../services/nhlPredictionsService';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import BettingModal from './BettingModal';

const NHLSingles = () => {
  const [predictions, setPredictions] = useState<NHLPredictionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<NHLPrediction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          console.log('Fetching NHL predictions...');
          const data = await fetchNHLPredictions(session.access_token);
          console.log('Received predictions:', data);
          console.log('Number of predictions:', Object.keys(data).length);
          setPredictions(data);
        } else {
          console.error('No access token available');
          setError('Authentication required');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load predictions';
        console.error('Error loading predictions:', err);
        setError(errorMessage);
      }
    };

    if (user) {
      loadPredictions();
    } else {
      console.log('No user logged in');
    }
  }, [user]);

  const handleAddBet = (game: NHLPrediction, e: React.MouseEvent) => {
    e.stopPropagation();
    if (game['Predicted Winner'] !== "AI Unsure") {
      setSelectedGame(game);
      setIsModalOpen(true);
    }
  };

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!predictions) {
    return (
      <div className="text-white p-4">
        Loading predictions...
      </div>
    );
  }

  const predictionsList = Object.values(predictions);
  if (predictionsList.length === 0) {
    return (
      <div className="text-white p-4">
        No predictions available for today.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1400px] mx-auto p-6">
        {predictionsList.map((game, index) => {
          const homeAbbr = getTeamAbbreviation(game['Home Team'] || '');
          const awayAbbr = getTeamAbbreviation(game['Away Team'] || '');

          return (
            <div key={index} className="bg-gradient-to-br from-[#1A1A23] to-[#13131A] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] hover:border-[#4263EB] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              {/* Teams Display */}
              <div className="p-6">
                <div className="flex flex-col space-y-4">
                  {/* Away Team */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[#13131A] p-2 flex items-center justify-center shadow-inner">
                      <img 
                        src={`assets/img/nhl-logos/${awayAbbr}.png`}
                        alt={game['Away Team'] || 'Away Team'}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <span className="text-white text-xl font-semibold flex-1">{game['Away Team'] || 'TBD'}</span>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]"></div>
                    <span className="text-[#8F9BB3] font-medium px-3">AT</span>
                    <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]"></div>
                  </div>

                  {/* Home Team */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[#13131A] p-2 flex items-center justify-center shadow-inner">
                      <img 
                        src={`assets/img/nhl-logos/${homeAbbr}.png`}
                        alt={game['Home Team'] || 'Home Team'}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <span className="text-white text-xl font-semibold flex-1">{game['Home Team'] || 'TBD'}</span>
                  </div>
                </div>
              </div>

              {/* Prediction */}
              <div className="bg-[#13131A] p-6 border-t border-[rgba(255,255,255,0.05)]">
                {game['Predicted Winner'] === "AI Unsure" ? (
                  <div className="flex items-center justify-center">
                    <div className="px-4 py-2 rounded-full bg-[rgba(255,212,38,0.1)] text-[#FFD426] text-sm font-medium">
                      AI Unsure
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#4263EB]"></div>
                      <span className="text-[#4263EB] text-lg font-semibold">
                        {game['Predicted Winner']} to Win
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleAddBet(game, e)}
                      className="bg-[#4263EB] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#3651C9] transition-colors"
                    >
                      Add Bet
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedGame && (
        <BettingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedGame(null);
          }}
          game={selectedGame}
        />
      )}
    </>
  );
};

export default NHLSingles;

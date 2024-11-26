import { useState, useEffect } from 'react';
import OverDogPicks from '../../components/dashboard/hockey/OverDogPicks';
import NHLProps from '../../components/dashboard/hockey/NHLProps';
import NHLScoreboardContainer from '../../components/dashboard/hockey/NHLScoreboardContainer';
import NHLStandings from '../../components/dashboard/hockey/NHLStandings';
import { OddsFormat } from '../../types/odds';
import { NHLGame } from '../../types/nhl';
import { fetchNHLPredictions } from '../../services/nhlPredictionsService';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase/client';

const NHLPage = () => {
  const [activeTab, setActiveTab] = useState('singles');
  const [games, setGames] = useState<NHLGame[]>([]);
  const [oddsFormat, setOddsFormat] = useState<OddsFormat>('american');
  const { user } = useAuth();

  useEffect(() => {
    const loadGames = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const predictions = await fetchNHLPredictions(session.access_token);
          // Convert predictions object to array of NHLGame
          const gamesArray = Object.entries(predictions).map(([id, pred]) => ({
            GameID: id,
            "Away Team": pred["Away Team"],
            "Home Team": pred["Home Team"],
            "Game State": "SCHEDULED",
            "Predicted Winner": pred["Predicted Winner"] || "AI Unsure",
            "Pre-Game Away Win Probability": pred["Pre-Game Away Win Probability"],
            "Pre-Game Home Win Probability": pred["Pre-Game Home Win Probability"],
            oddsFormat: oddsFormat
          }));
          setGames(gamesArray);
        }
      } catch (error) {
        console.error('Error loading NHL games:', error);
      }
    };

    if (user) {
      loadGames();
    }
  }, [user, oddsFormat]);

  return (
    <div className="space-y-4 font-[Montserrat] max-w-[1440px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <span className="text-[#8F9BB3]">Dashboard / Hockey /</span>
        <span className="text-white font-medium">NHL</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column - Scoreboard */}
        <div className="w-full lg:w-[400px]">
          <NHLScoreboardContainer />
        </div>

        {/* Right Column - Overdog Picks and Standings */}
        <div className="flex-1 space-y-4">
          {/* Overdog Picks */}
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center">
              <h2 className="bg-gradient-to-r from-[#FFD426] to-[#00F6FF] bg-clip-text text-transparent font-semibold">
                OVERDOG PICKS
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setOddsFormat('american')}
                  className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                    oddsFormat === 'american'
                      ? 'bg-[#4263EB] text-white shadow-lg'
                      : 'bg-[#2A2A33] text-gray-400 hover:bg-[#3A3A43] hover:text-white'
                  }`}
                >
                  American
                </button>
                <button
                  onClick={() => setOddsFormat('decimal')}
                  className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                    oddsFormat === 'decimal'
                      ? 'bg-[#4263EB] text-white shadow-lg'
                      : 'bg-[#2A2A33] text-gray-400 hover:bg-[#3A3A43] hover:text-white'
                  }`}
                >
                  Decimal
                </button>
                <button
                  onClick={() => setOddsFormat('fractional')}
                  className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                    oddsFormat === 'fractional'
                      ? 'bg-[#4263EB] text-white shadow-lg'
                      : 'bg-[#2A2A33] text-gray-400 hover:bg-[#3A3A43] hover:text-white'
                  }`}
                >
                  Fractional
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex gap-6 border-b border-[rgba(255,255,255,0.05)] px-4 pb-3">
                <button
                  className={`text-sm font-medium pb-3 -mb-3 ${activeTab === 'singles' ? 'text-[#00F6FF] border-b-2 border-[#00F6FF]' : 'text-[#8F9BB3] hover:text-white transition-colors'}`}
                  onClick={() => setActiveTab('singles')}
                >
                  Singles
                </button>
                <button
                  className={`text-sm font-medium pb-3 -mb-3 ${activeTab === 'parlays' ? 'text-[#00F6FF] border-b-2 border-[#00F6FF]' : 'text-[#8F9BB3] hover:text-white transition-colors'}`}
                  onClick={() => setActiveTab('parlays')}
                >
                  Parlays
                </button>
                <button
                  className={`text-sm font-medium pb-3 -mb-3 ${activeTab === 'props' ? 'text-[#00F6FF] border-b-2 border-[#00F6FF]' : 'text-[#8F9BB3] hover:text-white transition-colors'}`}
                  onClick={() => setActiveTab('props')}
                >
                  Props
                </button>
              </div>
              <div className="p-4" id="picks">
                {activeTab === 'singles' && <OverDogPicks games={games} oddsFormat={oddsFormat} />}
                {activeTab === 'parlays' && <div className="text-white text-center">Parlays Coming Soon</div>}
                {activeTab === 'props' && <NHLProps />}
              </div>
            </div>
          </div>

          {/* Standings */}
          <NHLStandings />
        </div>
      </div>
    </div>
  );
};

export default NHLPage;

import React, { useState } from 'react';
import { NHLGame } from '../../../types/nhl';
import { OddsFormat } from '../../../types/odds';
import { getTeamAbbreviation } from '../../../utils/nhlUtils';
import BettingModal from './BettingModal';

interface OverDogPicksProps {
  games: NHLGame[];
  oddsFormat: OddsFormat;
}

const OverDogPicks: React.FC<OverDogPicksProps> = ({ games, oddsFormat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<NHLGame | null>(null);

  const handleAddBet = (game: NHLGame, e: React.MouseEvent) => {
    e.stopPropagation();
    if (game["Predicted Winner"] !== "AI Unsure") {
      setSelectedGame(game);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Game Cards Grid */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div 
              key={game.GameID} 
              className="bg-gradient-to-br from-[#1A1A23] to-[#13131A] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] hover:border-[#4263EB] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {/* Teams Display */}
              <div className="p-6">
                <div className="flex flex-col space-y-4">
                  {/* Away Team */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[#13131A] p-2 flex items-center justify-center shadow-inner">
                      <img 
                        src={`/assets/img/nhl-logos/${getTeamAbbreviation(game["Away Team"] || "")}.png`} 
                        className="w-12 h-12 object-contain" 
                        alt={game["Away Team"] || "Away Team"}
                      />
                    </div>
                    <span className="text-white text-xl font-semibold flex-1">{game["Away Team"] || "TBD"}</span>
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
                        src={`/assets/img/nhl-logos/${getTeamAbbreviation(game["Home Team"] || "")}.png`} 
                        className="w-12 h-12 object-contain" 
                        alt={game["Home Team"] || "Home Team"}
                      />
                    </div>
                    <span className="text-white text-xl font-semibold flex-1">{game["Home Team"] || "TBD"}</span>
                  </div>
                </div>
              </div>

              {/* Prediction */}
              <div className="bg-[#13131A] p-6 border-t border-[rgba(255,255,255,0.05)]">
                {game["Predicted Winner"] === "AI Unsure" ? (
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
                        {game["Predicted Winner"]} to Win
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
          ))}
        </div>
      </div>
      
      {selectedGame && selectedGame.GameID && (
        <BettingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedGame(null);
          }}
          game={selectedGame}
          eventId={selectedGame.GameID.toString()}
          oddsFormat={oddsFormat}
        />
      )}
    </>
  );
};

export default OverDogPicks;

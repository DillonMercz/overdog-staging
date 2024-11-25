import React, { useState } from 'react';
import { NHLGame } from '../../../types/nhl';
import { OddsFormat, convertOdds } from '../../../types/odds';
import { getGamePrediction, getTeamAbbreviation } from '../../../utils/nhlUtils';
import BettingModal from './BettingModal';

interface OverDogPicksProps {
  games: NHLGame[];
  oddsFormat: OddsFormat;
}

const OverDogPicks: React.FC<OverDogPicksProps> = ({ games, oddsFormat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<NHLGame | null>(null);

  const handleCardClick = (game: NHLGame) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {games.map((game) => {
          const prediction = getGamePrediction(game);

          return (
            <div 
              key={game.GameID} 
              className="rounded-xl bg-[#13131A] border border-[rgba(255,255,255,0.05)] hover:border-[#4263EB] transition-all duration-300 group p-4 cursor-pointer"
              onClick={() => handleCardClick(game)}
            >
              {/* Game Header */}
              <div className="grid gap-2 mb-6">
                <div className="flex gap-2 items-center">
                  <img 
                    src={`/assets/img/nhl-logos/${getTeamAbbreviation(game["Away Team"])}.png`} 
                    className="w-6 h-6" 
                    alt={game["Away Team"]}
                  />
                  <span className="text-white font-medium">{game["Away Team"]}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <img 
                    src={`/assets/img/nhl-logos/${getTeamAbbreviation(game["Home Team"])}.png`} 
                    className="w-6 h-6" 
                    alt={game["Home Team"]}
                  />
                  <span className="text-white font-medium">{game["Home Team"]}</span>
                </div>
              </div>

              {/* Predictions Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Winner Prediction */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8F9BB3] text-sm">Winner</span>
                    <span className="text-white font-medium">
                      {convertOdds(prediction.defaultOdds, oddsFormat)}
                    </span>
                  </div>
                  {prediction.winningTeam ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00F6FF]"></div>
                      <span className="text-[#00F6FF]">{prediction.winningTeam} to win</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-[rgba(255,212,38,0.1)] text-[#FFD426] text-sm inline-block">
                      AI Unsure
                    </div>
                  )}
                </div>

                {/* Goals Prediction */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8F9BB3] text-sm">Total Goals</span>
                    <span className="text-white font-medium">
                      {convertOdds(prediction.defaultOdds, oddsFormat)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00F6FF]"></div>
                    <span className="text-[#00F6FF]">Over 5.5</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedGame && (
        <BettingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          game={selectedGame}
          oddsFormat={oddsFormat}
        />
      )}
    </>
  );
};

export default OverDogPicks;
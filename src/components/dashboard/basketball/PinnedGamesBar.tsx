import React from 'react';
import { usePinnedGames } from '../../../contexts/PinnedGamesContext';

const getTeamName = (teamName: string): string => {
  const areas = ['Atlanta', 'Boston', 'Brooklyn', 'Charlotte', 'Chicago', 'Cleveland', 'Dallas', 'Denver', 'Detroit', 'Golden State', 'Houston', 'Indiana', 'Los Angeles', 'LA', 'Memphis', 'Miami', 'Milwaukee', 'Minnesota', 'New Orleans', 'New York', 'Oklahoma City', 'Orlando', 'Philadelphia', 'Phoenix', 'Portland', 'Sacramento', 'San Antonio', 'Toronto', 'Utah', 'Washington', 'LA', 'Los Angeles'];
  let strippedName = teamName;
  for (let area of areas) {
    if (teamName.includes(area)) {
      strippedName = teamName.replace(area + ' ', '');
      if (strippedName === "Timberwolves") {
        strippedName = 'Timber Wolves';
      }
      break;
    }
  }
  if (teamName === "Timberwolves") {
    strippedName = "Timber Wolves";
  }
  return strippedName.trim();
};

const PinnedGamesBar: React.FC = () => {
  const { pinnedGames, unpinGame } = usePinnedGames();

  if (pinnedGames.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A23] border-t border-[#2E3449] p-2 flex gap-4 overflow-x-auto">
      {pinnedGames.map((game) => (
        <div
          key={game.gameId}
          className="relative flex flex-col bg-[#13131A] rounded-lg p-2 min-w-[160px] group"
        >
          {/* Game Status */}
          <div className="text-center mb-2">
            <span className={`text-xs font-medium ${
              game.gameStatusText.includes('Final') ? 'text-[#4ADE80]' :
              game.period > 0 ? 'text-[#8F9BB3]' : 'text-[#8F9BB3]'
            }`}>
              {game.gameStatusText} {game.gameClock && !game.gameStatusText.includes('Final') ? `(${game.gameClock})` : ''}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/5 p-1 flex items-center justify-center">
                <img
                  src={`/assets/img/nba-logos/${getTeamName(game.awayTeam.teamName).toLowerCase()}.png`}
                  alt={game.awayTeam.teamName}
                  className="w-4 h-4 object-contain"
                />
              </div>
              <span className="text-white font-medium">{game.awayTeam.teamTricode}</span>
            </div>
            <span className="text-white font-bold">{game.awayTeam.score}</span>
          </div>

          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/5 p-1 flex items-center justify-center">
                <img
                  src={`/assets/img/nba-logos/${getTeamName(game.homeTeam.teamName).toLowerCase()}.png`}
                  alt={game.homeTeam.teamName}
                  className="w-4 h-4 object-contain"
                />
              </div>
              <span className="text-white font-medium">{game.homeTeam.teamTricode}</span>
            </div>
            <span className="text-white font-bold">{game.homeTeam.score}</span>
          </div>

          {/* Unpin Button - Visible on Hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <button
              onClick={() => unpinGame(game.gameId)}
              className="text-white hover:text-[#00F6FF] transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PinnedGamesBar;

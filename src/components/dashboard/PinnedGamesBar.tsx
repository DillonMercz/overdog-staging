import React from 'react';
import { usePinnedGames } from '../../contexts/PinnedGamesContext';
import { NHLPinnedGame } from '../../types/nhlPredictions';
import { NBAGame } from '../../types/nba';

const getTeamName = (teamName: string | undefined): string => {
  if (!teamName) return 'unknown';
  
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

const isNHLGame = (game: any): game is NHLPinnedGame => {
  return 'name' in game.awayTeam && 'default' in game.awayTeam.name;
};

const getNHLTeamAbbrev = (fullName: string): string => {
  // Map full team names to their abbreviations
  const nameToAbbrev: { [key: string]: string } = {
    'Golden Knights': 'VGK',
    'Vegas Golden Knights': 'VGK',
    'Knights':'VGK',
    'Maple Leafs': 'TOR',
    'Leafs':'TOR',
    'Toronto Maple Leafs': 'TOR',
    'Hurricanes': 'CAR',
    'Carolina Hurricanes': 'CAR',
    'Flyers': 'PHI',
    'Philadelphia Flyers': 'PHI',
    'Sharks': 'SJS',
    'San Jose Sharks': 'SJS',
    'Stars': 'DAL',
    'Dallas Stars': 'DAL',
    'Predators': 'NSH',
    'Nashville Predators': 'NSH',
    'Kraken': 'SEA',
    'Seattle Kraken': 'SEA',
    'Sabres': 'BUF',
    'Buffalo Sabres': 'BUF',
    'Kings': 'LAK',
    'Los Angeles Kings': 'LAK',
    'Ducks': 'ANA',
    'Anaheim Ducks': 'ANA',
    'Blackhawks': 'CHI',
    'Chicago Blackhawks': 'CHI',
    'Blue Jackets': 'CBJ',
    'Jackets':'CBJ',
    'Columbus Blue Jackets': 'CBJ',
    'Blues': 'STL',
    'St. Louis Blues': 'STL',
    'Bruins': 'BOS',
    'Boston Bruins': 'BOS',
    'Canadiens': 'MTL',
    'Montreal Canadiens': 'MTL',
    'Canucks': 'VAN',
    'Vancouver Canucks': 'VAN',
    'Avalanche': 'COL',
    'Colorado Avalanche': 'COL',
    'Coyotes': 'ARI',
    'Arizona Coyotes': 'ARI',
    'Red Wings': 'DET',
    'Detroit Red Wings': 'DET',
    'Flames': 'CGY',
    'Calgary Flames': 'CGY',
    'Jets': 'WPG',
    'Winnipeg Jets': 'WPG',
    'Lightning': 'TBL',
    'Tampa Bay Lightning': 'TBL',
    'Oilers': 'EDM',
    'Edmonton Oilers': 'EDM',
    'Panthers': 'FLA',
    'Florida Panthers': 'FLA',
    'Penguins': 'PIT',
    'Pittsburgh Penguins': 'PIT',
    'Wild': 'MIN',
    'Minnesota Wild': 'MIN',
    'Capitals': 'WSH',
    'Washington Capitals': 'WSH'
  };

  return nameToAbbrev[fullName] || fullName;
};

const PinnedGamesBar: React.FC = () => {
  const { pinnedGames, unpinGame } = usePinnedGames();

  if (pinnedGames.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A23] border-t border-[#2E3449] p-2 flex gap-4 overflow-x-auto">
      {pinnedGames.map((game) => {
        const isNHL = isNHLGame(game);
        
        // Get team abbreviations for NHL games
        const awayAbbrev = isNHL ? getNHLTeamAbbrev(game.awayTeam.name.default.split(' ').slice(-1)[0]) : null;
        const homeAbbrev = isNHL ? getNHLTeamAbbrev(game.homeTeam.name.default.split(' ').slice(-1)[0]) : null;
        
        return (
          <div
            key={game.gameId}
            className="relative flex flex-col bg-[#13131A] rounded-lg p-2 min-w-[160px] group"
          >
            {/* Game Status */}
            <div className="text-center mb-2">
              <span className={`text-xs font-medium ${
                game.gameStatusText.includes('Final') ? 'text-[#4ADE80]' :
                (isNHL ? game.gameState === "LIVE" : game.period > 0) ? 'text-[#8F9BB3]' : 'text-[#8F9BB3]'
              }`}>
                {game.gameStatusText}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/5 p-1 flex items-center justify-center">
                  {isNHL ? (
                    <img
                      src={`/assets/img/nhl-logos/${awayAbbrev}.png`}
                      alt={game.awayTeam.name.default}
                      className="w-4 h-4 object-contain"
                    />
                  ) : (
                    <img
                      src={`/assets/img/nba-logos/${getTeamName(game.awayTeam.teamName).toLowerCase()}.png`}
                      alt={game.awayTeam.teamName}
                      className="w-4 h-4 object-contain"
                    />
                  )}
                </div>
                <span className="text-white font-medium">
                  {isNHL 
                    ? awayAbbrev
                    : game.awayTeam.teamTricode
                  }
                </span>
              </div>
              <span className="text-white font-bold">{game.awayTeam.score || 0}</span>
            </div>

            {/* Home Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/5 p-1 flex items-center justify-center">
                  {isNHL ? (
                    <img
                      src={`/assets/img/nhl-logos/${homeAbbrev}.png`}
                      alt={game.homeTeam.name.default}
                      className="w-4 h-4 object-contain"
                    />
                  ) : (
                    <img
                      src={`/assets/img/nba-logos/${getTeamName(game.homeTeam.teamName).toLowerCase()}.png`}
                      alt={game.homeTeam.teamName}
                      className="w-4 h-4 object-contain"
                    />
                  )}
                </div>
                <span className="text-white font-medium">
                  {isNHL 
                    ? homeAbbrev
                    : game.homeTeam.teamTricode
                  }
                </span>
              </div>
              <span className="text-white font-bold">{game.homeTeam.score || 0}</span>
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
        );
      })}
    </div>
  );
};

export default PinnedGamesBar;

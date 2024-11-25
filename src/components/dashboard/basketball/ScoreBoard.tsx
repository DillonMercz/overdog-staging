import React, { useState, useMemo } from 'react';
import { ScoreboardData, NBAGame, GameTeam, Period } from '../../../types/nba';
import { usePinnedGames } from '../../../contexts/PinnedGamesContext';

interface Props {
  data: ScoreboardData | null;
  isLoading: boolean;
}

interface GameItemProps {
  game: NBAGame;
  handlePinToggle: (game: NBAGame) => void;
  isPinned: (gameId: string) => boolean;
}

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

const GameItem = React.memo(({ game, handlePinToggle, isPinned }: GameItemProps) => {
  const awayTeamWon = game.gameStatusText.includes('Final') && game.awayTeam.score > game.homeTeam.score;
  const homeTeamWon = game.gameStatusText.includes('Final') && game.homeTeam.score > game.awayTeam.score;
  const gamePinned = isPinned(game.gameId);

  const quarterTotals = game.awayTeam.periods.slice(0, 4).map((_: Period, index: number) => {
    const awayScore = game.awayTeam.periods[index]?.score || 0;
    const homeScore = game.homeTeam.periods[index]?.score || 0;
    return awayScore + homeScore;
  });

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-[#1A1A23] to-[#13131A] backdrop-blur-sm border border-[#2E3449] hover:border-[#00F6FF] transition-all duration-200 group shadow-lg shadow-black/20">
      {/* Game Status and Pin Button */}
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={() => handlePinToggle(game)}
          className="text-[#8F9BB3] hover:text-[#00F6FF] transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={gamePinned ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </button>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
          game.gameStatusText.includes('Final') ? 'bg-[#4ADE80]/10 text-[#4ADE80]' :
          game.period > 0 ? 'bg-[#8F9BB3]/10 text-[#8F9BB3]' : 'bg-[#8F9BB3]/10 text-[#8F9BB3]'
        }`}>
          {game.gameStatusText} {game.gameClock && !game.gameStatusText.includes('Final') ? `(${game.gameClock})` : ''}
        </span>
      </div>

      {/* Quarter Headers - Visible on Hover */}
      <div className="grid grid-cols-[1fr_repeat(5,40px)] gap-2 mb-4 hidden group-hover:grid">
        <div></div>
        <div className="text-[#8F9BB3] text-sm text-center font-medium">Q1</div>
        <div className="text-[#8F9BB3] text-sm text-center font-medium">Q2</div>
        <div className="text-[#8F9BB3] text-sm text-center font-medium">Q3</div>
        <div className="text-[#8F9BB3] text-sm text-center font-medium">Q4</div>
        <div className="text-[#8F9BB3] text-sm text-center font-medium">T</div>
      </div>

      {/* Away Team */}
      <div className="grid grid-cols-[1fr_auto] group-hover:grid-cols-[1fr_repeat(5,40px)] gap-2 items-center mb-5">
        <div className="flex items-center gap-4 relative">
          <div className="w-8 h-8 rounded-full bg-white/5 p-1 flex items-center justify-center">
            <img
              src={`/assets/img/nba-logos/${getTeamName(game.awayTeam.teamName).toLowerCase()}.png`}
              alt={game.awayTeam.teamName}
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <div className="text-white font-bold text-lg">
              <span className="hidden group-hover:inline">{game.awayTeam.teamTricode}</span>
              <span className="group-hover:hidden">{game.awayTeam.teamCity} {game.awayTeam.teamName}</span>
            </div>
            <div className="text-[#8F9BB3] text-sm font-medium">
              ({game.awayTeam.wins}-{game.awayTeam.losses})
            </div>
          </div>
        </div>
        {game.awayTeam.periods.slice(0, 4).map((period: Period, index: number) => (
          <div key={index} className="text-[#8F9BB3] text-center font-medium hidden group-hover:block">
            {period.score}
          </div>
        ))}
        <div className="text-white font-bold text-lg text-center relative">
          {game.awayTeam.score}
          {awayTeamWon && <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-green-500"></span>}
        </div>
      </div>

      {/* Home Team */}
      <div className="grid grid-cols-[1fr_auto] group-hover:grid-cols-[1fr_repeat(5,40px)] gap-2 items-center">
        <div className="flex items-center gap-4 relative">
          <div className="w-8 h-8 rounded-full bg-white/5 p-1 flex items-center justify-center">
            <img
              src={`/assets/img/nba-logos/${getTeamName(game.homeTeam.teamName).toLowerCase()}.png`}
              alt={game.homeTeam.teamName}
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <div className="text-white font-bold text-lg">
              <span className="hidden group-hover:inline">{game.homeTeam.teamTricode}</span>
              <span className="group-hover:hidden">{game.homeTeam.teamCity} {game.homeTeam.teamName}</span>
            </div>
            <div className="text-[#8F9BB3] text-sm font-medium">
              ({game.homeTeam.wins}-{game.homeTeam.losses})
            </div>
          </div>
        </div>
        {game.homeTeam.periods.slice(0, 4).map((period: Period, index: number) => (
          <div key={index} className="text-[#8F9BB3] text-center font-medium hidden group-hover:block">
            {period.score}
          </div>
        ))}
        <div className="text-white font-bold text-lg text-center relative">
          {game.homeTeam.score}
          {homeTeamWon && <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-green-500"></span>}
        </div>
      </div>

      {/* Quarter Totals - Hidden on Hover */}
      <div className="grid grid-cols-[1fr_repeat(5,40px)] gap-2 mt-4 pt-4 border-t border-[#2E3449] group-hover:hidden">
        <div className="text-[#8F9BB3] text-sm font-medium">Quarter Totals</div>
        {quarterTotals.map((total: number, index: number) => (
          <div key={index} className="text-center">
            <div className="text-[#8F9BB3] text-xs mb-1">Q{index + 1}</div>
            <div className="text-white font-bold">
              {total}
            </div>
          </div>
        ))}
        <div className="text-center">
          <div className="text-[#8F9BB3] text-xs mb-1">Total</div>
          <div className="text-white font-bold">
            {game.awayTeam.score + game.homeTeam.score}
          </div>
        </div>
      </div>
    </div>
  );
});

const Scoreboard = ({ data, isLoading }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { pinGame, unpinGame, isPinned, pinnedGames } = usePinnedGames();

  const handlePinToggle = (game: NBAGame) => {
    if (isPinned(game.gameId)) {
      unpinGame(game.gameId);
    } else {
      pinGame(game);
    }
  };

  const sortedAndFilteredGames = useMemo(() => {
    if (!data?.games) return [];
    
    return data.games
      .slice()
      .sort((a, b) => {
        if (a.gameStatusText.includes('Final') && !b.gameStatusText.includes('Final')) return 1;
        if (!a.gameStatusText.includes('Final') && b.gameStatusText.includes('Final')) return -1;
        return 0;
      })
      .filter(game => {
        const searchLower = searchTerm.toLowerCase();
        return (
          game.awayTeam.teamCity.toLowerCase().includes(searchLower) ||
          game.awayTeam.teamName.toLowerCase().includes(searchLower) ||
          game.homeTeam.teamCity.toLowerCase().includes(searchLower) ||
          game.homeTeam.teamName.toLowerCase().includes(searchLower) ||
          game.awayTeam.teamTricode.toLowerCase().includes(searchLower) ||
          game.homeTeam.teamTricode.toLowerCase().includes(searchLower)
        );
      });
  }, [data?.games, searchTerm]);

  // Only show loading state when we have no data at all
  if (isLoading && !data) {
    return (
      <div className="p-4">
        <div className="text-center text-[#8F9BB3] py-8">
          Loading games...
        </div>
      </div>
    );
  }

  if (!data || !data.games || data.games.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center text-[#8F9BB3] py-8">
          No games scheduled for today
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      {/* Search Box */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[#1A1A23] border border-[#2E3449] rounded-lg text-white placeholder-[#8F9BB3] focus:outline-none focus:border-[#00F6FF] transition-colors"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8F9BB3]"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {sortedAndFilteredGames.map((game) => (
          <GameItem
            key={game.gameId}
            game={game}
            handlePinToggle={handlePinToggle}
            isPinned={isPinned}
          />
        ))}
      </div>
    </div>
  );
};

export default Scoreboard;

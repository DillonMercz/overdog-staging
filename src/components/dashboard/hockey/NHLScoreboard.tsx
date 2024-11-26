import React, { useState, useMemo } from 'react';
import { NHLScoresResponse, NHLGameScore, NHLPinnedGame } from '../../../types/nhlPredictions';
import { usePinnedGames } from '../../../contexts/PinnedGamesContext';
import { getTeamAbbreviation } from '../../../utils/nhlUtils';

interface Props {
  data: NHLScoresResponse | null;
  isLoading: boolean;
}

interface GameItemProps {
  game: NHLGameScore;
  handlePinToggle: (game: NHLGameScore) => void;
  isPinned: (gameId: string) => boolean;
}

const getNHLLogoPath = (teamName: string): string => {
  const abbrev = getTeamAbbreviation(teamName);
  // Special cases for team names that don't match the abbreviation pattern
  const specialCases: { [key: string]: string } = {
    'CHI': 'Blackhawks',
    'CBJ': 'BlueJackets',
    'STL': 'Blues',
    'MTL': 'Canadiens',
    'VAN': 'Canucks',
    'ARI': 'Coyotes',
    'CGY': 'Flames',
    'PHI': 'Flyers',
    'WPG': 'Jets',
    'SEA': 'Kraken',
    'TBL': 'Lightning',
    'EDM': 'Oilers',
    'FLA': 'Panthers',
    'NSH': 'Predators',
    'SJS': 'Sharks',
    'DAL': 'Stars',
    'MIN': 'Wild'
  };
  
  return specialCases[abbrev] ? 
    `/assets/img/nhl-logos/${specialCases[abbrev]}.png` :
    `/assets/img/nhl-logos/${abbrev}.png`;
};

const convertToNHLPinnedGame = (game: NHLGameScore): NHLPinnedGame => {
  const gameStatusText = game.gameState === "FINAL" || game.gameState === "OFF" ? "Final" :
                        game.gameState === "LIVE" || game.gameState === "CRIT" ? `P${game.period} - ${game.clock?.timeRemaining}` :
                        game.gameState === "INTERMISSION" ? "Intermission" :
                        new Date(game.startTimeUTC).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        });

  return {
    ...game,
    gameStatusText,
    gameClock: game.clock?.timeRemaining || '',
    gameTimeUTC: game.startTimeUTC,
    awayTeam: {
      ...game.awayTeam,
      teamId: 0,
      teamName: game.awayTeam.name.default,
      teamCity: '',
      teamTricode: '',
      wins: 0,
      losses: 0,
      periods: [],
      logo: getNHLLogoPath(game.awayTeam.name.default) // Use local logo path for pinned games
    },
    homeTeam: {
      ...game.homeTeam,
      teamId: 0,
      teamName: game.homeTeam.name.default,
      teamCity: '',
      teamTricode: '',
      wins: 0,
      losses: 0,
      periods: [],
      logo: getNHLLogoPath(game.homeTeam.name.default) // Use local logo path for pinned games
    }
  };
};

const GameItem = React.memo(({ game, handlePinToggle, isPinned }: GameItemProps) => {
  // Create a unique gameId using game properties
  const gameId = game.gameId || `${game.startTimeUTC}-${game.awayTeam.name.default}-${game.homeTeam.name.default}`;
  const gamePinned = isPinned(gameId);
  const isFinal = game.gameState === "FINAL" || game.gameState === "OFF";
  const isLive = game.gameState === "LIVE" || game.gameState === "CRIT";

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
          isFinal ? 'bg-[#4ADE80]/10 text-[#4ADE80]' :
          isLive ? 'bg-[#8F9BB3]/10 text-[#8F9BB3]' : 'bg-[#8F9BB3]/10 text-[#8F9BB3]'
        }`}>
          {isFinal ? 'Final' : 
           isLive ? `P${game.period} - ${game.clock?.timeRemaining}` :
           game.gameState === "INTERMISSION" ? 'Intermission' : 
           new Date(game.startTimeUTC).toLocaleTimeString('en-US', { 
             hour: 'numeric', 
             minute: '2-digit',
             hour12: true 
           })}
        </span>
      </div>

      {/* Away Team */}
      <div className="grid grid-cols-[1fr_auto] items-center mb-5">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-white/5 p-1 flex items-center justify-center">
            <img
              src={game.awayTeam.logo}
              alt={game.awayTeam.name.default}
              className="w-6 h-6 object-contain"
            />
          </div>
          <div className="text-white font-bold text-lg">
            {game.awayTeam.name.default}
          </div>
        </div>
        <div className="text-white font-bold text-lg text-center relative">
          {game.awayTeam.score || 0}
          {isFinal && game.awayTeam.score > game.homeTeam.score && 
            <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-green-500"></span>
          }
        </div>
      </div>

      {/* Home Team */}
      <div className="grid grid-cols-[1fr_auto] items-center">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-white/5 p-1 flex items-center justify-center">
            <img
              src={game.homeTeam.logo}
              alt={game.homeTeam.name.default}
              className="w-6 h-6 object-contain"
            />
          </div>
          <div className="text-white font-bold text-lg">
            {game.homeTeam.name.default}
          </div>
        </div>
        <div className="text-white font-bold text-lg text-center relative">
          {game.homeTeam.score || 0}
          {isFinal && game.homeTeam.score > game.awayTeam.score && 
            <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-green-500"></span>
          }
        </div>
      </div>

      {/* Total Score */}
      <div className="grid grid-cols-[1fr_auto] items-center mt-4 pt-4 border-t border-[#2E3449]">
        <div className="text-[#8F9BB3] text-sm font-medium">Total Score</div>
        <div className="text-white font-bold text-lg text-center">
          {(game.awayTeam.score || 0) + (game.homeTeam.score || 0)}
        </div>
      </div>
    </div>
  );
});

const NHLScoreboard = ({ data, isLoading }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { pinGame, unpinGame, isPinned } = usePinnedGames();

  const handlePinToggle = (game: NHLGameScore) => {
    // Create a unique gameId using game properties
    const gameId = game.gameId || `${game.startTimeUTC}-${game.awayTeam.name.default}-${game.homeTeam.name.default}`;
    if (isPinned(gameId)) {
      unpinGame(gameId);
    } else {
      const pinnedGame = convertToNHLPinnedGame({
        ...game,
        gameId // Ensure gameId is set
      });
      pinGame(pinnedGame);
    }
  };

  const sortedAndFilteredGames = useMemo(() => {
    if (!data?.games) return [];
    
    return data.games
      .slice()
      .map(game => ({
        ...game,
        gameId: game.gameId || `${game.startTimeUTC}-${game.awayTeam.name.default}-${game.homeTeam.name.default}`
      }))
      .sort((a, b) => {
        if ((a.gameState === "FINAL" || a.gameState === "OFF") && 
            !(b.gameState === "FINAL" || b.gameState === "OFF")) return 1;
        if (!(a.gameState === "FINAL" || a.gameState === "OFF") && 
            (b.gameState === "FINAL" || b.gameState === "OFF")) return -1;
        return 0;
      })
      .filter(game => {
        const searchLower = searchTerm.toLowerCase();
        return (
          game.awayTeam.name.default.toLowerCase().includes(searchLower) ||
          game.homeTeam.name.default.toLowerCase().includes(searchLower)
        );
      });
  }, [data?.games, searchTerm]);

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
            key={`${game.startTimeUTC}-${game.awayTeam.name.default}-${game.homeTeam.name.default}`}
            game={game}
            handlePinToggle={handlePinToggle}
            isPinned={isPinned}
          />
        ))}
      </div>
    </div>
  );
};

export default NHLScoreboard;

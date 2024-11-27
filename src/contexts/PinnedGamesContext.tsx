import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NBAGame } from '../types/nba';
import { NHLPinnedGame } from '../types/nhlPredictions';

type PinnedGame = NBAGame | NHLPinnedGame;

interface PinnedGamesContextType {
  pinnedGames: PinnedGame[];
  pinGame: (game: PinnedGame) => void;
  unpinGame: (gameId: string) => void;
  isPinned: (gameId: string) => boolean;
}

const PinnedGamesContext = createContext<PinnedGamesContextType | undefined>(undefined);

const STORAGE_KEY = 'pinnedGames';

export const PinnedGamesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [pinnedGames, setPinnedGames] = useState<PinnedGame[]>(() => {
    try {
      const savedGames = localStorage.getItem(STORAGE_KEY);
      return savedGames ? JSON.parse(savedGames) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever pinnedGames changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedGames));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [pinnedGames]);

  const pinGame = (game: PinnedGame) => {
    console.log('Attempting to pin game:', game.gameId); // Debug log
    setPinnedGames(prev => {
      if (!prev.find(g => g.gameId === game.gameId)) {
        console.log('Adding game to pinned games'); // Debug log
        return [...prev, game];
      }
      console.log('Game already pinned'); // Debug log
      return prev;
    });
  };

  const unpinGame = (gameId: string) => {
    console.log('Attempting to unpin game:', gameId); // Debug log
    setPinnedGames(prev => {
      const filtered = prev.filter(game => game.gameId !== gameId);
      console.log('Remaining pinned games:', filtered); // Debug log
      return filtered;
    });
  };

  const isPinned = (gameId: string) => {
    const result = pinnedGames.some(game => game.gameId === gameId);
    return result;
  };

  const value = {
    pinnedGames,
    pinGame,
    unpinGame,
    isPinned,
  };

  return (
    <PinnedGamesContext.Provider value={value}>
      {children}
    </PinnedGamesContext.Provider>
  );
};

export const usePinnedGames = () => {
  const context = useContext(PinnedGamesContext);
  if (context === undefined) {
    throw new Error('usePinnedGames must be used within a PinnedGamesProvider');
  }
  return context;
};

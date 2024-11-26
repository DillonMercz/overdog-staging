import { PlayerStatsResponse, LineCheckResponse } from '../types/nbaPlayerStats';
import { supabase } from '../lib/supabase/client';

const statTypeMapping: { [key: string]: string } = {
  'Points': 'PTS',
  'Assists': 'AST',
  'Rebounds': 'REB',
  'Steals': 'STL',
  'Blocks': 'BLK',
  '3 Points': 'FG3M',
  'PTS_AST': 'PTS_AST',
  'PTS_REB': 'PTS_REB',
  'PTS_AST_REB': 'PTS_AST_REB',
  'DD': 'DD',
  'TD': 'TD'
};

export const fetchPlayerStats = async (
  playerName: string,
  season: string,
  accessToken: string
): Promise<PlayerStatsResponse> => {
  try {
    const response = await fetch(`/api/player-stats?player=${encodeURIComponent(playerName)}&season=${season}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch player stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching player stats:', error);
    throw error;
  }
};

export const checkLine = async (
  playerName: string,
  season: string,
  statType: string,
  statValue: number,
  overUnder: 'over' | 'under',
  accessToken: string
): Promise<LineCheckResponse> => {
  try {
    const mappedStatType = statTypeMapping[statType] || statType;

    const response = await fetch('/api/check-line', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        player_name: playerName,
        season: season,
        stat_type: mappedStatType,
        stat_value: statValue,
        over_under: overUnder
      })
    });

    if (!response.ok) {
      throw new Error('Failed to check line');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking line:', error);
    throw error;
  }
};

export const getPlayerSuggestions = async (
  query: string,
  accessToken: string
): Promise<string[]> => {
  try {
    const response = await fetch(`/api/player-suggestions?query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get player suggestions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting player suggestions:', error);
    throw error;
  }
};

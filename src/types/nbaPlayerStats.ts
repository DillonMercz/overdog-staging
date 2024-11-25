export interface PlayerStats {
  PLAYER_ID: number,
  GAME_DATE: string;
  MATCHUP: string;
  MIN: string;
  PTS: number;
  AST: number;
  REB: number;
  STL: number;
  BLK: number;
  TOV: number;
  FG3M: number;
  PF: number;
  DD: 'YES' | 'NO';
  TD: 'YES' | 'NO';
}

export interface AverageStats {
  PTS: number;
  AST: number;
  REB: number;
  STL: number;
  BLK: number;
  TOV: number;
  FG3M: number;
  PF: number;
}

export interface PlayerStatsResponse {
  stats: PlayerStats[];
  seasons: string[];
  player_id: number;
  error?: string;
}

export interface LineCheckResponse {
  message: string;
  success: boolean;
  error?: string;
}

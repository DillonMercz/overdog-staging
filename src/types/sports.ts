export interface SportsDataResponse {
  NBA: LeagueData;
  MLB: LeagueData;
  NHL: LeagueData;
  NFL: LeagueData;
  [key: string]: LeagueData;
}

export interface LeagueData {
  players: SportPlayer[];
  teams: SportTeam[];
}

export interface SportPlayer {
  id: string | number;
  full_name: string;
  type: 'player';
  league: string;
  [key: string]: any; // For additional league-specific fields
}

export interface SportTeam {
  id: string | number;
  full_name: string;
  abbreviation: string;
  type: 'team';
  league: string;
  [key: string]: any; // For additional league-specific fields
}

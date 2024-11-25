export type SearchCategory = 'Players' | 'Teams' | 'Events';
export type League = 'NBA' | 'MLB' | 'NHL' | 'NFL';

export interface BasePlayer {
  id: number | string;
  full_name: string;
  type: 'player';
  league: League;
}

export interface BaseTeam {
  id: number | string;
  full_name: string;
  abbreviation: string;
  type: 'team';
  league: League;
}

export interface NBAPlayer extends BasePlayer {
  first_name: string;
  last_name: string;
  is_active: boolean;
  league: 'NBA';
}

export interface NBATeam extends BaseTeam {
  nickname: string;
  city: string;
  state: string;
  year_founded: number;
  league: 'NBA';
}

export interface MLBPlayer extends BasePlayer {
  league: 'MLB';
}

export interface MLBTeam extends BaseTeam {
  league: 'MLB';
}

export interface NHLPlayer extends BasePlayer {
  league: 'NHL';
}

export interface NHLTeam extends BaseTeam {
  league: 'NHL';
}

export interface NFLPlayer extends BasePlayer {
  league: 'NFL';
}

export interface NFLTeam extends BaseTeam {
  league: 'NFL';
}

export type Player = NBAPlayer | MLBPlayer | NHLPlayer | NFLPlayer;
export type Team = NBATeam | MLBTeam | NHLTeam | NFLTeam;

export interface SearchResult {
  id: string | number;
  text: string;
  category: SearchCategory;
  data: Player | Team | { type: string };
}

export interface SearchComponentProps {
  onSelect: (result: SearchResult) => void;
  placeholder?: string;
}

// types/betting.ts

export interface SportInfo {
  name: string;
}

export interface LeagueInfo {
  name: string;
  country: string | null;
}

export interface LegTypeInfo {
  name: string;
}

export interface BetTypeInfo {
  name: string;
}

export interface BetStatusInfo {
  name: string;
}

export interface BookmakerInfo {
  name: string;
}

export interface BetLeg {
  id: string;
  bet_id: string;
  sport_id: string;
  league_id: string;
  event_name: string;
  selection: string;
  result?: string;
  event_start: string;
  event_end?: string;
  created_at: string;
  updated_at: string;
  odds_type_id: string;
  odds: string;
  leg_type_id: string;
  event_id?: string;
  bet_status_id: string;
  sport: SportInfo;
  league: LeagueInfo;
  leg_type: LegTypeInfo;
  bet_status: BetStatusInfo;
}

export interface Bet {
  id: string;
  user_id: string;
  bookmaker_id: string;
  bet_type_id: string;
  bet_status_id: string;
  stake: number;
  potential_payout: number;
  placed_at: string;
  settled_at?: string;
  is_cashout: boolean;
  cashout_value?: number;
  created_at: string;
  updated_at: string;
  odds_type_id: string;
  odds: string;
  bookmaker: BookmakerInfo;
  bet_type: BetTypeInfo;
  bet_status: BetStatusInfo;
  legs: BetLeg[];
}

export interface CreateBetData {
  bookmaker_id: string;
  bet_type_id: string;
  bet_status_id?: string; // Optional since it will be set in trackBet
  stake: number;
  odds_type_id: string;
  odds: string;
  legs: BetLegData[];
}

export interface BetLegData {
  sport_id: string;
  league_id: string;
  event_name: string;
  selection: string;
  event_start: string;
  odds_type_id: string;
  odds: string;
  leg_type_id: string;
  event_id?: string;
  bet_status_id?: string; // Optional since it will be set in trackBet
}

export interface OddsType {
  id: string;
  name: string;
  description?: string;
}

export interface BetLegType {
  id: string;
  name: string;
  description?: string;
}

export interface BetStatus {
  id: string;
  name: string;
  description?: string;
}

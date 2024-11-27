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

// Base interface for creating bets
export interface CreateBetData {
  bookmaker_id: string;
  bet_type_id: string;
  bet_status_id: string; // Added bet_status_id field
  stake: number;
  odds_type_id: string;
  odds: string;
  legs: BetLegData[];
}

// Interface for creating single bets (exactly one leg)
export interface CreateSingleBetData extends CreateBetData {
  legs: [BetLegData]; // Array of exactly one leg
}

// Interface for creating parlay bets (multiple legs)
export interface CreateParlayBetData extends CreateBetData {
  legs: BetLegData[]; // Array of multiple legs
}

// Data for a bet leg (used when creating bets)
export interface BetLegData {
  sport_id: string;
  league_id: string;
  event_name: string;
  selection: string;
  event_start: string;
  odds_type_id: string;
  odds: string;
  leg_type_id?: string; // Optional since it's set by database trigger
  event_id?: string;
  prediction_id?: string; // Added prediction_id field
  bet_status_id: string; // Added bet_status_id field
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

// Constants for bet types
export const BET_TYPES = {
  SINGLE: 'Single',
  PARLAY: 'Parlay'
} as const;

// Constants for bet status
export const BET_STATUS = {
  PENDING: 'Pending',
  WON: 'Won',
  LOST: 'Lost',
  CANCELLED: 'Cancelled',
  CASHOUT: 'Cashout'
} as const;

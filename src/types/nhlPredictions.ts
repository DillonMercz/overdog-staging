export interface NHLPrediction {
  'Away Team': string;
  'Home Team': string;
  'Pre-Game Away Win Probability': string;
  'Pre-Game Home Win Probability': string;
  'Predicted Winner': string | null;
  'id': string; // The prediction UUID
  'event_id': string; // The event ID
}

export interface NHLPlayerStats {
  goals: number;
  shots: number;
  assists: number;
  points: number;
}

export interface NHLPropsResponse {
  [playerName: string]: NHLPlayerStats;
}

export interface NHLPredictionsResponse {
  [key: string]: NHLPrediction;
}

export interface NHLGameScore {
  gameId: string;
  gameState: string;
  period: number;
  clock?: {
    timeRemaining: string;
    inIntermission: boolean;
  };
  awayTeam: {
    name: {
      default: string;
    };
    score: number;
    logo: string;
  };
  homeTeam: {
    name: {
      default: string;
    };
    score: number;
    logo: string;
  };
  startTimeUTC: string;
}

export interface NHLScoresResponse {
  games: NHLGameScore[];
}

export interface NHLTeamInfo {
  name: {
    default: string;
  };
  score: number;
  logo: string;
  teamId: number;
  teamName: string;
  teamCity: string;
  teamTricode: string;
  wins: number;
  losses: number;
  periods: any[];
}

export interface NHLPinnedGame {
  gameId: string;
  gameStatusText: string;
  gameClock: string;
  gameTimeUTC: string;
  gameState: string;
  period: number;
  clock?: {
    timeRemaining: string;
    inIntermission: boolean;
  };
  awayTeam: {
    name: {
      default: string;
    };
    score: number;
    logo: string;
    teamId?: number;
    teamName?: string;
    teamCity?: string;
    teamTricode?: string;
    wins?: number;
    losses?: number;
    periods?: any[];
  };
  homeTeam: {
    name: {
      default: string;
    };
    score: number;
    logo: string;
    teamId?: number;
    teamName?: string;
    teamCity?: string;
    teamTricode?: string;
    wins?: number;
    losses?: number;
    periods?: any[];
  };
  startTimeUTC: string;
}

export interface NHLStandingTeam {
  id: string;
  name: string;
  displayName: string;
  logo: string;
}

export interface NHLStandingStat {
  name: string;
  displayValue: string;
  value: number;
}

export interface NHLTeamStanding {
  team: NHLStandingTeam;
  stats: NHLStandingStat[];
  position: number;
  isPlayoffSpot: boolean;
  isPlayInSpot: boolean;
}

export interface NHLConference {
  name: string;
  standings: {
    entries: NHLTeamStanding[];
  };
}

export interface NHLStandingsResponse {
  children: NHLConference[];
}

// types/nba.ts

// ESPN API Types
export interface ESPNTeam {
  id: string;
  name: string;
  location: string;
  abbreviation: string;
  displayName?: string;
  shortDisplayName?: string;
  color?: string;
  alternateColor?: string;
  logo?: string;
}

export interface ESPNCompetitor {
  id: string;
  uid?: string;
  type?: string;
  order?: number;
  homeAway: string;
  winner?: boolean;
  score: string;
  team: ESPNTeam;
  statistics?: any[];
  records?: Array<{
    name?: string;
    type?: string;
    summary: string;
  }>;
  linescores?: Array<{
    value: string;
    period: string;
  }>;
}

export interface ESPNStatus {
  clock: number;
  displayClock: string;
  period: number;
  type: {
    id: string;
    name: string;
    state: string;
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
  };
}

export interface ESPNEvent {
  id: string;
  uid?: string;
  date: string;
  name: string;
  shortName: string;
  season?: {
    year: number;
    type: number;
  };
  competitions: Array<{
    id: string;
    date: string;
    type?: {
      id: string;
      abbreviation: string;
    };
    timeValid?: boolean;
    neutralSite?: boolean;
    conferenceCompetition?: boolean;
    playByPlayAvailable?: boolean;
    recent?: boolean;
    venue?: {
      id: string;
      fullName: string;
      address?: {
        city: string;
        state: string;
      };
    };
    competitors: ESPNCompetitor[];
    status: ESPNStatus;
  }>;
  status: ESPNStatus;
}

export interface ESPNScoreboardResponse {
  sports: Array<{
    id: string;
    uid: string;
    name: string;
    slug: string;
    leagues: Array<{
      id: string;
      uid: string;
      name: string;
      abbreviation: string;
      events: ESPNEvent[];
    }>;
  }>;
  events: ESPNEvent[];
}

// Your existing types
export interface Period {
  period: number;
  periodType: string;
  score: number;
}

export interface GameTeam {
  teamId: number;
  teamName: string;
  teamCity: string;
  teamTricode: string;
  score: number;
  wins: number;
  losses: number;
  periods: Period[];
}

export interface NBAGame {
  gameId: string;
  gameStatusText: string;
  period: number;
  gameClock: string;
  gameTimeUTC: string;
  homeTeam: GameTeam;
  awayTeam: GameTeam;
}

export interface ScoreboardData {
  gameDate: string;
  games: NBAGame[];
}

export interface ScoreboardAPIResponse {
  meta: {
    version: number;
    request: string;
    time: string;
    code: number;
  };
  scoreboard: ScoreboardData;
}

// Standings Types (unchanged)
export interface Logo {
  href: string;
  width: number;
  height: number;
  alt: string;
  rel: string[];
  lastUpdated: string;
}

export interface Link {
  language: string;
  rel: string[];
  href: string;
  text: string;
  shortText: string;
  isExternal: boolean;
  isPremium: boolean;
}

export interface StandingsTeam {
  id: string;
  uid: string;
  location: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  isActive: boolean;
  logos: Logo[];
  links: Link[];
}

export interface Stat {
  name: string;
  displayName: string;
  shortDisplayName: string;
  description: string;
  abbreviation: string;
  type: string;
  value: number;
  displayValue: string;
  id?: string;
  summary?: string;
}

export interface TeamStanding {
  team: StandingsTeam;
  stats: Stat[];
}

export interface Conference {
  uid: string;
  id: string;
  name: string;
  abbreviation: string;
  standings: {
    id: string;
    name: string;
    displayName: string;
    links: Link[];
    season: number;
    seasonType: number;
    seasonDisplayName: string;
    entries: TeamStanding[];
  };
}

export interface StandingsAPIResponse {
  children: Conference[];
  links: Link[];
  seasons: Array<{
    year: number;
    startDate: string;
    endDate: string;
    displayName: string;
    types: Array<{
      id: string;
      name: string;
      abbreviation: string;
      startDate: string;
      endDate: string;
      hasStandings: boolean;
    }>;
  }>;
}

// Helper function to transform ESPN data to your format
export function transformESPNToScoreboard(espnData: ESPNScoreboardResponse): ScoreboardData {
  return {
    gameDate: new Date().toISOString().split('T')[0],
    games: espnData.events.map(event => ({
      gameId: event.id,
      gameStatusText: event.status.type.shortDetail,
      period: event.status.period,
      gameClock: event.status.displayClock,
      gameTimeUTC: event.date,
      homeTeam: transformESPNTeam(event.competitions[0].competitors.find(c => c.homeAway === 'home')!),
      awayTeam: transformESPNTeam(event.competitions[0].competitors.find(c => c.homeAway === 'away')!)
    }))
  };
}

function transformESPNTeam(competitor: ESPNCompetitor): GameTeam {
  const [wins, losses] = competitor.records?.[0]?.summary.split('-').map(Number) || [0, 0];
  
  return {
    teamId: parseInt(competitor.id),
    teamName: competitor.team.name,
    teamCity: competitor.team.location,
    teamTricode: competitor.team.abbreviation,
    score: parseInt(competitor.score) || 0,
    wins,
    losses,
    periods: competitor.linescores?.map(line => ({
      period: parseInt(line.period),
      periodType: "REGULAR",
      score: parseInt(line.value) || 0
    })) || []
  };
}

// Utility Types (unchanged)
export type ConferenceName = 'Eastern Conference' | 'Western Conference';

export interface TeamRecord {
  wins: number;
  losses: number;
  winPct: string;
  gamesBehind: string;
  lastTenGames: string;
  streak: string;
  conferenceRecord: string;
  homeRecord: string;
  awayRecord: string;
}

export interface StandingsComponentProps {
  data: StandingsAPIResponse;
}

export interface ScoreboardComponentProps {
  data: ScoreboardAPIResponse;
}
import { OddsFormat } from './odds';

export interface NHLGame {
    GameID: string | number;
    "Away Team": string;
    "Home Team": string;
    "Game State": string;
    "Predicted Winner"?: string;
    "Home Goals"?: number;
    "Away Goals"?: number;
    "Pre-Game Home Win Probability"?: string;
    "Pre-Game Away Win Probability"?: string;
    "Home Record"?: string;
    "Away Record"?: string;
    oddsFormat?: OddsFormat;
}

export interface NHLTeam {
    name: string;
    abbreviation: string;
}

interface NHLPlayer {
    PlayerID: number;
    TeamAbbreviation: string;
}

export const NHL_PLAYERS: { [key: string]: NHLPlayer } = {
    // Add player data here
};

export const NHL_TEAM_ABBREVIATIONS = {
    'ANA': 'ANA',
    'ARI': 'ARI',
    'BOS': 'BOS',
    'BUF': 'BUF',
    'CGY': 'CGY',
    'CAR': 'CAR',
    'CHI': 'CHI',
    'COL': 'COL',
    'CBJ': 'CBJ',
    'DAL': 'DAL',
    'DET': 'DET',
    'EDM': 'EDM',
    'FLA': 'FLA',
    'LAK': 'LAK',
    'MIN': 'MIN',
    'MTL': 'MTL',
    'NSH': 'NSH',
    'NJD': 'NJD',
    'NYI': 'NYI',
    'NYR': 'NYR',
    'OTT': 'OTT',
    'PHI': 'PHI',
    'PIT': 'PIT',
    'SJS': 'SJS',
    'SEA': 'SEA',
    'STL': 'STL',
    'TBL': 'TBL',
    'TOR': 'TOR',
    'VAN': 'VAN',
    'VGK': 'VGK',
    'WSH': 'WSH',
    'WPG': 'WPG'
};

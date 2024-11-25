export const DEFAULT_ODDS = -110;
export const HIGH_CONFIDENCE_THRESHOLD = 60;

export const NHL_TEAM_ABBREVIATIONS: { [key: string]: string } = {
    "Anaheim Ducks": "ANA",
    "Arizona Coyotes": "ARI",
    "Boston Bruins": "BOS",
    "Buffalo Sabres": "BUF",
    "Calgary Flames": "CGY",
    "Carolina Hurricanes": "CAR",
    "Chicago Blackhawks": "CHI",
    "Colorado Avalanche": "COL",
    "Columbus Blue Jackets": "CBJ",
    "Dallas Stars": "DAL",
    "Detroit Red Wings": "DET",
    "Edmonton Oilers": "EDM",
    "Florida Panthers": "FLA",
    "Los Angeles Kings": "LAK",
    "Minnesota Wild": "MIN",
    "Montreal Canadiens": "MTL",
    "Nashville Predators": "NSH",
    "New Jersey Devils": "NJD",
    "New York Islanders": "NYI",
    "New York Rangers": "NYR",
    "Ottawa Senators": "OTT",
    "Philadelphia Flyers": "PHI",
    "Pittsburgh Penguins": "PIT",
    "San Jose Sharks": "SJS",
    "Seattle Kraken": "SEA",
    "St. Louis Blues": "STL",
    "Tampa Bay Lightning": "TBL",
    "Toronto Maple Leafs": "TOR",
    "Vancouver Canucks": "VAN",
    "Vegas Golden Knights": "VGK",
    "Washington Capitals": "WSH",
    "Winnipeg Jets": "WPG"
};

export const getWinningTeam = (game: any): string | null => {
    const homeProb = parseFloat(game["Pre-Game Home Win Probability"]);
    const awayProb = parseFloat(game["Pre-Game Away Win Probability"]);
    return homeProb >= HIGH_CONFIDENCE_THRESHOLD 
        ? game["Home Team"] 
        : awayProb >= HIGH_CONFIDENCE_THRESHOLD 
        ? game["Away Team"] 
        : null;
};

export const getTeamAbbreviation = (teamName: string): string => {
    // Remove any numbers or dots from the start of the team name
    const cleanTeamName = teamName.replace(/^\d+\.\s*/, '').trim();
    return NHL_TEAM_ABBREVIATIONS[cleanTeamName] || cleanTeamName.substring(0, 3).toUpperCase();
};

export const getGamePrediction = (game: any) => {
    const homeProb = parseFloat(game["Pre-Game Home Win Probability"]);
    const awayProb = parseFloat(game["Pre-Game Away Win Probability"]);
    
    return {
        winningTeam: getWinningTeam(game),
        confidence: Math.max(homeProb, awayProb),
        defaultOdds: DEFAULT_ODDS
    };
};

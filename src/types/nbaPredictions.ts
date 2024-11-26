export interface NBAPrediction {
  away_team: string;
  home_team: string;
  total: number;
  under_over: "UNDER" | "OVER";
  expected_value_colors: {
    home_color: string;
    away_color: string;
  };
}

export interface NBAPlayerPrediction {
  PLAYER: string;
  PLAYER_ID: string;
  POSITION: string;
  TEAM?: string;  // Player's team
  predictions: {
    PTS: number;
    AST: number;
    REB: number;
    BLK: number;
    STL: number;
  };
}

export interface NBAPredictionsResponse {
  [key: string]: NBAPrediction;
}

export interface NBAPropsResponse {
  [key: string]: NBAPlayerPrediction;
}

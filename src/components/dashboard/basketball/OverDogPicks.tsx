import React, { useState, useEffect , useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';


type NBATeam = string;
type TeamAbbreviation = string;

interface OddsHistory {
  [key: string]: {
    moneyline: {
      home: number;
      away: number;
    };
    totals: {
      allLines: Array<{
        points: number;
        overPrice: number;
        underPrice: number;
      }>;
    };
  };
}

interface PredictionColors {
  home_color: string;
  away_color: string;
}

interface Prediction {
  home_team: string;
  away_team: string;
  winner: number;
  under_over: string;
  winner_confidence: number;
  un_confidence: number;
  total: number;
  expected_value_colors: PredictionColors;
}

interface DetailedOdds {
  moneyline: {
    home: number;
    away: number;
  };
  totals: {
    allLines: Array<{
      points: number;
      overPrice: number;
      underPrice: number;
    }>;
    over: { price: number; points: number };
    under: { price: number; points: number };
  };
}

interface GameOdds {
  [key: string]: {
    home: number;
    away: number;
    homeTeam: string;
    awayTeam: string;
    matchId: number;
    detailedOdds: DetailedOdds | null;  // Changed from DetailedOdds | undefined
  };
}

interface DetailedOddsResponse {
  error: boolean;
  data: [{
    odds: Array<{
      marketId: number;
      outcomeId: number;
      price: number;
      code: string;
      specialBetValue?: string;
      info: string;
      marketName: string;
    }>;
  }];
}

interface OddsResponse {
  data: GameData[];
  error: boolean;
  dataIn: {
    startDate: string;
    tournamentIds: number[];
    lang: string;
  };
}

interface GameData {
  matchName: string;
  odds: OddData[] | null;
  offerStateStatus: {
    [key: string]: string;
  };
  eventId: number;
}

interface OddData {
  code: string;
  price: number;
  info: string;
}

interface Props {
  date?: string;
}

const NBA_TEAM_ABBREVIATIONS: Record<NBATeam, TeamAbbreviation> = {
  "Atlanta Hawks": "ATL",
  "Boston Celtics": "BOS",
  "Brooklyn Nets": "BKN",
  "Charlotte Hornets": "CHA",
  "Chicago Bulls": "CHI",
  "Cleveland Cavaliers": "CLE",
  "Dallas Mavericks": "DAL",
  "Denver Nuggets": "DEN",
  "Detroit Pistons": "DET",
  "Golden State Warriors": "GSW",
  "Houston Rockets": "HOU",
  "Indiana Pacers": "IND",
  "Los Angeles Clippers": "LAC",
  "Los Angeles Lakers": "LAL",
  "LA Lakers": "LAL",
  "Memphis Grizzlies": "MEM",
  "Miami Heat": "MIA",
  "Milwaukee Bucks": "MIL",
  "Minnesota Timberwolves": "MIN",
  "New Orleans Pelicans": "NOP",
  "New York Knicks": "NYK",
  "Oklahoma City Thunder": "OKC",
  "Orlando Magic": "ORL",
  "Philadelphia 76ers": "PHI",
  "Phoenix Suns": "PHX",
  "Portland Trail Blazers": "POR",
  "Sacramento Kings": "SAC",
  "San Antonio Spurs": "SAS",
  "Toronto Raptors": "TOR",
  "Utah Jazz": "UTA",
  "Washington": "WAS",
  "Washington Wizards": "WAS"
} as const;

const GradientText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-2xl bg-gradient-to-r from-[#FFE872] via-[#FFE872] to-[#00FFFF] bg-clip-text text-transparent font-['OVERDOG'] font-semibold">
    {children}
  </span>
);

const OverdogPicks: React.FC<Props> = ({ date = new Date().toISOString().split('T')[0] }) => {
  const [activeTab, setActiveTab] = useState('singles');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [gameOdds, setGameOdds] = useState<GameOdds>({});
  const [isLoading, setIsLoading] = useState(true);
  const [oddsFormat, setOddsFormat] = useState<'american' | 'european'>('american');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [previousOdds, setPreviousOdds] = useState<OddsHistory>({});
  const refreshTimeoutRef = useRef<number | null>(null);

  const fetchData = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    try {
      // Fetch odds
      const oddsResponse = await fetch(
        `https://production-superbet-offer-ng-be.freetls.fastly.net/v2/nl-BE/events/by-date?tournamentIds=164&startDate=${date}+20:00:00`
      );
      if (!oddsResponse.ok) throw new Error('Failed to fetch odds');
      const oddsData = await oddsResponse.json();
      
      // Store current odds before updating
      if (isRefresh) {
        const currentOddsHistory: OddsHistory = {};
        Object.values(gameOdds).forEach(game => {
          if (game.detailedOdds) {
            currentOddsHistory[`${game.homeTeam}-${game.awayTeam}`] = {
              moneyline: game.detailedOdds.moneyline,
              totals: {
                allLines: game.detailedOdds.totals.allLines
              }
            };
          }
        });
        setPreviousOdds(currentOddsHistory);
      }

      const processed = await processOddsData(oddsData);
      setGameOdds(processed);

      if (!isRefresh) {
        // Only fetch predictions on initial load
        const predictionResponse = await fetch(`https://cdn.overdogbets.com/pussy/predictions/${date}_predictions.json`);
        if (!predictionResponse.ok) throw new Error('Failed to fetch predictions');
        const predictionData = await predictionResponse.json();
        setPredictions(predictionData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      if (!isRefresh) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  
    // Set up refresh interval
    refreshTimeoutRef.current = window.setInterval(() => {
      fetchData(true);
    }, 30000); // 30 seconds
  
    return () => {
      if (refreshTimeoutRef.current !== null) {
        window.clearInterval(refreshTimeoutRef.current);
      }
    };
  }, [date]);

  const getOddsDifference = (
    gameKey: string,
    type: 'moneyline' | 'totals',
    team: 'home' | 'away' | 'over' | 'under',
    points?: number
  ) => {
    const previous = previousOdds[gameKey];
    if (!previous) return null;

    if (type === 'moneyline') {
      const prevOdd = previous.moneyline[team as 'home' | 'away'];
      const currentOdd = gameOdds[gameKey]?.detailedOdds?.moneyline[team as 'home' | 'away'] || 0;
      return currentOdd - prevOdd;
    } else {
      const prevLine = previous.totals.allLines.find(line => line.points === points);
      const currentLine = gameOdds[gameKey]?.detailedOdds?.totals.allLines.find(
        line => line.points === points
      );
      
      if (!prevLine || !currentLine) return null;

      const prevPrice = team === 'over' ? prevLine.overPrice : prevLine.underPrice;
      const currentPrice = team === 'over' ? currentLine.overPrice : currentLine.underPrice;
      return currentPrice - prevPrice;
    }
  };

  const OddsChangeIndicator: React.FC<{ difference: number | null }> = ({ difference }) => {
    if (!difference) return null;
    const color = difference > 0 ? 'text-green-500' : difference < 0 ? 'text-red-500' : '';
    
    return (
      <span className={`ml-1 ${color}`}>
      +++++++
    </span>
    );
  };

  const fetchDetailedOdds = async (eventId: number): Promise<DetailedOdds | null> => {
    try {
      const response = await fetch(
        `https://production-superbet-offer-ng-be.freetls.fastly.net/v2/nl-BE/events/${eventId}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch detailed odds');
      
      const data = await response.json() as DetailedOddsResponse;
      const odds = data.data[0].odds;
  
      if (!odds) return null;
  
      // Find moneyline odds (marketId 759)
      const moneylineOdds = odds.filter(odd => odd.marketId === 759);
      const homeOdd = moneylineOdds.find(odd => odd.code === "1")?.price || 0;
      const awayOdd = moneylineOdds.find(odd => odd.code === "2")?.price || 0;
  
      // Find totals odds (marketId 753)
      const totalOdds = odds.filter(odd => odd.marketId === 753);
  
      // Store all available total lines
      const totalLines: Array<{
        points: number;
        overPrice: number;
        underPrice: number;
      }> = [];
  
      // First collect all points and their odds
      totalOdds.forEach(odd => {
        if (!odd.specialBetValue) return;
        const points = parseFloat(odd.specialBetValue);
        
        let existingLine = totalLines.find(line => line.points === points);
        if (!existingLine) {
          existingLine = { points, overPrice: 0, underPrice: 0 };
          totalLines.push(existingLine);
        }
  
        if (odd.code === "+") {
          existingLine.overPrice = odd.price;
        } else if (odd.code === "-") {
          existingLine.underPrice = odd.price;
        }
      });
  
      console.log('Available total lines:', totalLines);
  
      return {
        moneyline: {
          home: homeOdd,
          away: awayOdd
        },
        totals: {
          allLines: totalLines,
          over: { price: 0, points: 0 },
          under: { price: 0, points: 0 }
        }
      };
    } catch (error) {
      console.error(`Error fetching detailed odds for event ${eventId}:`, error);
      return null;
    }
  };

  const processOddsData = async (oddsData: OddsResponse): Promise<GameOdds> => {
    const processedOdds: GameOdds = {};
    
    for (const game of oddsData.data) {
      if (game.odds && Array.isArray(game.odds) && game.offerStateStatus["1"] === "active") {
        const homeOdd = game.odds.find((odd) => odd.code === "1")?.price || 0;
        const awayOdd = game.odds.find((odd) => odd.code === "2")?.price || 0;
        
        let [homeTeam, awayTeam] = game.matchName.split('·').map((team: string) => team.trim());
        
        // Handle special cases
        if (awayTeam === "Washington") awayTeam = "Washington Wizards";
        if (homeTeam === "LA Lakers") homeTeam = "Los Angeles Lakers";
        if (awayTeam === "LA Lakers") awayTeam = "Los Angeles Lakers";
        
        // Fetch detailed odds
        const detailedOdds = await fetchDetailedOdds(game.eventId);
        
        const keys = [
          `${homeTeam}·${awayTeam}`,
          `${homeTeam} vs ${awayTeam}`,
          homeTeam + ':' + awayTeam,
          homeTeam.toLowerCase() + ':' + awayTeam.toLowerCase()
        ];
        
        keys.forEach((key: string) => {
          processedOdds[key] = {
            home: homeOdd,
            away: awayOdd,
            homeTeam,
            awayTeam,
            matchId: game.eventId,
            detailedOdds  // Now the type matches
          };
        });
      }
    }
    
    return processedOdds;
  };

  const formatOdds = (odd: number): string => {
    if (odd === 0) return 'N/A';
    
    if (oddsFormat === 'european') {
      return odd.toFixed(2);
    } else {
      if (odd >= 2.00) {
        return `+${Math.round((odd - 1) * 100)}`;
      } else {
        return `-${Math.round(100 / (odd - 1))}`;
      }
    }
  };

  const getTeamLogoPath = (teamName: NBATeam): string => {
    const abbreviation = NBA_TEAM_ABBREVIATIONS[teamName];
    if (!abbreviation) {
      console.log('No abbreviation found for:', teamName);
      return '../../../assets/img/nba-logos/NBA.png';
    }
    return `../../../assets/img/nba-logos/${abbreviation}.png`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch odds
        const oddsResponse = await fetch(
          `https://production-superbet-offer-ng-be.freetls.fastly.net/v2/nl-BE/events/by-date?tournamentIds=164&startDate=${date}+20:00:00`
        );
        if (!oddsResponse.ok) throw new Error('Failed to fetch odds');
        const oddsData = await oddsResponse.json();
        const processed = await processOddsData(oddsData);
        setGameOdds(processed);

        // Fetch predictions
        const predictionResponse = await fetch(`https://cdn.overdogbets.com/pussy/predictions/${date}_predictions.json`);
        if (!predictionResponse.ok) throw new Error('Failed to fetch predictions');
        const predictionData = await predictionResponse.json();
        setPredictions(predictionData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [date]);

  useEffect(() => {
    const userLocale = navigator.language;
    setOddsFormat(userLocale === 'en-US' ? 'american' : 'european');
  }, []);

  const renderPredictionCard = (prediction: Prediction, index: number) => {
    const gameData = Object.values(gameOdds).find(
      game => game.homeTeam === prediction.home_team && game.awayTeam === prediction.away_team
    );

    const detailedOdds = gameData?.detailedOdds;
    const isOver = prediction.under_over.toLowerCase() === 'over';
    
    const matchingLine = detailedOdds?.totals.allLines.find(
      line => line.points === prediction.total
    );

    const price = matchingLine 
      ? (isOver ? matchingLine.overPrice : matchingLine.underPrice)
      : 1.91;

    const gameKey = `${prediction.home_team}-${prediction.away_team}`;
    const moneylineDiff = getOddsDifference(
      gameKey,
      'moneyline',
      prediction.winner === 1 ? 'home' : 'away'
    );
    const totalsDiff = getOddsDifference(
      gameKey,
      'totals',
      isOver ? 'over' : 'under',
      prediction.total
    );
  
  
    return (
      <div 
        key={index} 
        className="p-3 border-2 border-[#474E72] hover:bg-[#26283b] hover:scale-[1.02] hover:cursor-pointer transition-all duration-300 ease-in-out shadow-none"
      >
        <div className="text-center mb-3">
          <h4 className="text-base font-semibold text-white mb-1">
            {prediction.winner === 1 ? prediction.home_team : prediction.away_team}
          </h4>
          <small className="text-green-500">Predicted Winner</small>
        </div>
  
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <img 
              src={getTeamLogoPath(prediction.away_team)}
              alt={prediction.away_team}
              className="w-8 h-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '../../../assets/img/nba-logos/NBA.png';
              }}
            />
            <span className="text-sm font-medium text-white">{prediction.away_team}</span>
          </div>
  
          <span className="text-sm text-slate-400">vs</span>
  
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{prediction.home_team}</span>
            <img 
              src={getTeamLogoPath(prediction.home_team)}
              alt={prediction.home_team}
              className="w-8 h-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '../../../assets/img/nba-logos/NBA.png';
              }}
            />
          </div>
        </div>
  
        <div className="space-y-2">
          {/* Points/Total */}
          <div className="flex justify-between items-center pb-2 border-b border-[#474E72]">
            <span className="text-sm text-slate-400">
              {prediction.under_over} {prediction.total}
            </span>
            <span className="text-sm text-white flex items-center">
              {formatOdds(price)}
              <OddsChangeIndicator difference={totalsDiff} />
            </span>
          </div>
          
          {/* MoneyLine */}
          <div className="flex justify-between items-center pb-2 border-b border-[#474E72]">
            <span className="text-sm text-slate-400">MoneyLine</span>
            <span className="text-sm text-white flex items-center">
              {formatOdds(
                prediction.winner === 1 
                  ? detailedOdds?.moneyline.home || gameData?.home || 0
                  : detailedOdds?.moneyline.away || gameData?.away || 0
              )}
              <OddsChangeIndicator difference={moneylineDiff} />
            </span>
          </div>
  
          {/* Winner Confidence */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Confidence</span>
            <span className="text-sm text-white">{prediction.winner_confidence.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full order-2 lg:order-2 mb-4 lg:mb-0" style={{ overflowX: 'hidden', marginBottom: '25px !important' }}>
      <div className="bg-[#1d1e2f] rounded-lg border-2 border-[#474E72] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#474E72]">
          <h5 className="m-0">
            <div className="flex items-center gap-2">
              <GradientText>OVERDOG PICKS</GradientText>
              {isLoading && (
                <div className="animate-spin h-4 w-4 border-2 border-slate-600 dark:border-slate-300 border-t-transparent rounded-full" />
              )}
            </div>
          </h5>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#2b2c40] text-white rounded-md 
                         border border-[#474E72] hover:bg-[#31324b] transition-colors duration-200"
              >
                <span className="text-sm">
                  {oddsFormat === 'american' ? 'American' : 'European'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#2b2c40] border border-[#474E72] 
                              rounded-md shadow-lg overflow-hidden z-10">
                  <div className="py-1">
                    {['american', 'european'].map((format) => (
                      <button
                        key={format}
                        onClick={() => {
                          setOddsFormat(format as 'american' | 'european');
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left ${
                          oddsFormat === format
                            ? 'bg-[#696cff] text-white'
                            : 'text-white hover:bg-[#31324b]'
                        } transition-colors duration-200`}
                      >
                        {format.charAt(0).toUpperCase() + format.slice(1)} Odds
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button className="px-6 py-2 bg-[#696cff] text-white rounded-md hover:bg-[#6062eb] transition-colors duration-200 ease-in-out">
              Auto Bet ✨
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="flex border-b border-[#474E72]">
            {['singles', 'parlays', 'props'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 text-center capitalize transition-colors duration-200 text-sm
                  ${activeTab === tab 
                    ? 'border-b-2 border-[#696cff] text-[#696cff] bg-[#1d1e2f]' 
                    : 'text-slate-400 hover:text-white bg-[#1d1e2f]'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 bg-[#1d1e2f]">
            {activeTab === 'singles' && (
              <div className="px-4 pb-8">
                <div className="space-y-4">
                  {predictions.length > 0 ? (
                    predictions.map((prediction, index) => renderPredictionCard(prediction, index))
                  ) : (
                    <div className="text-center pt-4 text-slate-400">
                      {isLoading ? 'Loading predictions...' : 'No Games Found'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'parlays' && (
              <div className="mb-3 text-center pt-4 text-slate-400">
                No Parlays Found
              </div>
            )}

            {activeTab === 'props' && (
              <div className="mb-3 text-center pt-4 text-slate-400">
                No Props Found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverdogPicks;
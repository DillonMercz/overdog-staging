import { NHLPredictionsResponse, NHLPropsResponse, NHLScoresResponse } from '../types/nhlPredictions';

const formatDate = () => {
  const currentDate = new Date();
  const options = { timeZone: 'America/New_York' };
  const [month, day, year] = currentDate
    .toLocaleDateString('en-US', options)
    .split('/')
    .map((part) => part.padStart(2, '0'));
  return `${year}-${month}-${day}`;
};

export const fetchNHLPredictions = async (authToken: string): Promise<NHLPredictionsResponse> => {
  const formattedDate = formatDate();
  const response = await fetch(
    `https://cdn.overdogbets.com/predictions/nhl/${formattedDate}_games.json`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch NHL predictions');
  }

  return response.json();
};

export const fetchNHLProps = async (authToken: string): Promise<NHLPropsResponse> => {
  const formattedDate = formatDate();
  console.log('Fetching NHL props for date:', formattedDate);
  
  // Updated URL to match exactly the JavaScript version
  const url = `https://cdn.overdogbets.com/predictions/nhl/player_props/predictions_${formattedDate}.json`;
  console.log('Fetching from URL:', url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch NHL props:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch NHL props: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('NHL props data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching NHL props:', error);
    throw error;
  }
};

export const fetchNHLScores = async (): Promise<NHLScoresResponse> => {
  const response = await fetch(
    'https://script.google.com/macros/s/AKfycbzN_GLEk7OO6Jb37utk5yZzVPrmu3O6hfS6grg2BAo6ntpQlgBuPdS30ZQ9-df2G2_qAA/exec',
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch NHL scores');
  }

  return response.json();
};

export const getTeamAbbreviation = (teamName: string): string => {
  const teams: { [key: string]: string } = {
    'Anaheim Ducks': 'ANA',
    'Arizona Coyotes': 'ARI',
    'Boston Bruins': 'BOS',
    'Buffalo Sabres': 'BUF',
    'Calgary Flames': 'CGY',
    'Carolina Hurricanes': 'CAR',
    'Chicago Blackhawks': 'CHI',
    'Colorado Avalanche': 'COL',
    'Columbus Blue Jackets': 'CBJ',
    'Dallas Stars': 'DAL',
    'Detroit Red Wings': 'DET',
    'Edmonton Oilers': 'EDM',
    'Florida Panthers': 'FLA',
    'Los Angeles Kings': 'LAK',
    'Minnesota Wild': 'MIN',
    'Montréal Canadiens': 'MTL',
    'Nashville Predators': 'NSH',
    'New Jersey Devils': 'NJD',
    'New York Islanders': 'NYI',
    'New York Rangers': 'NYR',
    'Ottawa Senators': 'OTT',
    'Philadelphia Flyers': 'PHI',
    'Pittsburgh Penguins': 'PIT',
    'San Jose Sharks': 'SJS',
    'Seattle Kraken': 'SEA',
    'St. Louis Blues': 'STL',
    'Tampa Bay Lightning': 'TBL',
    'Toronto Maple Leafs': 'TOR',
    'Vancouver Canucks': 'VAN',
    'Vegas Golden Knights': 'VGK',
    'Washington Capitals': 'WSH',
    'Winnipeg Jets': 'WPG',
    'Utah Hockey Club': 'UTA'
  };
  return teams[teamName] || '';
};

export const getTeamName = (teamName: string): string => {
  const areas = [
    'Anaheim', 'Arizona', 'Boston', 'Buffalo', 'Calgary', 'Carolina', 'Chicago',
    'Colorado', 'Columbus', 'Dallas', 'Detroit', 'Edmonton', 'Florida',
    'Los Angeles', 'Minnesota', 'Montréal', 'Nashville', 'New Jersey',
    'New York', 'Ottawa', 'Philadelphia', 'Pittsburgh', 'San Jose', 'Seattle',
    'St. Louis', 'Tampa Bay', 'Toronto', 'Vancouver', 'Vegas', 'Washington',
    'Winnipeg', 'Utah'
  ];

  let strippedName = teamName;
  for (let area of areas) {
    if (teamName.includes(area)) {
      strippedName = teamName.replace(area + ' ', '');
      break;
    }
  }
  return strippedName.trim();
};

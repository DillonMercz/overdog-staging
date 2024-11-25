import { NBAPredictionsResponse, NBAPropsResponse } from '../types/nbaPredictions';

const formatDate = () => {
  const currentDate = new Date();
  const options = { timeZone: 'America/New_York' };
  const [month, day, year] = currentDate
    .toLocaleDateString('en-US', options)
    .split('/')
    .map((part) => part.padStart(2, '0'));
  return `${year}-${month}-${day}`;
};

export const fetchNBAPredictions = async (authToken: string): Promise<NBAPredictionsResponse> => {
  const formattedDate = formatDate();
  const response = await fetch(
    `https://cdn.overdogbets.com/predictions/${formattedDate}_predictions.json`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch NBA predictions');
  }

  return response.json();
};

export const fetchNBAProps = async (authToken: string): Promise<NBAPropsResponse> => {
  const formattedDate = formatDate();
  const response = await fetch(
    `https://cdn.overdogbets.com/predictions/nba_props/${formattedDate}.json`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch NBA props');
  }

  return response.json();
};

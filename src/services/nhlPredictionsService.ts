import { NHLPredictionsResponse, NHLPropsResponse, NHLScoresResponse } from '../types/nhlPredictions';
import { supabase } from '../lib/supabase/client';
import { NHLGame } from '../types/nhl';
import { getTeamAbbreviation as getTeamAbbreviationUtil } from '../utils/nhlUtils';

const formatDate = () => {
  const currentDate = new Date();
  // Get the date in UTC to ensure consistency
  const year = currentDate.getUTCFullYear();
  const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const fetchNHLPredictions = async (authToken: string): Promise<NHLPredictionsResponse> => {
  const formattedDate = formatDate();
  console.log('Fetching predictions for date:', formattedDate);
  
  // First, get predictions with more flexible date range
  const { data: predictions, error: predictionsError } = await supabase
    .from('predictions')
    .select('*')
    .eq('sport_id', '0f9a163b-f6e3-4743-952c-76909405d482') // NHL sport ID
    .eq('league_id', '1e4c7e3c-5d07-4705-a608-7e586bbc92b4') // NHL league ID
    .or('result.is.null,result.eq.""')

  if (predictionsError) {
    console.error('Error fetching NHL predictions:', predictionsError);
    throw new Error('Failed to fetch NHL predictions');
  }

  console.log('Found predictions:', predictions?.length || 0);

  if (!predictions || predictions.length === 0) {
    return {};
  }

  // Get all event IDs from predictions
  const eventIds = predictions.map(p => p.event_id);
  console.log('Event IDs:', eventIds);

  // Then fetch corresponding events
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .in('id', eventIds);

  if (eventsError) {
    console.error('Error fetching events:', eventsError);
    throw new Error('Failed to fetch events');
  }

  console.log('Found events:', events?.length || 0);

  // Create a map of events for easy lookup
  const eventsMap = new Map(events?.map(event => [event.id, event]));

  // Transform the predictions into the expected response format
  const response: NHLPredictionsResponse = {};
  
  predictions.forEach(prediction => {
    const event = eventsMap.get(prediction.event_id);
    if (!event) {
      console.log('No event found for prediction:', prediction.event_id);
      return;
    }

    console.log('Processing prediction for event:', event.id, {
      home_team: event.home_team_name,
      away_team: event.away_team_name,
      prediction_value: prediction.prediction_value,
      home_prob: prediction.home_win_probability,
      away_prob: prediction.away_win_probability
    });

    const homeTeam = event.home_team_name || 'TBD';
    const awayTeam = event.away_team_name || 'TBD';
    
    // Check if prediction_value is null or undefined
    const predictedWinner = prediction.prediction_value === null || prediction.prediction_value === undefined || prediction.prediction_value === '' ? 
      "AI Unsure" : prediction.prediction_value;
    
    const game: NHLGame = {
      GameID: typeof prediction.event_id === 'string' ? 
        parseInt(prediction.event_id.replace(/\D/g, '')) || 0 : 
        typeof prediction.event_id === 'number' ? 
          prediction.event_id : 0,
      "Game State": "SCHEDULED",
      "Home Team": homeTeam,
      "Away Team": awayTeam,
      "Home Goals": 0,
      "Away Goals": 0,
      "Pre-Game Home Win Probability": prediction.home_win_probability?.toString() || "0",
      "Pre-Game Away Win Probability": prediction.away_win_probability?.toString() || "0",
      "Home Record": "",
      "Away Record": "",
      "Predicted Winner": predictedWinner
    };

    response[prediction.event_id.toString()] = {
      'Away Team': game["Away Team"] || 'TBD',
      'Home Team': game["Home Team"] || 'TBD',
      'Pre-Game Away Win Probability': game["Pre-Game Away Win Probability"] || "0",
      'Pre-Game Home Win Probability': game["Pre-Game Home Win Probability"] || "0",
      'Predicted Winner': predictedWinner
    };
  });

  console.log('Final response:', Object.keys(response).length, 'predictions');
  return response;
};

export const fetchNHLProps = async (authToken: string): Promise<NHLPropsResponse> => {
  const formattedDate = formatDate();
  console.log('Fetching NHL props for date:', formattedDate);
  
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

// Re-export the utility function for backward compatibility
export const getTeamAbbreviation = getTeamAbbreviationUtil;

export const getTeamName = (teamName: string): string => {
  if (!teamName) return '';
  
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

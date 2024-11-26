// services/sportsService.ts
import { supabase } from '../lib/supabase/client';

interface Sport {
  id: string;
  name: string;
  is_active: boolean;
}

interface League {
  id: string;
  sport_id: string;
  name: string;
  country: string;
  is_active: boolean;
}

interface BetType {
  id: string;
  name: string;
  description: string;
}

export const getSportByName = async (name: string): Promise<Sport | null> => {
  try {
    const { data, error } = await supabase
      .from('sports')
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching sport:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getSportByName:', error);
    return null;
  }
};

export const getLeagueByName = async (name: string): Promise<League | null> => {
  try {
    const { data, error } = await supabase
      .from('leagues')
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching league:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getLeagueByName:', error);
    return null;
  }
};

export const getBetTypeByName = async (name: string): Promise<BetType | null> => {
  try {
    const { data, error } = await supabase
      .from('bet_types')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      console.error('Error fetching bet type:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getBetTypeByName:', error);
    return null;
  }
};

// Cache for IDs to avoid repeated database calls
let cachedIds: {
  nhlSportId?: string;
  nhlLeagueId?: string;
  singleBetTypeId?: string;
} = {};

export const getRequiredIds = async () => {
  // Return cached IDs if available
  if (cachedIds.nhlSportId && cachedIds.nhlLeagueId && cachedIds.singleBetTypeId) {
    return cachedIds;
  }

  try {
    // Fetch all required IDs in parallel
    const [sport, league, betType] = await Promise.all([
      getSportByName('IceHockey'), // Changed from getSportBySlug to getSportByName
      getLeagueByName('NHL'),
      getBetTypeByName('Single')
    ]);

    console.log('Fetched sport:', sport);
    console.log('Fetched league:', league);
    console.log('Fetched bet type:', betType);

    cachedIds = {
      nhlSportId: sport?.id,
      nhlLeagueId: league?.id,
      singleBetTypeId: betType?.id
    };

    return cachedIds;
  } catch (error) {
    console.error('Error fetching required IDs:', error);
    throw new Error('Failed to fetch required IDs');
  }
};

// Utility function to check if all required data exists
export const checkRequiredData = async () => {
  try {
    const [sports, leagues, betTypes] = await Promise.all([
      supabase.from('sports').select('*'),
      supabase.from('leagues').select('*'),
      supabase.from('bet_types').select('*')
    ]);

    console.log('All sports:', sports.data);
    console.log('All leagues:', leagues.data);
    console.log('All bet types:', betTypes.data);
  } catch (error) {
    console.error('Error checking required data:', error);
  }
};
// services/bookmakerService.ts
import { supabase } from '../lib/supabase/client';

export interface Bookmaker {
  id: string;
  name: string;
  country?: string | null; // Make country optional and allow null
  is_active: boolean;
  location: 'european' | 'american';
  created_at?: string;
  updated_at?: string;
}

export type BookmakerLocation = 'Europe' | 'American';

export interface BookmakerWithOdds extends Bookmaker {
  odds: number;
}

const mapOddsFormat = (format: 'european' | 'american'): BookmakerLocation => {
  return format === 'european' ? 'Europe' : 'American';
};

export const getBookmakersByLocation = async (format: 'european' | 'american'): Promise<BookmakerWithOdds[]> => {
  try {
    const location = mapOddsFormat(format);
    console.log('Fetching bookmakers for location:', location);

    const { data: bookmakers, error } = await supabase
      .from('bookmakers')
      .select('id, name, country, is_active, location')
      .eq('is_active', true)
      .eq('location', location) // Using the mapped location value
      .order('name');

    if (error) {
      console.error('Supabase error fetching bookmakers:', error);
      throw error;
    }

    console.log('Raw bookmakers data:', bookmakers);

    if (!bookmakers || bookmakers.length === 0) {
      console.log('No bookmakers found for location:', location);
      return [];
    }

    // Add temporary odds to bookmakers
    const bookiesWithOdds = bookmakers.map(bookmaker => ({
      ...bookmaker,
      country: bookmaker.country || undefined,
      odds: format === 'european' ? 1.91 : -110
    }));

    console.log('Processed bookmakers with odds:', bookiesWithOdds);
    return bookiesWithOdds;

  } catch (error) {
    console.error('Error in getBookmakersByLocation:', error);
    return [];
  }
};

// Utility function to check if bookmakers exist
export const checkBookmakers = async () => {
  try {
    const { data, error } = await supabase
      .from('bookmakers')
      .select('*');

    if (error) {
      console.error('Error checking bookmakers:', error);
      return;
    }

    console.log('All bookmakers in database:', data);
  } catch (error) {
    console.error('Error in checkBookmakers:', error);
  }
};

/**
 * Fetches a single bookmaker by ID
 */
export const getBookmakerById = async (id: string): Promise<Bookmaker | null> => {
  try {
    const { data, error } = await supabase
      .from('bookmakers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching bookmaker:', error);
    return null;
  }
};

/**
 * Fetches all active bookmakers
 */
export const getAllActiveBookmakers = async (): Promise<Bookmaker[]> => {
  try {
    const { data, error } = await supabase
      .from('bookmakers')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching bookmakers:', error);
    return [];
  }
};

interface UserBookmakerSelection {
  selected: boolean;
  selected_at: string;
}

interface UserBookmarkersData {
  [key: string]: UserBookmakerSelection;
}

/**
 * Fetches user's selected bookmakers
 */
export const getUserBookmakers = async (userId: string): Promise<Bookmaker[]> => {
  try {
    // First get the user's selected bookmaker IDs
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('selected_sportsbooks')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    if (!userData?.selected_sportsbooks) return [];

    // Parse the bookmakers data
    const bookmarkersData = userData.selected_sportsbooks as UserBookmarkersData;
    
    // Get the IDs of selected bookmakers
    const selectedBookmakerIds = Object.entries(bookmarkersData)
      .filter(([_, value]) => value.selected)
      .map(([id]) => id);

    if (selectedBookmakerIds.length === 0) return [];

    // Fetch the actual bookmaker details
    const { data: bookmakers, error: bookmakerError } = await supabase
      .from('bookmakers')
      .select('*')
      .in('id', selectedBookmakerIds);

    if (bookmakerError) throw bookmakerError;

    return bookmakers || [];
  } catch (error) {
    console.error('Error fetching user bookmakers:', error);
    return [];
  }
};

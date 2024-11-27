// services/betTrackingService.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/client';
import { CreateBetData, Bet, BetLeg, OddsType, BetLegType } from '../types/betting';

interface RawBetLeg {
  id: string;
  bet_id: string;
  sport_id: string;
  league_id: string;
  event_name: string;
  selection: string;
  result?: string;
  event_start: string;
  event_end?: string;
  created_at: string;
  updated_at: string;
  odds_type_id: string;
  odds: string;
  leg_type_id: string;
  event_id?: number; // Changed to number since it's a bigint in the database
  bet_status_id: string;
  sport: { id: string; name: string };
  league: { id: string; name: string; country: string | null };
  leg_type: { id: string; name: string };
  bet_status: { id: string; name: string };
}

interface RawBet {
  id: string;
  user_id: string;
  bookmaker_id: string;
  bet_type_id: string;
  bet_status_id: string;
  stake: number;
  potential_payout: number;
  placed_at: string;
  settled_at?: string;
  is_cashout: boolean;
  cashout_value?: number;
  created_at: string;
  updated_at: string;
  odds_type_id: string;
  odds: string;
  bookmaker: { name: string };
  bet_type: { name: string };
  bet_status: { name: string };
  bet_legs: RawBetLeg[];
}

// Calculate potential payout based on American odds
const calculatePotentialPayoutFromAmerican = (stake: number, odds: string): number => {
  const oddsNum = parseInt(odds);
  if (oddsNum > 0) {
    return stake * (oddsNum / 100) + stake;
  } else {
    return stake * (100 / Math.abs(oddsNum)) + stake;
  }
};

// Get single bet type ID
const getSingleBetTypeId = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('bet_types')
      .select('id')
      .eq('name', 'Single')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Single bet type not found');
    
    return data.id;
  } catch (error) {
    console.error('Error fetching single bet type:', error);
    throw error;
  }
};

// Create a single bet with one leg
const createSingleBet = async (betData: CreateBetData): Promise<{ bet: Bet, legs: BetLeg[] }> => {
  try {
    console.log('Incoming betData:', JSON.stringify(betData, null, 2));

    if (!betData.bet_status_id) {
      throw new Error('bet_status_id is required in bet data');
    }

    if (betData.legs.length !== 1) {
      throw new Error('Single bet must have exactly one leg');
    }

    if (!betData.legs[0].leg_type_id) {
      throw new Error('leg_type_id is required');
    }

    // Get the current user's ID
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !currentUser) {
      throw new Error('No authenticated user found');
    }

    // Calculate potential payout correctly
    const potentialPayout = calculatePotentialPayoutFromAmerican(betData.stake, betData.odds);

    // Create the leg data first - include all required fields including bet_status_id
    const legData = {
      sport_id: betData.legs[0].sport_id,
      league_id: betData.legs[0].league_id,
      event_name: betData.legs[0].event_name,
      selection: betData.legs[0].selection,
      event_start: betData.legs[0].event_start,
      odds_type_id: betData.legs[0].odds_type_id,
      odds: betData.legs[0].odds,
      leg_type_id: betData.legs[0].leg_type_id,
      bet_status_id: betData.legs[0].bet_status_id,
      event_id: betData.legs[0].event_id ? parseInt(betData.legs[0].event_id) : null // Convert string to number for bigint
    };

    // Create the bet data - include all fields needed for the bet INSERT statement
    const betDataForRPC = {
      bookmaker_id: betData.bookmaker_id,
      bet_type_id: betData.bet_type_id,
      bet_status_id: betData.bet_status_id,
      user_id: currentUser.id,
      stake: betData.stake,
      odds_type_id: betData.odds_type_id,
      odds: betData.odds,
      placed_at: new Date().toISOString(),
      potential_payout: potentialPayout
    };

    // Prepare RPC data to match exactly what the function expects
    const rpcData = {
      bet_data: betDataForRPC,
      legs_data: [legData]
    };

    // Log the complete RPC data
    console.log('Complete RPC data:', JSON.stringify(rpcData, null, 2));

    const { data, error } = await supabase.rpc('create_bet_with_legs', rpcData);

    if (error) {
      console.error('RPC Error:', error);
      throw error;
    }

    if (!data) {
      console.error('No data returned from RPC');
      throw new Error('Failed to create bet');
    }

    return data;
  } catch (error) {
    console.error('Error in createSingleBet:', error);
    throw error;
  }
};

// Get user's bets
const getUserBets = async (supabase: SupabaseClient, userId: string): Promise<Bet[]> => {
  try {
    console.log('Fetching bets for user:', userId);

    const { data, error } = await supabase
      .from('bets')
      .select(`
        *,
        bookmaker:bookmakers!inner(*),
        bet_type:bet_types!inner(*),
        bet_status:bet_status!inner(*),
        bet_legs(
          *,
          sport:sports!inner(*),
          league:leagues!inner(*),
          leg_type:bet_leg_types!inner(*),
          bet_status:bet_status!bet_legs_bet_status_id_fkey(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bets:', error);
      throw error;
    }

    if (!data) {
      console.log('No bets found for user:', userId);
      return [];
    }

    const transformedBets = (data as RawBet[]).map(bet => {
      const transformedBet: Bet = {
        id: bet.id,
        user_id: bet.user_id,
        bookmaker_id: bet.bookmaker_id,
        bet_type_id: bet.bet_type_id,
        bet_status_id: bet.bet_status_id,
        stake: bet.stake,
        potential_payout: bet.potential_payout,
        placed_at: bet.placed_at,
        settled_at: bet.settled_at,
        is_cashout: bet.is_cashout,
        cashout_value: bet.cashout_value,
        created_at: bet.created_at,
        updated_at: bet.updated_at,
        odds_type_id: bet.odds_type_id,
        odds: bet.odds,
        bookmaker: { 
          name: bet.bookmaker?.name || 'N/A'
        },
        bet_type: { 
          name: bet.bet_type?.name || 'N/A'
        },
        bet_status: { 
          name: bet.bet_status?.name || 'N/A'
        },
        legs: bet.bet_legs.map((leg: RawBetLeg): BetLeg => {
          return {
            id: leg.id,
            bet_id: leg.bet_id,
            sport_id: leg.sport_id,
            league_id: leg.league_id,
            event_name: leg.event_name,
            selection: leg.selection,
            result: leg.result,
            event_start: leg.event_start,
            event_end: leg.event_end,
            created_at: leg.created_at,
            updated_at: leg.updated_at,
            odds_type_id: leg.odds_type_id,
            odds: leg.odds,
            leg_type_id: leg.leg_type_id,
            event_id: leg.event_id?.toString(), // Convert number back to string for frontend
            bet_status_id: leg.bet_status_id,
            sport: { 
              name: leg.sport?.name || 'N/A'
            },
            league: { 
              name: leg.league?.name || 'N/A',
              country: leg.league?.country || null
            },
            leg_type: { 
              name: leg.leg_type?.name || 'N/A'
            },
            bet_status: {
              name: leg.bet_status?.name || 'N/A'
            }
          };
        })
      };

      return transformedBet;
    });

    return transformedBets;
  } catch (error) {
    console.error('Error in getUserBets:', error);
    throw error;
  }
};

// Get odds types from database
const getOddsTypes = async (): Promise<OddsType[]> => {
  try {
    const { data, error } = await supabase
      .from('odds_types')
      .select('*');
    
    if (error) throw error;
    if (!data) return [];
    
    return data;
  } catch (error) {
    console.error('Error fetching odds types:', error);
    throw error;
  }
};

// Get bet leg types from database
const getBetLegTypes = async (): Promise<BetLegType[]> => {
  try {
    const { data, error } = await supabase
      .from('bet_leg_types')
      .select('*');
    
    if (error) throw error;
    if (!data) return [];
    
    return data;
  } catch (error) {
    console.error('Error fetching bet leg types:', error);
    throw error;
  }
};

export {
  getOddsTypes,
  getBetLegTypes,
  getSingleBetTypeId,
  calculatePotentialPayoutFromAmerican,
  createSingleBet as trackBet, // Keep old name for backward compatibility
  getUserBets
};

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
  event_id?: string;
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

    // Log raw data to debug
    console.log('Raw bet data:', JSON.stringify(data[0], null, 2));

    const transformedBets = (data as RawBet[]).map(bet => {
      // Log bet status before transformation
      console.log('Bet status before transform:', bet.bet_status);
      
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
          // Log leg status before transformation
          console.log('Leg status before transform:', leg.bet_status);
          
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
            event_id: leg.event_id,
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

    // Log transformed data to debug
    console.log('Transformed bet data:', JSON.stringify(transformedBets[0], null, 2));

    return transformedBets;
  } catch (error) {
    console.error('Error in getUserBets:', error);
    throw error;
  }
};

// Track a new bet
const trackBet = async (betData: CreateBetData): Promise<{ bet: Bet, legs: BetLeg[] }> => {
  try {
    console.log('Starting bet tracking with data:', betData);

    // Get the 'Pending' status ID
    const { data: statusData, error: statusError } = await supabase
      .from('bet_status')
      .select('*')
      .eq('name', 'Pending')
      .single();

    if (statusError) {
      console.error('Error getting status ID:', statusError);
      throw statusError;
    }
    if (!statusData) {
      console.error('No Pending status found');
      throw new Error('Could not find Pending status');
    }

    // Get the current user's ID
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !currentUser) {
      throw new Error('No authenticated user found');
    }

    // Prepare RPC data
    const rpcData = {
      bet_data: {
        bookmaker_id: betData.bookmaker_id,
        bet_type_id: betData.bet_type_id,
        bet_status_id: statusData.id,
        user_id: currentUser.id,
        stake: betData.stake,
        odds_type_id: betData.odds_type_id,
        odds: betData.odds,
        placed_at: new Date().toISOString(),
        potential_payout: betData.stake * parseFloat(betData.odds)
      },
      legs_data: betData.legs.map(leg => ({
        sport_id: leg.sport_id,
        league_id: leg.league_id,
        event_name: leg.event_name,
        selection: leg.selection,
        event_start: leg.event_start,
        odds_type_id: leg.odds_type_id,
        odds: leg.odds,
        leg_type_id: leg.leg_type_id,
        event_id: leg.event_id,
        bet_status_id: statusData.id // Set initial leg status to Pending
      }))
    };

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
    console.error('Error in trackBet:', error);
    throw error;
  }
};

// Update bet status
const updateBetStatus = async (betId: string, statusName: string) => {
  try {
    const { data: statusData } = await supabase
      .from('bet_status')
      .select('id')
      .eq('name', statusName)
      .single();

    if (!statusData) throw new Error(`Status not found: ${statusName}`);

    const { data, error } = await supabase
      .from('bets')
      .update({ bet_status_id: statusData.id })
      .eq('id', betId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating bet status:', error);
    throw error;
  }
};

// Update bet leg status
const updateBetLegStatus = async (legId: string, statusName: string) => {
  try {
    const { data: statusData } = await supabase
      .from('bet_status')
      .select('id')
      .eq('name', statusName)
      .single();

    if (!statusData) throw new Error(`Status not found: ${statusName}`);

    const { data, error } = await supabase
      .from('bet_legs')
      .update({ bet_status_id: statusData.id })
      .eq('id', legId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating leg status:', error);
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

// Calculate potential payout based on odds type
const calculatePotentialPayout = (stake: number, odds: string, oddsType: string): number => {
  try {
    switch (oddsType) {
      case 'decimal':
        return stake * parseFloat(odds);
      case 'fractional': {
        const [num, den] = odds.split('/').map(Number);
        return stake * (num / den + 1);
      }
      case 'american': {
        const oddsNum = parseInt(odds);
        if (oddsNum > 0) {
          return stake * (oddsNum / 100 + 1);
        } else {
          return stake * (100 / Math.abs(oddsNum) + 1);
        }
      }
      default:
        throw new Error(`Unsupported odds type: ${oddsType}`);
    }
  } catch (error) {
    console.error('Error calculating potential payout:', error);
    throw error;
  }
};

export {
  getOddsTypes,
  getBetLegTypes,
  calculatePotentialPayout,
  trackBet,
  getUserBets,
  updateBetStatus,
  updateBetLegStatus
};

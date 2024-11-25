// components/dashboard/BetTracker.tsx
import { useEffect, useState } from 'react';
import BetTrackerAnalytics from './BetTrackerAnalytics';
import BetsOverview from './BetsOverview';
import { getUserBets } from '../../services/betTrackingService';
import type { ExtendedBet } from './types';
import { SupabaseClient } from '@supabase/supabase-js';

interface BetTrackerProps {
  userId: string;
  supabase: SupabaseClient;
}

const BetTracker = ({ userId, supabase }: BetTrackerProps) => {
  const [bets, setBets] = useState<ExtendedBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBets = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const userBets = await getUserBets(supabase, userId);
        setBets(userBets || []);
      } catch (err) {
        console.error('Error fetching bets:', err);
        setError('Failed to load your bets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, [userId, supabase]);

  return (
    <div className="space-y-4 font-[Montserrat] max-w-[1440px] mx-auto">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-[#00F6FF] text-lg">Loading your bets...</div>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-[rgba(255,61,113,0.15)] border border-[rgba(255,255,255,0.05)] p-4 text-[#FF3D71]">
          {error}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm mb-6">
            <span className="text-[#8F9BB3]">Dashboard /</span>
            <span className="text-white font-medium">Bet Tracker</span>
          </div>
          <BetTrackerAnalytics bets={bets} />
          <BetsOverview bets={bets} />
        </>
      )}
    </div>
  );
};

export default BetTracker;
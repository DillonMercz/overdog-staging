// pages/dashboard/BetTrackerPage.tsx
import { useAuthContext } from '../../contexts/AuthContext';
import BetTracker from '../../components/dashboard/BetTracker';
import { supabase } from '../../lib/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';

interface BetTrackerProps {
  userId: string;
  supabase: SupabaseClient;
}

const BetTrackerPage = () => {
  const { user } = useAuthContext();

  return (
    <div className="px-6 pb-6">
      <div className="bg-[#2b2c40] rounded-lg border border-[#474E72] p-6 mb-6">
        <h1 className="text-2xl font-bold text-white">Bet Tracker</h1>
        <p className="text-gray-400 mt-1">Track and manage your bets</p>
      </div>

      <div className="bg-[#2b2c40] rounded-lg border border-[#474E72] p-6">
        {user?.id && <BetTracker supabase={supabase} userId={user.id} />}
      </div>
    </div>
  );
};

export default BetTrackerPage;
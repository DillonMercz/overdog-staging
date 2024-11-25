// contexts/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/client';
import { useAuthContext } from './AuthContext';

interface UserProfile {
  id: string;
  email: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  country: string | null;
  birthday: string | null;
  phone: string | null;
  plan: string;
  referral: string | null;
  affiliate: any | null;
  bets: string | null;
  customer_id: string | null;
  avatar: string;
  notifications: any | null;
  config: any | null;
  discord_user: string | null;
  selected_sportsbooks: {
    [key: string]: {
      selected: boolean;
      selected_at: string;
    };
  };
  connected_sportsbooks: {
    [key: string]: {
      connected: boolean;
      connected_at: string;
    };
  };
}

interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserProfile = async (userId: string) => {
    console.log('Fetching profile for user:', userId);
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        if (fetchError.code === 'PGRST116') { // No rows returned
          console.log('No profile found, creating one...');
          // Create a default profile if none exists
          const { data: newProfile, error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: userId,
                email: user?.email,
                username: user?.email?.split('@')[0],
                plan: 'commoner',
                avatar: '6808da5325.png'
              }
            ])
            .select()
            .single();

          if (insertError) throw insertError;
          console.log('Created new profile:', newProfile);
          setProfile(newProfile);
        } else {
          throw fetchError;
        }
      } else {
        console.log('Found existing profile:', data);
        setProfile(data);
      }

      setError(null);
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('UserProvider mounted, current user:', user?.id);
    if (user?.id) {
      fetchUserProfile(user.id);
    } else {
      setLoading(false);
      setProfile(null);
    }
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) throw new Error('No user found');
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  return (
    <UserContext.Provider value={{ profile, loading, error, updateProfile, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
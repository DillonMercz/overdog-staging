// types/user.ts
export interface UserProfile {
  id: string;
  email: string | null;
  username: string | null;
  phone: string | null;
  plan: 'Commoner' | string;
  referral: string | null;
  affiliate: any | null;
  bets: string | null;
  customer_id: string | null;
  avatar: string;
  notifications: any | null;
  config: any | null;
  connected_sportsbooks: Record<string, any>;
}

export interface SignUpData {
  email: string;
  password: string;
  username: string;
}
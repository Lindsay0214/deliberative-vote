
export interface Profile {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  is_active: boolean;
  options?: PollOption[];
  votes?: Vote[];
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  created_at: string;
  votes?: Vote[];
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id?: string;
  reason?: string;
  weight: number;
  created_at: string;
}

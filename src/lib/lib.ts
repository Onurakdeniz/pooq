import axios from 'axios';

// Types
type VerifiedAddresses = {
  eth_addresses: string[];
  sol_addresses: string[];
};

type Profile = {
  bio: {
    text: string;
    mentioned_profiles?: User[];
  };
};

type ViewerContext = {
  following: boolean;
  followed_by: boolean;
};

type User = {
  object: 'user';
  fid: number;
  custody_address: string;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: Profile;
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: VerifiedAddresses;
  active_status: string;
  power_badge: boolean;
  viewer_context?: ViewerContext;
};

type Embed = {
  url: string;
};

type Reaction = {
  fid: number;
  fname: string;
};

type Reactions = {
  likes_count: number;
  recasts_count: number;
  likes: Reaction[];
  recasts: Reaction[];
};

type Cast = {
  object: 'cast';
  hash: string;
  thread_hash: string;
  parent_hash: string | null;
  parent_url: string | null;
  root_parent_url: string | null;
  parent_author: {
    fid: number | null;
  };
  author: User;
  text: string;
  timestamp: string;
  embeds: Embed[];
  reactions: Reactions;
  replies: {
    count: number;
  };
  channel: null;
  mentioned_profiles: User[];
  viewer_context: {
    liked: boolean;
    recasted: boolean;
  };
};

type NeynarApiResponse = {
  result: {
    casts: Cast[];
  };
};

// Function
export async function fetchCastsFromNeynar(hashes: string[], userFid?: number): Promise<Cast[]> {
  const options = {
    method: 'GET',
    url: 'https://api.neynar.com/v2/farcaster/casts',
    params: {
      casts: hashes.join(','),
      viewer_fid: userFid,
    },
    headers: {
      accept: 'application/json',
      api_key: process.env.NEYNAR_API_KEY,
    },
  };

  try {
    const response = await axios.request<NeynarApiResponse>(options);
    return response.data.result.casts;
  } catch (error) {
    console.error('Error fetching casts from Neynar API:', error);
    throw error;
  }
}
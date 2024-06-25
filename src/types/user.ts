interface UserProfile {
    bio: {
      text: string;
      mentioned_profiles?: any[] 
    };
  }
  
  interface UserVerification {
    eth_addresses: string[];
    sol_addresses: string[];
  }
  
  interface UserViewerContext {
    following: boolean;
    followed_by: boolean;
  }
  
  export interface User {
    object: 'user';
    fid: number;
    custody_address: string;
    username: string;
    display_name: string;
    pfp_url: string;
    profile: UserProfile;
    follower_count: number;
    following_count: number;
    verifications: string[];
    verified_addresses: UserVerification;
    active_status: 'active' | 'inactive';
    power_badge: boolean;
    viewer_context: UserViewerContext;
  }



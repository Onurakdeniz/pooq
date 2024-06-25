// Interface for UserProfile
export interface UserProfile {
  bio: {
    text: string; // Biography text
    mentioned_profiles?: User[]; // Optional list of mentioned user profiles
  };
}

// Interface for UserVerification
export interface UserVerification {
  eth_addresses: string[]; // List of Ethereum addresses
  sol_addresses: string[]; // List of Solana addresses
}

// Interface for UserViewerContext
export interface UserViewerContext {
  following: boolean; // Whether the viewer is following the user
  followed_by: boolean; // Whether the user is followed by the viewer
}

// Main User interface
export interface User {
  object: 'user'; // Object type, should always be 'user'
  fid: number; // Unique user ID
  custody_address: string; // Custody address of the user
  username: string; // Username
  display_name: string; // Display name
  pfp_url: string; // URL to the profile picture
  profile: UserProfile; // User profile information
  follower_count: number; // Number of followers
  following_count: number; // Number of followings
  verifications: string[]; // List of verification statuses or badges
  verified_addresses: UserVerification; // User's verified crypto addresses
  active_status: 'active' | 'inactive'; // User's active status
  power_badge: boolean; // Whether the user has a power badge
  viewer_context: UserViewerContext; // Contextual information about the viewer's relationship to the user
}

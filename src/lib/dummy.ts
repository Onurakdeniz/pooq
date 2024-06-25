import {Tag, Profile }  from "@/types/index"
import {User , UserViewerContext , UserProfile} from "@/types/user"

 
  // Example of tags
  const exampleTags: Tag[] = [
    { id: "1", name: 'Developer' , followers  : 2323 , isFollowed : false , description:"asdasdasds" },
    { id: "2", name: 'Developer' , followers  : 2323 , isFollowed : false , description:"asdasdasds" },
    { id: "3", name: 'Developer' , followers  : 2323 , isFollowed : false , description:"asdasdasds" },
  ];
  
  // Dummy data for UserProfile
  const exampleUserProfile: UserProfile = {
    bio: {
      text: "Passionate about blockchain technology and software development. Always exploring new horizons.",
      mentioned_profiles: [
        {
          object: 'user',
          fid: 2,
          custody_address: '0x1234567890abcdef1234567890abcdef12345678',
          username: 'johndoe',
          display_name: 'John Doe',
          pfp_url: 'https://example.com/johndoe.jpg',
          profile: {
            bio: { text: "Blockchain developer." },
            mentioned_profiles: []
          },
          follower_count: 1500,
          following_count: 300,
          verifications: ['Verified'],
          verified_addresses: {
            eth_addresses: ['0x1234567890abcdef1234567890abcdef12345678'],
            sol_addresses: ['9abcdef1234567890abcdef1234567890abcdef12'],
          },
          active_status: 'active',
          power_badge: true,
          viewer_context: { following: true, followed_by: true },
        }
      ],
    },
  };
  
  // Dummy data for UserViewerContext
  const exampleUserViewerContext: UserViewerContext = {
    following: true,
    followed_by: true,
  };
  
  // Dummy data for Profile
  export const exampleProfile: Profile = {
    fid: 1,
    custody_address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    username: 'janedoe',
    display_name: 'Jane Doe',
    pfp_url: 'https://example.com/janedoe.jpg',
    profile: exampleUserProfile,
    follower_count: 2500,
    following_count: 150,
    power_badge: true,
    viewer_context: exampleUserViewerContext,
    tags: exampleTags,
    stories: 10,
    posts: 50,
  };
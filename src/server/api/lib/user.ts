



export interface NeynarApiResponse {
    users: {
      object: "user";
      username: string;
      fid: number;
      custody_address: string;
      display_name: string;
      pfp_url: string;
      profile: { bio: { text: string } };
      follower_count: number;
      following_count: number;
      verifications: string[];
      verified_addresses: string[];
      active_status: string;
      power_badge: boolean
      viewer_context: {
        following: boolean;
        followed_by: boolean;
      };
    }[];
  }
  
  export interface NeynarUserResponse {
    result?: {
      user?: {
        fid: number;
        username: string;
        custodyAddress: string;
        displayName: string;
        pfp: { url: string };
        followerCount: number;
        followingCount: number;
        verifications: string[];
        verifiedAddresses: string[];
        activeStatus: string;
        powerBadge:boolean
        viewerContext: unknown;
        profile: { bio: { text: string } };
      };
    };
  }
  



  export async function fetchNeynarUsers(
    fids: number[],
    viewerFid?: number,
  ): Promise<NeynarApiResponse | null> {
    const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids.join(",")}&viewer_fid=${viewerFid}`;
    console.log(`Calling Neynar API: ${url}`);
  
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY ?? "",
      },
    };
  
    try {
      const response = await fetch(url, options);
  
      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, response.headers);
  
      if (!response.ok) {
        const text = await response.text();
        console.error(`Error response body: ${text}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error(`Unexpected content type: ${contentType}`);
      }
  
      const json = (await response.json()) as NeynarApiResponse;
      return json;
    } catch (error) {
      console.error("Error fetching from Neynar API:", error);
      throw error;
    }
  }
import axios from 'axios';
import { Author, Cast, Reactions, Story, ReactionUser, CastViewerContext } from '@/types/type';

export interface NeynarResponse {
  author: Omit<Author, 'numberOfStories' | 'numberOfPosts'>;
  hash?: string;
  cast: Omit<Cast, 'reactions'> & {
    reactions: {
      likes: ReactionUser[];
      recasts: ReactionUser[];
    };
    viewer_context: CastViewerContext;
  };
}

interface NeynarCast extends Omit<Cast, 'reactions'> {
  hash: string;
  author: Omit<Author, 'numberOfStories' | 'numberOfPosts'>;
  reactions: {
    likes: ReactionUser[];
    recasts: ReactionUser[];
  };
}

interface NeynarApiResponse {
  result: {
    casts: NeynarCast[];
  };
}

export async function fetchFromNeynarAPI(hashes: string[], userFid?: number): Promise<(NeynarResponse | undefined)[]> {
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
    return hashes.map(hash => {
      const cast = response.data.result.casts.find(c => c.hash === hash);
      if (!cast) return undefined;

      const { author, ...castWithoutAuthor } = cast;
      return {
        author,
        cast: castWithoutAuthor,
      };
    });
  } catch (error) {
    console.error('Error fetching data from Neynar API:', error);
    throw error;
  }
}

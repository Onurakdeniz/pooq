// api/neynar.ts

import axios from 'axios';
import type { Author, Cast } from '@/types/type';

export interface NeynarResponse {
  author: Omit<Author, 'numberOfStories' | 'numberOfPosts'>;
  cast: Omit<Cast, 'reactions'> & {
    reactions: {
      likes: { fid: number; fname: string }[];
      recasts: { fid: number; fname: string }[];
    };
  };
}

interface NeynarCast extends Omit<Cast, 'reactions'> {
  hash: string;
  author: Omit<Author, 'numberOfStories' | 'numberOfPosts'>;
  reactions: {
    likes: { fid: number; fname: string }[];
    recasts: { fid: number; fname: string }[];
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
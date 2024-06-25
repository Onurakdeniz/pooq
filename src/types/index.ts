import { Cast } from "./cast"
import { User } from "./user"

export interface Tag {
    id : string
    name : string
    followers : number
    description : string
    isFollowed : boolean
    // stories
}

export interface Entity {
    id : string
    entity : string
}


export interface Bookmark {
    id : string
    isBookmarked : boolean
    storyId : string 
    postId : string
}

export interface UserWithTags extends User {
    tags: Tag[];
  }


 

interface Story {
    id: string;
    title: string;
    tags: Tag[];
    entities : Entity[]
    isBookmarked: boolean;
    author: UserWithTags;
    cast: Omit<Cast, 'embeds' | 'frames' | 'author'>;
  }


  interface Post {
    isBookmarked : boolean
    tags: Tag[];
    entities : Entity[]
    author : UserWithTags
    cast: Omit<Cast, 'embeds' | 'frames' | 'author'>;
  }

  interface Reply {
    author : UserWithTags
    cast: Omit<Cast, 'embeds' | 'frames' | 'author'>;
  }



  export interface Profile extends Omit<User, 'object' |   'verifications' | 'verified_addresses' | 'active_status' > {
    tags: Tag[]; // Array of tags associated with the profile
    stories: number; // Number of stories the user has posted
    posts: number; // Number of posts the user has made
  }


 
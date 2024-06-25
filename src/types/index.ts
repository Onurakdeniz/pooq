import { Cast } from "./cast"
import { User } from "./user"

interface Tag {
    id : string
    tag : string
    numberofFollowers : number
    description : string
    // stories
}

interface Entity {
    id : string
    entity : string
}


interface Bookmark {
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



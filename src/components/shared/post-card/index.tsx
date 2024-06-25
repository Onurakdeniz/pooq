import ProfileAvatar from "@/components/shared/avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  Minus,
  Plus,
  Reply,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Tag from "@/components/shared/tag";
import CardBody from "@/components/shared/story-card/body";
import PostReplies from "./replies";
import PostFooter from "./footer";

interface Reply {
  authorName : string
  authorFid : number
  authorUrl : string
  isLiked : boolean 
  isOwner : boolean
  postText : string
  postDate : Date
  postLikes : number 


}


interface Post {
    authorName : string
    authorFid : number
    authorUrl : string
    isBookmarked : boolean
    isLiked : boolean 
    isOwner : boolean
    postText : string
    postDate : Date
    postLikes : number 
    replies : Reply[]
 }

const Post = ({  }) => {
  return (
    <div className="flex flex-col gap-4 px-8  ">
      <div className="flex h-8 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProfileAvatar size="LARGE" />

          <time className="mb-1  text-end text-xs  font-normal text-primary/60 sm:order-last sm:mb-0">
            just now
          </time>
        </div>

        <div className=" items-cetner flex gap-2 text-xs text-primary/60">
          <Button
            variant={"ghost"}
            className="flex h-8    items-center   gap-1   px-2 text-xs  "
          >
            <Bookmark size={16} strokeWidth={1} />
            <div>Bookmark</div>
          </Button>
          <Button
            variant={"ghost"}
            className="flex  h-8   items-center   gap-1 px-2 text-xs  "
          >
            <Reply size={16} strokeWidth={1} />
            <div>Reply</div>
          </Button>
          <Button
            variant={"outline"}
            className="flex h-8 w-14 items-center  justify-between gap-1 border-none  bg-accent  px-2 text-xs  font-bold  hover:text-emerald-400  "
          >
            <ChevronUp size={16} strokeWidth={1} />
            <div>0</div>
          </Button>
        </div>
      </div>

      <div>
        <div className="flex w-full justify-between">
          <div className="w-12/12 flex  text-pretty pt-2 text-sm font-light text-primary/60">
            Deneme Burada bi zun bir title Deneme Burada ikinci tane title var
            OpenAIs large language models (sometimes referred to as GPTs)
            process text using tokens, which are common sequences of characters
            found in a set of text. The models learn to understand the
            statistical relationships between these tokens, and excel at
            producing the next token in a sequence of tokens. OpenAIs large
            language models (sometimes referred to as GPTs) process text using
            tokens, which are common sequences of characters found in a set of
            text. The models learn to understand the statistical relationships
            between these tokens, and excel at producing the next token in a
            sequence of tokens. You can use the tool below to understand how a
            piece of text might be tokenized by a language model, and the total
            count of tokens in that piece of text. Its important to note that
            the exact tokenization process varies between models. Newer models
            like GPT-3.5 and GPT-4 use a different tokenizer than previous
            models, and will produce different tokens for the same input text.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <PostReplies />
        <PostFooter />
      </div>
    </div>
  );
};

export default Post ; 
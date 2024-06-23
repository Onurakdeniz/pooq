import FeedCard from "@/app/feed/components/feed-card";
import FeedTop from "@/app/feed/components/top";
import StoryHeader from "./components/header";
import StoryTop from "./components/story-top";
import StoryPost from "./components/post";
import { ScrollArea } from "@/components/ui/scroll-area";



export default function Story() {
    return(
        <div className="flex-col flex flex-1">
                <StoryTop/>
                <div className="flex-col flex  ">
                <StoryHeader/>
                <div className="border-b "></div>
                <ScrollArea className="flex h-screen "> 
                <div className="flex-col  flex gap-10   py-8">
                <StoryPost/>
                <StoryPost/>
                </div>
                </ScrollArea>
                </div>
        </div>
    )
}
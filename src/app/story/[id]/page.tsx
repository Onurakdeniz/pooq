import FeedCard from "@/app/feed/components/feed-card";
import FeedTop from "@/app/feed/components/top";
import StoryTop from "./components/story-top";
import StoryHeader from "./components/story-header";
import StoryPost from "./components/post";



export default function Story() {
    return(
        <div className="flex-col flex flex-1">
                <StoryHeader/>
                <StoryTop/>
                <div className="flex-col flex gap-6">
                <StoryPost/>
                <StoryPost/>
                <StoryPost/>
                <StoryPost/>
                </div>
        </div>
    )
}
import FeedCard from "../../components/shared/story-card";
import FeedList from "./components/list";
import FeedTop from "./components/top";



export default function Feed() {
  return <div className="flex-col flex  w-full  ">
    <FeedTop/>
    <FeedList/>
 
  </div>;
}

import FeedCard from "../../components/shared/story-card";
import FeedList from "./components/list";
import FeedTop from "./components/top";


export default async function Feed() {
  return (
    <div className="flex w-full  flex-col  ">
      <FeedTop />
      <FeedList />
    </div>
  );
}

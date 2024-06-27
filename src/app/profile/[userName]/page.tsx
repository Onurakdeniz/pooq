import ProfileFeed from "./components/feed";
import Profile from "./components/profile";
import ProfileTop from "./components/top";

export default function ProfilePage() {
  return (
    <div className="flex w-full h-screen  flex-col">
      <ProfileTop />
      <Profile />
      <ProfileFeed />
    </div>
  );
}

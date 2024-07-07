import { NextPage } from "next";
import { api } from "@/trpc/server";
import ProfileContent from "./components/profile-content";
 

interface ProfilePageProps {
  params: {
    fid: string;
  };
  searchParams: {
    tab?: string;
  };
}

const ProfilePage: NextPage<ProfilePageProps> = async ({ params, searchParams }) => {
  const { fid } = params;
  const profileFid = parseInt(fid);

  // Fetch user profile
  const userProfile = await api.user.getUserProfile({ fid: profileFid });

  return <ProfileContent userProfile={userProfile} profileFid={profileFid} searchParams={searchParams} />;
};

export default ProfilePage;
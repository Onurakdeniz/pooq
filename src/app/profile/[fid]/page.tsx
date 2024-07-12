import { NextPage } from "next";
import { api } from "@/trpc/server";
import ProfileContent from "./components/profile-content";
import Link from "next/link";

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
  const profileFid = parseInt(fid, 10);

  if (isNaN(profileFid)) {
    throw new Error("Invalid FID");
  }

  try {
    const userProfile = await api.user.getUserProfile({ fid: profileFid });

    if (!userProfile) {
      throw new Error("User not found");
    }

    return <ProfileContent userProfile={userProfile} profileFid={profileFid} searchParams={searchParams} />;
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen  text-primary/50 pb-48 ">
          <div className="text-center p-8 rounded-lg ">
            <h1 className="text-4xl font-bold  mb-4">User Not Found</h1>
            <p className="text-xl mb-8">Sorry, we couldnt find the user.</p>
            <Link href="/" className=" font-bold py-2 px-4 border rounded transition duration-300">
              Back to Home
            </Link>
          </div>
        </div>
      );
    }
    
    throw error;
  }
};

export default ProfilePage;
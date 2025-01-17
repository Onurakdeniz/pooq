"use client";

import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Flame, Wallet } from "lucide-react";
import LoginButton from "@/components/shared/login";

export default function Login() {
  const { login ,ready, } = usePrivy();

  return (
    <>
      <Head>
        <title>Welcome to Pooq - Login</title>
        <meta
          name="description"
          content="Join Pooq to see what people are talking about and connect with your community."
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center px-4 pb-32">
        <div className="w-full max-w-md   rounded-lg   p-8 text-center">
          <h1 className="mb-4 text-5xl font-semibold text-primary/70 ">
            Welcome to <span className="font-bold"> pooq </span>{" "}
          </h1>
          <p className="mb-6 text-primary/70">
          pooq is a topic-centric Farcaster client that allows users to easily explore and contribute to a variety of topics using the Farcaster protocol.
          </p>

          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-center space-x-2 text-primary/70">
              <Flame className="text-orange-500" size={20} />
              <span>Discover trending stories</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-primary/70">
              <Wallet className="text-green-500" size={20} />
              <span>Connect with your community</span>
            </div>
          </div>

          <LoginButton variant="page" />
        </div>
      </main>
    </>
  );
}

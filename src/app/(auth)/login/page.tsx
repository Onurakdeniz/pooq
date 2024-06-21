"use client";

import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { login } = usePrivy();

  return (
    <>
      <main className="flex min-h-screen min-w-full flex-col items-center justify-center gap-6  ">
        <div className="font-bold text-red-500">sdsdsdsdssds</div>
        <Button onClick={login}>Login</Button>
      </main>
    </>
  );
}

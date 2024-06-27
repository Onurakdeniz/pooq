import Link from "next/link";

import { api } from "@/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  return <div className="flex h-screen   w-full">
  </div>;
}

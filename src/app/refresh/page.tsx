"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function RefreshPage() {
  const { getAccessToken, ready } = usePrivy();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ready) return;

    // Use void operator to explicitly ignore returned promise
    void (async () => {
      try {
        const accessToken = await getAccessToken();
        console.log("refreshacces", accessToken);
        const redirectTo = searchParams?.get("redirect_to") ?? "/feed";

        if (accessToken) {
          window.location.replace(redirectTo);
        } else {
          window.location.replace("/login");
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
        window.location.replace("/login");
      }
    })(); 
  }, [getAccessToken, ready, searchParams]);

  return null;
}

export default function RefreshPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshPage />
    </Suspense>
  );
}

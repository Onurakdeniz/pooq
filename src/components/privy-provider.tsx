"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { base } from "viem/chains";
import ConnectWalletDialog from "./wallet";

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ""}
      config={{
        defaultChain: base,
        supportedChains: [base],

        loginMethods: ["farcaster"],
        appearance: {
          walletList: ["coinbase_wallet"],
          
        },
        externalWallets: {
          coinbaseWallet: {
            connectionOptions: "smartWalletOnly",
          },
        },
      }}

    >
      {children}

    </PrivyProvider>
  );
}

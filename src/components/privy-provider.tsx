'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import {base, baseGoerli, mainnet, sepolia, polygon, polygonMumbai} from 'viem/chains';

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ""}
      config={{
        embeddedWallets: { 
            createOnLogin: 'all-users'
        } ,
        defaultChain: base ,
        supportedChains: [base] ,
        externalWallets: { 
          coinbaseWallet: { 
   
            connectionOptions: 'smartWalletOnly', 
          }, 
          
        }, 
        appearance: {
          // Defaults ['detected_wallets', 'metamask', 'coinbase_wallet', 'rainbow', 'wallet_connect']
          walletList: ['coinbase_wallet'], 
 
        },
        
    }}
      onSuccess={() => router.push("/")}
    >
      {children}
    </PrivyProvider>
  );
}
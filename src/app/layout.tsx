import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import PrivyProviderWrapper from "../components/privy-provider";
import { TRPCReactProvider } from "@/trpc/react";
import LayoutWrapper from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner";
 
export const metadata = {
  title: "pooq.me ",
  description: " Topic-centric social platform where users initiate discussions, share ideas, and engage in conversations based on specific subjects",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <PrivyProviderWrapper>
          <TRPCReactProvider>
            <LayoutWrapper>
          
              {children}
             </LayoutWrapper>
          </TRPCReactProvider>
        </PrivyProviderWrapper>
        <Toaster />
        </ThemeProvider>
        
      </body>
    </html>
  );
}

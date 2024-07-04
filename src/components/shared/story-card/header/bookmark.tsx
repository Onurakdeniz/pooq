"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { usePrivy, useWallets } from "@privy-io/react-auth";

interface BookmarkStoryProps {
  id: string;
  isBookmarkedProp: boolean;
}

const BookmarkStory: React.FC<BookmarkStoryProps> = ({
  id: storyId,
  isBookmarkedProp,
}) => {
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedProp);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  console.log("isssbook", isBookmarked, isBookmarkedProp);
  const { login, authenticated } = usePrivy();
  const { wallets } = useWallets();
  console.log("Available wallets:", wallets);

  const findCoinbaseWallet = () => {
    return wallets.find(
      (wallet) =>
        wallet.walletClientType === "coinbase_smart_wallet" &&
        wallet.connectorType === "coinbase_wallet",
    );
  };

  const handleBookmark = async () => {
    if (!authenticated) {
      setShowWalletDialog(true);
      return;
    }

    setIsBookmarking(true);
    try {
      console.log("Available wallets:", wallets);
      const coinbaseSmartWallet = findCoinbaseWallet();
      console.log("Found Coinbase Smart Wallet:", coinbaseSmartWallet);

      if (!coinbaseSmartWallet) {
        throw new Error(
          "Coinbase Smart Wallet not found. Please make sure it's connected.",
        );
      }

      const address = coinbaseSmartWallet.address;
      const timestamp = Date.now();
      const message = `Bookmark Story Id ${storyId} at ${timestamp} timestamp`;

      const signature = await coinbaseSmartWallet.sign(message);

      const bookmark = {
        storyId,
        userAddress: address,
        timestamp,
        signature,
      };

      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookmark),
      });
          /* eslint-disable */
      if (!response.ok) {

        const errorData: { message?: string } = await response.json();
        throw new Error(errorData.message ?? "Failed to save bookmark");

      }
          /* eslint-disable */
      const result: { action: "created" | "deleted" } = await response.json();
      setIsBookmarked(result.action === "created");

      if (result.action === "created") {
        toast("Bookmark created", {
          description: "This story has been bookmarked successfully.",
        });
      } else if (result.action === "deleted") {
        toast("Bookmark removed", {
          description: "This story has been removed from your bookmarks.",
        });
      }
    } catch (error) {
      console.error("Error handling bookmark:", error);
      let errorMessage = "Failed to handle bookmark. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }
      toast("Error", {
        description: errorMessage,
      });
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleConnectWallet = () => {
    try {
      if (typeof login === "function") {
        login();
        const coinbaseSmartWallet = findCoinbaseWallet();
        if (coinbaseSmartWallet) {
          toast("Success", {
            description: "Coinbase Wallet connected successfully.",
          });
          setShowWalletDialog(false);
        } else {
          toast("Error", {
            description:
              "Coinbase Wallet not available. Please check your wallet connection.",
          });
        }
      } else {
        throw new Error("Login function is not available");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      let errorMessage = "Failed to connect wallet. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }
      toast("Error", {
        description: errorMessage,
      });
    }
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"outline"}
              className="flex h-8 justify-center gap-2 font-light"
              size="icon"
              onClick={handleBookmark}
              disabled={isBookmarking}
            >
              {isBookmarked ? (
                <BookmarkCheck
                  size={20}
                  strokeWidth={"1"}
                  className="text-emerald-600"
                />
              ) : (
                <Bookmark
                  size={20}
                  strokeWidth={"1"}
                  className="text-gray-500"
                />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isBookmarked ? "Remove Bookmark" : "Bookmark this Story"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              You need to connect your Coinbase Wallet to bookmark this story.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button onClick={handleConnectWallet}>Connect Wallet</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookmarkStory;

'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConnectWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConnectWalletDialog({ open, onOpenChange }: ConnectWalletDialogProps) {
  const { authenticated,   linkWallet, user } = usePrivy();
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      setConnectedAddress(user.wallet.address);
    }
  }, [authenticated, user]);

 /* eslint-disable */
  const handleConnectWallet = async () => {
    try {
      await linkWallet();
      if (user?.wallet?.address) {
        setConnectedAddress(user.wallet.address);
      }
      handleClose();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };
/* eslint-disable */
  const handleClose = () => {
    onOpenChange(false);
    router.push('/feed');
  };

 

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Your Coinbase Smart Wallet</DialogTitle>
          <DialogDescription>
            To use our app, please connect your Coinbase Smart Wallet on Base network.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!connectedAddress ? (
            <Button onClick={handleConnectWallet}>Connect Coinbase Smart Wallet</Button>
          ) : (
            <div className="grid gap-2">
              <p className="text-sm font-medium">Connected Wallet:</p>
              <p className="text-sm text-gray-500 break-all">{connectedAddress}</p>
            </div>
          )}
        </div>
        <Button onClick={handleClose} variant="outline">Close</Button>
      </DialogContent>
    </Dialog>
  );
}
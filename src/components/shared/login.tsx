"use client";

import { useState, useCallback, useEffect } from "react";
import { useLogin, useModalStatus } from "@privy-io/react-auth";
import { loginUser } from "@/actions/login";
import ConnectWalletDialog from "../wallet";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type LoginButtonProps = {
  variant: "page" | "header";
  className?: string;
};

interface PrivyUser {
  id: string;
  // Add other properties of PrivyUser if needed
}

export default function LoginButton({
  variant,
  className = "",
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowDialog, setShouldShowDialog] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const privyModal = useModalStatus();

  useEffect(() => {
    if (searchParams.get("showDialog") === "true") {
      setShouldShowDialog(true);
    }
  }, [searchParams]);
  const handleLoginComplete = useCallback(
    async (user: PrivyUser, isNewUser: boolean) => {
      console.log("Login complete. User:", user, "Is new user:", isNewUser);
      setIsLoading(true);
      try {
        console.log("Attempting to login user with ID:", user.id);
        const result = await loginUser(user.id);
        console.log("Login result:", result);
  
        if (!result.success) {
          throw new Error(result.error ?? 'Login failed');
        }
  
        if (isNewUser) {
          console.log("New user, redirecting to feed with showDialog parameter");
          router.push("/feed?showDialog=true");
        } else {
          console.log("Existing user, redirecting to feed");
          router.push("/feed");
        }
        router.refresh();
      } catch (error) {
        console.error("Login failed:", error);
        toast.error(
          `Login failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const handleLoginError = useCallback((error: unknown) => {
    console.error("Login error:", error);
    setIsLoading(false);
    // Only show error toast if it's a real error, not just a cancellation
    if (error instanceof Error && error.message !== "Login canceled") {
      toast.error(`Login error: ${error.message}`);
    }
  }, []);
  /* eslint-disable */

  const { login } = useLogin({
    onComplete: handleLoginComplete,
    onError: handleLoginError,
  });
  /* eslint-disable */
  const handleLogin = useCallback(() => {
    console.log("Login button clicked");
    setIsLoading(true);
    login();
  }, [login]);

  const handleDialogClose = useCallback(() => {
    console.log("Dialog closed");
    setShouldShowDialog(false);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("showDialog");
    window.history.replaceState({}, "", newUrl);
  }, []);

  useEffect(() => {
    if (privyModal && !privyModal.isOpen) {
      setIsLoading(false);
    }
  }, [privyModal]);

  const baseStyles =
    "font-bold text-secondary transition duration-300 disabled:opacity-50";
  const variantStyles = {
    page: "w-full rounded-full px-4 py-3 bg-primary",
    header: "rounded-md px-3 py-1 text-sm bg-primary ",
  };

  const buttonText = {
    page: isLoading
      ? "Logging in..."
      : "Login with Farcaster or Coinbase Wallet",
    header: isLoading ? "Logging in..." : "Login",
  };

  return (
    <>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {buttonText[variant]}
      </button>
      <ConnectWalletDialog
        open={shouldShowDialog}
        onOpenChange={handleDialogClose}
      />
    </>
  );
}

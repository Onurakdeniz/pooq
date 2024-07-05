import { privy } from "@/lib/privy";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { UNAUTHENTICATED_PAGES } from "@/lib/constants";

interface VerifiedClaims {
  userId: string;
  // Add other properties that are part of the verified claims
}

// Helper function to verify token with a timeout
const verifyTokenWithTimeout = async (token: string, timeoutMs: number): Promise<VerifiedClaims> => {
  return Promise.race([
    privy.verifyAuthToken(token),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Verification timeout')), timeoutMs))
  ]).then((result) => result as VerifiedClaims);
};

// Helper function to check if a user is authenticated
const isUserAuthenticated = async (accessToken: string | undefined) => {
  if (!accessToken) return false;
  try {
    await verifyTokenWithTimeout(accessToken, 3000); // 3 second timeout
    return true;
  } catch (error) {
    console.error(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
};

// Helper function to log all cookies
const logAllCookies = (request: NextRequest) => {
  console.log("All cookies:");
  request.cookies.getAll().forEach(cookie => {
    console.log(`${cookie.name}: ${cookie.value}`);
  });
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`Middleware called for path: ${pathname}`);
  
  // Log all cookies
  logAllCookies(request);
  
  const accessToken = request.cookies.get("privy-token")?.value;
  console.log("Access Token:", accessToken ? "Present" : "Not Present");

  // Check for a temporary login flag
  const isJustLoggedIn = request.cookies.get("just_logged_in")?.value === "true";

  // Bypass middleware for authentication flow, refresh, and unauthenticated pages
  if (
    request.nextUrl.searchParams.has("privy_oauth_code") ||
    request.nextUrl.searchParams.has("privy_oauth_state") ||
    request.nextUrl.searchParams.has("privy_oauth_provider") ||
    pathname === "/refresh" ||
    UNAUTHENTICATED_PAGES.includes(pathname) ||
    isJustLoggedIn
  ) {
    console.log("Bypassing middleware checks");
    return NextResponse.next();
  }

  try {
    console.log(`Checking authentication for token: ${accessToken ? 'exists' : 'does not exist'}`);
    const isAuthenticated = await isUserAuthenticated(accessToken);
    console.log(`Authentication check result: ${isAuthenticated}`);

    if (isAuthenticated && accessToken) {
      // Verify the token and get Privy ID
      const verifiedClaims = await verifyTokenWithTimeout(accessToken, 3000);
      const privyId = verifiedClaims.userId;

      // Get user details to fetch FID
      const user = await privy.getUser(privyId);
      const farcasterAccount = user.linkedAccounts.find(account => account.type === 'farcaster');
      const fid = farcasterAccount && 'fid' in farcasterAccount ? farcasterAccount.fid : null;

      // Create a new response
      const response = (pathname === "/login" || pathname === "/")
        ? NextResponse.redirect(new URL("/feed", request.url))
        : NextResponse.next();

      // Set cookies with Privy ID and FID
      response.cookies.set("privy_id", privyId, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      if (fid) {
        response.cookies.set("user_fid", fid.toString(), { 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }

      console.log(`Set Privy ID cookie: ${privyId}`);
      console.log(`Set User FID cookie: ${fid ?? 'Not available'}`);

      return response;
    }

    if (!isAuthenticated && pathname !== "/login") {
      console.log("User not authenticated. Redirecting to login page");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    console.log("Proceeding to next middleware or page handler");
    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api/register|api/trigger|api/cast-processing|api/cron/trending-stories|api/similar-stories|api/feed-llm|_next/static|_next/image|favicon.ico).*)",
  ],
};
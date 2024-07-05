import { privy } from "@/lib/privy";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { UNAUTHENTICATED_PAGES } from "@/lib/constants";

// Helper function to verify token with a timeout
const verifyTokenWithTimeout = async (token: string, timeoutMs: number) => {
  return Promise.race([
    privy.verifyAuthToken(token),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Verification timeout')), timeoutMs))
  ]);
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

    if (!isAuthenticated && pathname !== "/login") {
      console.log("User not authenticated. Redirecting to login page");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthenticated && (pathname === "/login" || pathname === "/")) {
      console.log("User authenticated. Redirecting to feed page");
      return NextResponse.redirect(new URL("/feed", request.url));
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
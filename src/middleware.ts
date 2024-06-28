import { privy } from "@/lib/privy";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { UNAUTHENTICATED_PAGES } from "@/lib/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("privy-token")?.value;

  // Bypass middleware for authentication flow and refresh
  if (
    request.nextUrl.searchParams.has("privy_oauth_code") ||
    request.nextUrl.searchParams.has("privy_oauth_state") ||
    request.nextUrl.searchParams.has("privy_oauth_provider") ||
    pathname === "/refresh"
  ) {
    return NextResponse.next();
  }

  try {
    let isAuthenticated = false;
    console.log("accsmid", accessToken);
    
    if (accessToken) {
      // Verify the token with Privy's API
      try {
        const verifiedClaims = await privy.verifyAuthToken(accessToken);
        isAuthenticated  = true
        console.log("isAuth",isAuthenticated)
      } catch (error) {
        if (error instanceof Error) {
          console.log(`Token verification failed with error: ${error.message}`);
        } else {
          console.log("Token verification failed with an unknown error.");
        }
      }
    }

    if (!isAuthenticated && !UNAUTHENTICATED_PAGES.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthenticated && (pathname === "/login" || pathname === "/")) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Authentication error:", error.message);
    } else {
      console.error("Authentication error:", "Unknown error");
    }
    // Handle error appropriately, maybe redirect to an error page
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api/register|api/trigger|api/llm|_next/static|_next/image|favicon.ico).*)",
  ],
};
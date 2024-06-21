import { privy } from "@/lib/privy";
import { NextRequest, NextResponse } from "next/server";
import {UNAUTHENTICATED_PAGES } from "@/lib/constants"


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("privy-token");
  const sessionCookie = request.cookies.get("privy-session");

  console.log("accessToken",accessToken)

  // Bypass middleware when `privy_oauth_code` is a query parameter, as
  // we are in the middle of an authentication flow
  if (
    request.nextUrl.searchParams.get("privy_oauth_code") ||
    request.nextUrl.searchParams.get("privy_oauth_state") ||
    request.nextUrl.searchParams.get("privy_oauth_provider")
  ) {
    return NextResponse.next();
  }

  // Bypass middleware when the /refresh page is fetched, otherwise
  // we will enter an infinite loop
  if (pathname === "/refresh") {
    return NextResponse.next();
  }
  console.log(pathname,"pathname")
  // If the user has `privy-token`, they are definitely authenticated
  const definitelyAuthenticated = Boolean(accessToken);

  // If user has `privy-session`, they also have `privy-refresh-token` and
  // may be authenticated once their session is refreshed in the client
  const maybeAuthenticated = Boolean(sessionCookie);

  if (!definitelyAuthenticated && maybeAuthenticated) {
    // If user is not authenticated, but is maybe authenticated
    // redirect them to the `/refresh` page to trigger client-side refresh flow
    const redirectUrl = new URL("/refresh", request.url);
    redirectUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is not authenticated and trying to access a protected page
  // redirect them to the login page
  if (!definitelyAuthenticated && !UNAUTHENTICATED_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user is authenticated and on the login page, redirect to /feed
  if (definitelyAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  if (definitelyAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  // Default behavior for other paths
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/register|api/trigger|_next/static|_next/image|favicon.ico).*)",
  ],
};
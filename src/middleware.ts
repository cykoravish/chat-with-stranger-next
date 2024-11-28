import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = pathname === "/";
  const userName = request.cookies.get("username")?.value || "";
  console.log("cookie username: ", userName);

  if (isPublicPath && userName) {
    return NextResponse.redirect(new URL("/chat", request.nextUrl));
  }

  if (!isPublicPath && !userName) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/chat"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const path = ["/interview", /^\/interview\/.*$/, "/dashboard"];

export function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  if (path.includes(pathName)) {
    const token = request.cookies.get("authjs.session-token");
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

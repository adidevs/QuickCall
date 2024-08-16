import { auth as middleware } from "@/auth";

export default middleware((req) => {
  if (!req.auth && req.nextUrl.pathname == "/meeting/[meeting_id]") {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  if (req.auth && req.nextUrl.pathname == "/sign-in") {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/sign-in",
    "/sign-up",
    "/meeting/[meeting_id]",
  ],
};

// import { NextRequest, NextResponse } from "next/server";
// export { default } from "next-auth/middleware";
// import { getToken } from "next-auth/jwt";
// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const url = req.nextUrl;

//   if (token && url.pathname.startsWith("/sign-in"))
//     return NextResponse.redirect(new URL("/", req.url));

//   // if (
//   //   (token && url.pathname.startsWith("/sign-in")) ||
//   //   url.pathname.startsWith("/sign-up")
//   // )
//   //   return NextResponse.redirect(new URL("/", req.url));

//   // if (
//   //   (!token && url.pathname.startsWith("/meeting/[meeting-id]")) ||
//   //   (token && url.pathname.startsWith("/sign-in")) ||
//   //   url.pathname.startsWith("/sign-up")
//   // )
//   //   return NextResponse.redirect(new URL("/sign-in", req.url));

//   // return NextResponse.redirect(new URL("/", req.url));
// }

// export const config = {
//   matcher: ["/sign-in", "/sign-up", "/meeting/[meeting-id]"],
// };

import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Use only the Edge-compatible config here — no bcrypt or Prisma.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
    // Protect all routes except auth pages, api routes, and static files
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
    ],
};

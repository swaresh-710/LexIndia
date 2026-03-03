import type { NextAuthConfig } from "next-auth";

// This config is Edge-compatible (no bcrypt, no Prisma).
// Used by middleware.ts which runs in the Edge Runtime.
export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAuthPage =
                nextUrl.pathname.startsWith("/login") ||
                nextUrl.pathname.startsWith("/register");

            if (isAuthPage) {
                // Redirect logged-in users away from auth pages
                if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
                return true;
            }

            // Protect all other pages
            return isLoggedIn;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    providers: [], // Filled in by auth.ts with CredentialsProvider (needs bcrypt)
} satisfies NextAuthConfig;

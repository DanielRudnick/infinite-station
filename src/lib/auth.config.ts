import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/") && nextUrl.pathname !== "/login";

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && nextUrl.pathname === "/login") {
                return Response.redirect(new URL("/", nextUrl));
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.tenantId = user.tenantId;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.tenantId = token.tenantId;
                session.user.role = token.role;
            }
            return session;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;

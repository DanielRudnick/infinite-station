import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, contains data about the active session.
   */
  interface Session {
    user: {
      tenantId: string
    } & DefaultSession["user"]
  }

  interface User {
    tenantId: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId: string
    role: string
  }
}

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow sign in for CHARUSAT email domains
      if (user.email?.endsWith("@charusat.edu.in") || user.email?.endsWith("@charusat.ac.in")) {
        return true
      }
      return false
    },
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user, account }) {
      return token
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to callback page after sign in
      if (url.startsWith(baseUrl)) {
        return url
      }
      return `${baseUrl}/auth/callback`
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: false, // Set to false in production
})

export { handler as GET, handler as POST }

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '../../../lib/prisma'


export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
  async session({ session, token, user }) {
    // Send properties to the client, like an access_token from a provider.
     
      if (session.user) {
        session.user.userId = user.id
        session.user.bio = user.bio ?? ''
      }
    return session
  }
},
  pages: {
    signIn: "/",
  },
})
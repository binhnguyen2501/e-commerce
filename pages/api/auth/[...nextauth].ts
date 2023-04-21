import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import client from "../../../prisma/client";
import bcrypt from "bcryptjs";
import Stripe from "stripe";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  adapter: PrismaAdapter(client),
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const user: any = await client.user.findUnique({
          where: { email: req.body?.email },
        });
        const checkPassword = await bcrypt.compare(req.body?.password, user.password)

        if (!user) {
          throw new Error("No user found with email. Please sign up!")
        }

        if (!checkPassword || user.email !== req.body?.email) {
          throw new Error("Email or password in correct. Please try again!")
        }

        return user
      }
    })
  ],
  events: {
    // create with third party
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
        apiVersion: '2022-11-15'
      })
      if (user.email && user.name) {
        // create stripe customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name
        })
        // update prisma with stripeCustomerId
        await client.user.update({
          where: {
            id: user.id
          },
          data: {
            stripeCustomerId: customer.id
          }
        })
      }
    }
  },
  callbacks: {
    session: async ({
      session,
      token,
      user
    }: any) => {
      const selectedCustomer = await client.user.findUnique({
        where: { email: session.user?.email || "" },
      });

      return {
        user: {
          ...session.user,
          id: selectedCustomer?.id,
          stripeCustomerId: selectedCustomer?.stripeCustomerId
        }
      }
    },
  }
};

export default NextAuth(authOptions);

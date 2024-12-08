import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import TwitterProvider from 'next-auth/providers/twitter'
import EmailProvider from 'next-auth/providers/email'

import { NuxtAuthHandler } from '#auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '~~/server/database/client'
import { account, authenticator, session, user, verificationToken } from '~~/server/database/schemas/auth'
import { DefaultSession } from 'next-auth'

const { auth } = useRuntimeConfig()

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string
    } & DefaultSession['user']
  }
}

export default NuxtAuthHandler({
  secret: auth.secret,
  // @ts-expect-error
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: account,
    authenticatorsTable: authenticator,
    sessionsTable: session,
    verificationTokensTable: verificationToken,
  }),
  pages: {
    // TODO add your login page path here
    signIn: `/`,
    // TODO add the path to redirect to after clicking on Signin in the email.
    verifyRequest: `/`,
  },
  providers: [
    // @ts-expect-error
    GithubProvider.default({
      clientId: auth.github.clientId,
      clientSecret: auth.github.clientSecret,
    }),
    // @ts-expect-error
    GoogleProvider.default({
      clientId: auth.google.clientId,
      clientSecret: auth.google.clientSecret,
    }),
    // @ts-expect-error
    TwitterProvider.default({
      clientId: auth.twitter.clientId,
      clientSecret: auth.twitter.clientSecret,
      version: '2.0',
    }),
    // @ts-expect-error
    EmailProvider.default({
      id: 'magic-link',
      name: 'send magic link by email',
      type: 'email',
      server: {
        host: auth.email.host,
        port: auth.email.password,
        auth: {
          user: auth.email.username,
          pass: auth.email.password,
        },
      },
      from: auth.email.senderName,
      maxAge: 60 * 60,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (!session || !session.user) {
        return session
      }

      session.user.id = user.id
      return session
    },
  },
})

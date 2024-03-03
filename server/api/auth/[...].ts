import CredentialsProvider from "@auth/core/providers/credentials";
import type { AuthConfig } from "@auth/core/types";
import { NuxtAuthHandler } from "#auth";
import { compare } from "bcrypt";
import type { User } from "@prisma/client";
import { prisma } from "~/server/plugins/prisma";

const runtimeConfig = useRuntimeConfig();

export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  providers: [
    CredentialsProvider({
      authorize: async (credentials) => {
        // TODO: Credential validation
        if (!credentials?.usernameOrEmail || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              {
                email: credentials.usernameOrEmail as string,
              },
              {
                username: credentials.usernameOrEmail as string,
              },
            ],
          },
        });

        if (!user) {
          return null;
        }

        const passwordValid = await compare(
          (credentials.password as string).trim(),
          user.password,
        );

        if (!passwordValid) {
          return null;
        }

        return {
          ...user,
          password: undefined,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
  },
};

export default NuxtAuthHandler(authOptions, runtimeConfig);

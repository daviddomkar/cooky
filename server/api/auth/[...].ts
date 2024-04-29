import CredentialsProvider from "@auth/core/providers/credentials";
import type { AuthConfig } from "@auth/core/types";
import { NuxtAuthHandler } from "#auth";
import { compare } from "bcrypt";
import type { User } from "@prisma/client";
import { safeParseAsync } from "valibot";

const runtimeConfig = useRuntimeConfig();

export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  providers: [
    CredentialsProvider({
      authorize: async (credentials) => {
        const result = await safeParseAsync(LogInSchema, credentials);

        if (!result.success) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              {
                email: result.output.usernameOrEmail as string,
              },
              {
                username: result.output.usernameOrEmail as string,
              },
            ],
          },
        });

        if (!user) {
          return null;
        }

        const passwordValid = await compare(
          (result.output.password as string).trim(),
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
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: {
          id: (token.user as User).id,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          profileImageId: true,
          coverImageId: true,
          favoritesListId: true,
          lastUsedListId: true,
          roles: {
            select: {
              role: {
                select: {
                  permissions: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw createError({
          statusCode: 404,
          message: "User not found.",
        });
      }

      session.user = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        profileImageId: user.profileImageId ?? undefined,
        coverImageId: user.coverImageId ?? undefined,
        favoritesListId: user.favoritesListId ?? undefined,
        lastUsedListId: user.lastUsedListId ?? undefined,
        permissions: [
          ...new Set(user.roles.flatMap((role) => role.role.permissions)),
        ],
      };

      return session;
    },
  },
};

export default NuxtAuthHandler(authOptions, runtimeConfig);

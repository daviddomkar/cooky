import type { User as PrismaUser } from "@prisma/client";

declare module "@auth/core/types" {
  interface Session {
    user: Omit<PrismaUser, "password">;
  }
}

declare global {
  namespace PrismaJson {
    type Step = {
      title: string;
      content: string;
    };
  }

  type PaginationQuery = {
    take?: number;
  } & Record<string, any>;

  type PaginationResult<T> = {
    data: T[];
    pagination: {
      prevCursor?: string;
      nextCursor?: string;
    };
  };
}

export {};

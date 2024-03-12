import type { User } from "@prisma/client";

declare module "@auth/core/types" {
  interface Session {
    user?: User;
  }
}

declare global {
  namespace PrismaJson {
    type Step = {
      title: string;
      content: string;
    };
  }
}

export {};

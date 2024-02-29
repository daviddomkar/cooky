import type { User } from "@prisma/client";

declare module "@auth/core/types" {
  interface Session {
    user?: User;
  }
}

export {};

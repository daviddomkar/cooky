import type { User } from "@prisma/client";
import type { Step as StepAlias } from "~/server/utils/prisma-client";

declare module "@auth/core/types" {
  interface Session {
    user?: User;
  }
}

declare global {
  namespace PrismaJson {
    type Step = StepAlias;
  }
}

export {};

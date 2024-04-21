import type { User as PrismaUser } from "@prisma/client";

declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      profileImageId?: string;
      coverImageId?: string;
      favoritesListId?: string;
      lastUsedListId?: string;
      permissions: string[];
    };
  }
}

declare global {
  namespace PrismaJson {
    type Step = {
      title: string;
      content: string;
    };
  }

  type PickFrom<T, K extends Array<string>> =
    T extends Array<any>
      ? T
      : T extends Record<string, any>
        ? keyof T extends K[number]
          ? T
          : K[number] extends never
            ? T
            : Pick<T, K[number]>
        : T;

  type KeysOf<T> = Array<
    T extends T ? (keyof T extends string ? keyof T : never) : never
  >;

  type IsArray<T> = T extends Array<any> ? T : never;

  type ArrayKeys<T> = {
    [K in keyof T]: IsArray<T[K]>;
  };
}

export {};

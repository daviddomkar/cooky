export type PickFrom<T, K extends Array<string>> =
  T extends Array<any>
    ? T
    : T extends Record<string, any>
      ? keyof T extends K[number]
        ? T
        : K[number] extends never
          ? T
          : Pick<T, K[number]>
      : T;

export type KeysOf<T> = Array<
  T extends T ? (keyof T extends string ? keyof T : never) : never
>;

type IsArray<T> = T extends Array<any> ? T : never;

export type ArrayKeys<T> = {
  [K in keyof T]: IsArray<T[K]>;
};

export function getProfileImageUrl(
  username: string,
  profileImageId?: string | null,
) {
  return profileImageId
    ? `/api/files/${profileImageId}`
    : `https://api.dicebear.com/8.x/micah/svg?seed=${username}&backgroundType=solid,gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
}

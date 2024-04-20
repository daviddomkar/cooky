export function getProfileImageUrl(
  username: string,
  profileImageId?: string | null,
) {
  return profileImageId
    ? `/api/files/${profileImageId}`
    : `https://api.dicebear.com/8.x/micah/svg?seed=${username}&backgroundType=solid,gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
}

export function parseInterval(value: string) {
  return value
    .split(":")
    .map((x) => Number(x))
    .map((x, i) => (x === 0 ? "" : `${x}${["h", "m", "s"][i]}`))
    .join("");
}

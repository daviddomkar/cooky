export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomElement<T>(...list: T[]): T {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

export function generateRandomUniqueElements<T>(
  quantity: number,
  generateElement: () => T,
  isIdentical: (a: T, b: T) => boolean,
): T[] {
  if (quantity < 0) return [];
  const elements = Array.from(Array(quantity)).map(() => generateElement());
  const uniqueElements = elements.filter(
    (x, i) => !elements.some((y, j) => i !== j && isIdentical(x, y)),
  );
  return uniqueElements;
}

export enum ScrapedUnitType {
  VOLUME,
  WEIGHT,
  QUANTITY,
  UNKNOWN,
}

export enum ScrapedRecipeCategory {
  BREAKFAST,
  LUNCH,
  DINNER,
  SNACKS,
  SOUPS,
  SAUCES,
}

export enum ScrapedRecipeState {
  DRAFT,
  PUBLISHED,
}

export type ScrapedUser = {
  name: string;
  username: string;
  email: string;
};

export type ScrapedUnit = {
  title: string;
  type: ScrapedUnitType;
  abbreviation: string;
};

export type ScrapedIngredient = {
  title: string;
  unitTypes: ScrapedUnitType[];
};

export type ScrapedRecipeIngredient = {
  amount: number;
  unitId: number;
  ingredientId: number;
};

export type ScrapedRecipeStep = {
  title: string;
  content: string;
};

export type ScrapedRecipeReply = {
  author: number;
  content: string;
};

export type ScrapedRecipeComment = {
  author: number;
  content: string;
  replies: ScrapedRecipeReply[];
};

export type ScrapedRecipe = {
  title: string;
  description: string;
  preparationDurationMinutes: number;
  state: ScrapedRecipeState;
  categories: ScrapedRecipeCategory[];
  steps: ScrapedRecipeStep[];
  nutritionPerServing: number;
  numberOfServings: number;
  ingredients: ScrapedRecipeIngredient[];
  comments: ScrapedRecipeComment[];
  imageId: number;
  authorId: number;
};

export type ScrapedData = {
  recipeImages: string[];
  users: ScrapedUser[];
  ingredients: ScrapedIngredient[];
  units: ScrapedUnit[];
  recipes: ScrapedRecipe[];
};

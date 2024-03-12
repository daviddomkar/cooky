export enum UnitType {
  VOLUME,
  WEIGHT,
  QUANTITY,
  UNKNOWN,
}

export enum RecipeCategory {
  BREAKFAST,
  LUNCH,
  DINNER,
  SNACKS,
  SOUPS,
  SAUCES,
}

export enum RecipeState {
  DRAFT,
  PUBLISHED,
}

export type User = {
  name: string;
  username: string;
  email: string;
};

export type Unit = {
  title: string;
  type: UnitType;
  abbreviation: string;
};

export type Ingredient = {
  title: string;
  unit_types: UnitType[];
};

export type RecipeIngredient = {
  amount: number;
  unit_id: number;
  ingredient_id: number;
};

export type RecipeStep = {
  title: string;
  content: string;
};

export type RecipeReply = {
  author: number;
  content: string;
};

export type RecipeComment = {
  author: number;
  content: string;
  replies: RecipeReply[];
};

export type Recipe = {
  title: string;
  description: string;
  preparation_duration_minutes: number;
  state: RecipeState;
  categories: RecipeCategory[];
  steps: RecipeStep[];
  nutritionPerServing: number;
  numberOfServings: number;
  ingredients: RecipeIngredient[];
  comments: RecipeComment[];
  image_id: number;
  author_id: number;
};

export type ScrapedData = {
  recipe_images: string[];
  users: User[];
  ingredients: Ingredient[];
  units: Unit[];
  recipes: Recipe[];
};

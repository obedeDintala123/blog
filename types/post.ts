import z from "zod";

export interface IPost {
  id: number;
  title: string;
  description: string;
  content: any;
  published: boolean;
  slug: string;
  coverImage: string | null;
  category: Category;
  postType: PostCardType;
  authorId: number;
  author?:{
    name: string;
  }
  _count: {
    comments: 0;
    likedBy: 0;
  };
  createdAt: string;
  updatedAt: string;
}

export enum Category {
  TECH = "TECH",
  LIFESTYLE = "LIFESTYLE",
  TRAVEL = "TRAVEL",
  FOOD = "FOOD",
  EDUCATION = "EDUCATION",
  HEALTH = "HEALTH",
  FINANCE = "FINANCE",
  SPORTS = "SPORTS",
  ENTERTAINMENT = "ENTERTAINMENT",
  BUSINESS = "BUSINESS",
  SCIENCE = "SCIENCE",
  ART = "ART",
}

export const PostSchema = z.object({
  title: z.string().min(1, { message: "Set a title of post" }),
  description: z.string().min(1, { message: "Set a description of post" }),
  category: z.nativeEnum(Category),
  content: z.any(),
});

export enum PostCardType {
  TOP_RIGHT = "TOP_RIGHT",
  TOP_LEFT = "TOP_LEFT",
  BOTTOM_RIGHT = "BOTTOM_RIGHT",
  BOTTOM_LEFT = "BOTTOM_LEFT",
}

import { z } from 'zod';
import { insertPostSchema, postTable } from '../server/db/schema/posts';
import type { InferSelectModel } from 'drizzle-orm';

export type SuccessResponse<T = undefined> = {
  success: true;
  message: string;
  data?: T;
};
export type ErrorResponse = {
    success : boolean;
    error: string
    isFormError? : boolean
}
export const loginSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(31)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(3).max(255),
});

export const createPostSchema = insertPostSchema
  .pick({
    title: true,
    url: true,
    content: true,
  })
  .refine((data) => data.url || data.content, {
    message: "Either URL or Content must be provided",
    path: ["url", "content"],
  });

  export type Post = InferSelectModel<typeof postTable>;
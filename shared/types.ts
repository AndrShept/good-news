import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { userTable } from '../server/db/schema/auth-schema';
import { commentTable } from '../server/db/schema/comments-schema';
import { postTable } from '../server/db/schema/posts-schema';

export type SuccessResponse<T = undefined> = {
  success: true;
  message: string;
  data?: T;
};
export type ErrorResponse = {
  success: false;
  message: string;
  isFormError?: boolean;
};
export const loginSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(31)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(3).max(255),

});

export const createPostSchema = createInsertSchema(postTable, {
  title: z.string().min(3),
  url: z.string().trim().url({ message: 'URL must be a valid URL' }).optional().or(z.literal('')),
  content: z.string().min(3).optional().or(z.literal('')),
})
  .pick({
    title: true,
    url: true,
    content: true,
    
  })
  .refine((data) => data.url || data.content, {
    message: 'Either URL or Content must be provided',
    path: ['url', 'content'],
  });

const insertCommentSchema = createInsertSchema(commentTable, {
  content: z.string().min(1).trim(),
});

export const createCommentSchema = insertCommentSchema.pick({
  content: true,
});

export const sortBySchema = z.enum(['points', 'recent']);
export const orderSchema = z.enum(['asc', 'desc']);

export const paginationSchema = z.object({
  limit: z
    .number({
      coerce: true,
    })
    .optional()
    .default(10),
  page: z
    .number({
      coerce: true,
    })
    .optional()
    .default(1),
  sortBy: sortBySchema.optional().default('points'),
  order: orderSchema.optional().default('desc'),
  author: z.optional(z.string()),
  site: z.string().optional(),
});
export type User = InferSelectModel<typeof userTable>;
export type Post = InferSelectModel<typeof postTable> & {
  comments?: Comments[];
  author?: Omit<User, 'password_hash'>;
  isUpvoted?: boolean;
};
export type Comments = InferSelectModel<typeof commentTable> & {
  childComments?: Comments[];
  author?: User;
  isUpvoted?: boolean;
};

export type PaginatedResponse<T> = {
  pagination: {
    page: number;
    totalPages: number;
  };
  data: T;
} & Omit<SuccessResponse, 'data'>;

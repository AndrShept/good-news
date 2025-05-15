import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { InferResponseType } from 'hono';
import { z } from 'zod';

import type { client } from '../frontend/src/lib/utils';
import { heroTable, inventoryItemTable, modifierTable } from '../server/db/schema';
import { userTable } from '../server/db/schema/auth-schema';
import { commentTable } from '../server/db/schema/comments-schema';
import type { equipmentTable, slotEnum } from '../server/db/schema/equipment-schema';
import type { gameItemEnum, gameItemTable, rarityEnum, weaponHandEnum } from '../server/db/schema/game-item-schema';
import { postTable } from '../server/db/schema/posts-schema';
import type { ApiRoutes } from '../server/index';

export type AppType = ApiRoutes;

export type SuccessResponse<T = undefined> = {
  success: true;
  message: string;
  data?: T;
};
export type ErrorResponse = {
  success: false;
  message: string;
  isShowError?: boolean;
};
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(255),
});
export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(3).max(255),
    username: z
      .string()
      .min(3)
      .max(31)
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: 'Passwords must match!',
    path: ['confirmPassword'],
  });

export const createPostSchema = createInsertSchema(postTable, {
  title: z.string().min(3),
  content: z.string().min(3).optional().or(z.literal('')),
  url: z.string().trim().url({ message: 'URL must be a valid URL' }).optional().or(z.literal('')),
})
  .pick({
    title: true,
    content: true,
    url: true,
  })
  .superRefine((data, ctx) => {
    if (!data.url && !data.content) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either URL or Content must be provided',
        path: ['url'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either URL or Content must be provided',
        path: ['content'],
      });
    }
  });

const insertCommentSchema = createInsertSchema(commentTable, {
  content: z.string().min(1).trim(),
});

export const createCommentSchema = insertCommentSchema.pick({
  content: true,
});

export const sortBySchema = z.enum(['points', 'recent']);
export const orderSchema = z.enum(['asc', 'desc']);
export type SortBy = z.infer<typeof sortBySchema>;
export type Order = z.infer<typeof orderSchema>;

export const paginationSchema = z.object({
  limit: z
    .number({
      coerce: true,
    })
    .optional()
    .default(8),
  page: z
    .number({
      coerce: true,
    })
    .optional()
    .default(1),
  sortBy: sortBySchema.optional().default('recent'),
  order: orderSchema.optional().default('asc'),
  author: z.optional(z.string()),
  site: z.string().optional(),
});
export type IPaginationSchema = z.infer<typeof paginationSchema>;
export type User = InferSelectModel<typeof userTable>;
export type Post = InferSelectModel<typeof postTable> & {
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

export type GetPostsData = InferResponseType<typeof client.post.$get>;

export type EquipmentSlotType = (typeof slotEnum.enumValues)[number];
export type GameItemType = (typeof gameItemEnum.enumValues)[number];
export type RarityType = (typeof rarityEnum.enumValues)[number];
export type WeaponHandType = (typeof weaponHandEnum.enumValues)[number];

export type Modifier = InferSelectModel<typeof modifierTable>;
export type Equipment = InferSelectModel<typeof equipmentTable>;
export type InventoryItem = InferSelectModel<typeof inventoryItemTable> & {
  gameItem: GameItem;
};
export type GameItem = InferSelectModel<typeof gameItemTable> & {
  modifier: Modifier;
};
export type Hero = InferSelectModel<typeof heroTable> & {
  modifier: Modifier;
  equipments: Equipment[];
};
export const statsSchema = createSelectSchema(modifierTable, {
  strength: z.number({ coerce: true }),
  constitution: z.number({ coerce: true }),
  intelligence: z.number({ coerce: true }),
  dexterity: z.number({ coerce: true }),
  luck: z.number({ coerce: true }),
}).pick({
  constitution: true,
  dexterity: true,
  luck: true,
  intelligence: true,
  strength: true,
});
export type HeroStats = z.infer<typeof statsSchema>;
export const createHeroSchema = createInsertSchema(heroTable, {
  name: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'hero name can only contain letters, numbers, and underscores'),
  freeStatPoints: z.number({ coerce: true }),
  avatarImage: z.string().min(1),
  // characterImage: z.string().min(1),

})
  .pick({
    name: true,
    avatarImage: true,
    freeStatPoints: true,
    characterImage: true

  })
  .extend({
    modifier: z.string().transform((val) => JSON.parse(val) as HeroStats),
  });

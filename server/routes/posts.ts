import { Hono } from 'hono';
import type { Context } from '../context';
import { loggedIn } from '../middleware/loggedIn';
import { zValidator } from '@hono/zod-validator';
import { insertPostSchema, postTable } from '../db/schema/posts';
import {
  createPostSchema,
  type Post,
  type SuccessResponse,
} from '../../shared/types';
import { db } from '../db/db';

export const postRouter = new Hono<Context>();

postRouter.post(
  '/post',
  loggedIn,
  zValidator('form', createPostSchema),
  async (c) => {
    const { title, content, url } = c.req.valid('form');
    const userId = c.get('user')?.id;
    const [post] = await db
      .insert(postTable)
      .values({
        authorId: userId!,
        content,
        title,
        url,
      })
      .returning();
    return c.json<SuccessResponse<Post>>(
      {
        success: true,
        message: 'Post created',
        data: post,
      },
      201
    );
  }
);

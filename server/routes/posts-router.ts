import { Hono } from 'hono';
import type { Context } from '../context';
import { loggedIn } from '../middleware/loggedIn';
import { zValidator } from '@hono/zod-validator';
import { postTable } from '../db/schema/posts-schema';
import {
  createPostSchema,
  paginationSchema,
  type PaginatedResponse,
  type Post,
  type SuccessResponse,
} from '../../shared/types';
import { db } from '../db/db';
import { and, asc, countDistinct, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { postUpvotesTable } from '../db/schema/upvotes-schema';
import { HTTPException } from 'hono/http-exception';

export const postRouter = new Hono<Context>();

postRouter.post(
  '/',
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
      .returning({ id: postTable.id });
    return c.json<SuccessResponse<{ id: number }>>(
      {
        success: true,
        message: 'Post created',
        data: { id: post.id },
      },
      201
    );
  }
);

postRouter.get(
  '/',

  zValidator('query', paginationSchema),
  async (c) => {
    const { limit, order, page, sortBy, author, site } = c.req.valid('query');
    const user = c.get('user');
    const offset = (page - 1) * limit;
    const sortByColumn =
      sortBy === 'points' ? postTable.points : postTable.createdAt;
    const sortOrder = order === 'desc' ? desc(sortByColumn) : asc(sortByColumn);
    const [count] = await db
      .select({ count: countDistinct(postTable.id) })
      .from(postTable)
      .where(
        and(
          author ? eq(postTable.authorId, author) : undefined,
          site ? eq(postTable.url, site) : undefined
        )
      );

    const posts = await db.query.postTable.findMany({
      limit,
      offset,
      orderBy: sortOrder,
      with: {
        comments: {
          with: {
            author: true,
          },
        },
        author: {
          columns: {
            password_hash: false,
          },
        },
        upvotes: true,
      },
      extras: {
        isUpvoted: user
          ? sql<boolean>`EXISTS (
          SELECT 1 FROM post_upvotes 
          WHERE post_upvotes.post_id = ${postTable.id} 
          AND post_upvotes.user_id = ${user?.id}
        )`.as('is_upvoted')
          : sql<boolean>`FALSE`.as('is_upvoted'),
      },
    });

    return c.json<PaginatedResponse<Post[]>>({
      success: true,
      message: 'Posts fetched',
      data: posts,
      pagination: {
        page,
        totalPages: Math.ceil(count.count / limit),
      },
    });
  }
);

postRouter.post(
  '/:id/upvote',
  loggedIn,
  zValidator('param', z.object({ id: z.number({ coerce: true }) })),
  async (c) => {
    const { id } = c.req.valid('param');
    const userId = c.get('user')?.id ?? '';

    const post = await db.query.postTable.findFirst({
      where: eq(postTable.id, id),
    });
    if (!post) {
      throw new HTTPException(404, {
        message: 'Post not found',
      });
    }
    const data = {
      message: '',
      point: 0,
    };

    await db.transaction(async (tx) => {
      const existUpvote = await tx.query.postUpvotesTable.findFirst({
        where: and(
          eq(postUpvotesTable.postId, id),
          eq(postUpvotesTable.userId, userId)
        ),
      });
      if (existUpvote) {
        await tx
          .delete(postUpvotesTable)
          .where(
            and(
              eq(postUpvotesTable.postId, id),
              eq(postUpvotesTable.userId, userId)
            )
          );
        data.message = 'You delete upvoted  post';
        data.point = 0;
      } else {
        await tx.insert(postUpvotesTable).values({
          postId: id,
          userId,
        });
        data.message = 'You upvoted post';
        data.point = 1;
      }
    });

    return c.json<SuccessResponse<{ count: number; isUpvoted: boolean }>>({
      success: true,
      message: data.message,
      data: {
        count: data.point,
        isUpvoted: data.point === 1,
      },
    });
  }
);

import { zValidator } from '@hono/zod-validator';
import { and, asc, countDistinct, desc, eq, isNull, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import {
  type Comments,
  type PaginatedResponse,
  type Post,
  type SuccessResponse,
  createCommentSchema,
  createPostSchema,
  paginationSchema,
} from '../../shared/types';
import type { Context } from '../context';
import { db } from '../db/db';
import { commentTable } from '../db/schema/comments-schema';
import { postTable } from '../db/schema/posts-schema';
import { postUpvotesTable } from '../db/schema/upvotes-schema';
import { loggedIn } from '../middleware/loggedIn';

export const postRouter = new Hono<Context>()

  .post('/', loggedIn, zValidator('form', createPostSchema), async (c) => {
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
      .returning({
        id: postTable.id,
      });
    return c.json<
      SuccessResponse<{
        id: number;
      }>
    >(
      {
        success: true,
        message: 'Post created',
        data: {
          id: post.id,
        },
      },
      201,
    );
  })

  .get(
    '/',

    zValidator('query', paginationSchema),
    async (c) => {
      const { limit, order, page, sortBy, author, site } = c.req.valid('query');
      const user = c.get('user');
      const offset = (page - 1) * limit;
      const sortByColumn = sortBy === 'points' ? postTable.points : postTable.createdAt;
      const sortOrder = order === 'desc' ? desc(sortByColumn) : asc(sortByColumn);
      const [count] = await db
        .select({
          count: countDistinct(postTable.id),
        })
        .from(postTable)
        .where(and(author ? eq(postTable.authorId, author) : undefined, site ? eq(postTable.url, site) : undefined));
      console.log(page);
      const posts = await db.query.postTable.findMany({
        limit,
        offset,
        orderBy: sortOrder,
        with: {
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
    },
  )

  .post(
    '/:id/upvote',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.number({
          coerce: true,
        }),
      }),
    ),
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
          where: and(eq(postUpvotesTable.postId, id), eq(postUpvotesTable.userId, userId)),
        });
        if (existUpvote) {
          await tx.delete(postUpvotesTable).where(and(eq(postUpvotesTable.postId, id), eq(postUpvotesTable.userId, userId)));
          await tx
            .update(postTable)
            .set({
              points: sql`${postTable.points}- 1`,
            })
            .where(eq(postTable.id, id));
          data.message = 'You delete upvoted  post';
          data.point = -1;
        } else {
          await tx.insert(postUpvotesTable).values({
            postId: id,
            userId,
          });
          await tx
            .update(postTable)
            .set({
              points: sql`${postTable.points}+ 1`,
            })
            .where(eq(postTable.id, id));
          data.message = 'You upvoted post';
          data.point = 1;
        }
      });

      return c.json<
        SuccessResponse<{
          count: number;
          isUpvoted: boolean;
        }>
      >({
        success: true,
        message: data.message,
        data: {
          count: data.point,
          isUpvoted: data.point === 1,
        },
      });
    },
  )

  .post(
    '/:id/comment',
    loggedIn,
    zValidator('param', z.object({ id: z.number({ coerce: true }) })),
    zValidator('form', createCommentSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const { content } = c.req.valid('form');
      const userId = c.get('user')?.id;

      const post = await db.query.postTable.findFirst({
        where: eq(postTable.id, id),
      });
      if (!post) {
        throw new HTTPException(404, { message: 'POST not found' });
      }

      const data = await db.transaction(async (tx) => {
        const count = await tx.$count(commentTable, eq(commentTable.postId, id));

        const [updated] = await tx
          .update(postTable)
          .set({
            commentCount: count + 1,
          })
          .where(eq(postTable.id, id))
          .returning({
            commentCount: postTable.commentCount,
          });
        const [comment] = await tx
          .insert(commentTable)
          .values({
            authorId: userId!,
            postId: id,
            content,
          })
          .returning();
        return { ...comment, commentCount: updated.commentCount };
      });

      return c.json<SuccessResponse<Comments>>({
        message: 'comment created',
        success: true,
        data,
      });
    },
  )

  .get(
    '/:id/comment',
    zValidator('param', z.object({ id: z.number({ coerce: true }) })),
    zValidator(
      'query',
      paginationSchema.extend({
        includeChildren: z.boolean({ coerce: true }).optional(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      const { limit, order, page, sortBy, includeChildren } = c.req.valid('query');
      const user = c.get('user');
      const offset = (page - 1) * limit;
      const sortByColumn = sortBy === 'points' ? commentTable.points : commentTable.createdAt;
      const sortOrder = order === 'desc' ? desc(sortByColumn) : asc(sortByColumn);
      const post = await db.query.postTable.findFirst({
        where: eq(postTable.id, id),
      });
      if (!post) {
        throw new HTTPException(404, { message: 'Post not found' });
      }

      const comments = await db.query.commentTable.findMany({
        where: and(eq(commentTable.postId, id), isNull(commentTable.parentCommentId)),
        offset,
        limit,
        orderBy: sortOrder,
        with: {
          author: true,
          childComments: includeChildren ? true : undefined,
        },

        extras: {
          isUpvoted: user
            ? sql<boolean>`EXISTS (
        SELECT 1 FROM comment_upvotes 
        WHERE comment_upvotes.comment_id = ${commentTable.id} 
        AND comment_upvotes.user_id = ${user?.id}
      )`.as('is_upvoted')
            : sql<boolean>`FALSE`.as('is_upvoted'),
        },
      });
      const count = await db.$count(commentTable, eq(commentTable.postId, id));
      return c.json<PaginatedResponse<Comments[]>>({
        success: true,
        message: 'Fetched comments',
        data: comments,
        pagination: {
          page,
          totalPages: Math.ceil(count / limit),
        },
      });
    },
  )

  .get('/:id', zValidator('param', z.object({ id: z.number({ coerce: true }) })), async (c) => {
    const { id } = c.req.valid('param');
    const user = c.get('user');

    const post = await db.query.postTable.findFirst({
      where: eq(postTable.id, id),
      with: {
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
    if (!post) {
      throw new HTTPException(404, { message: 'Post not found' });
    }

    return c.json<SuccessResponse<Post>>({
      success: true,
      message: 'Post fetched',
      data: post,
    });
  });

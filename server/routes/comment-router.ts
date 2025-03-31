import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import { type Comments, type PaginatedResponse, type SuccessResponse, createCommentSchema, paginationSchema } from '../../shared/types';
import type { Context } from '../context';
import { db } from '../db/db';
import { commentTable } from '../db/schema/comments-schema';
import { postTable } from '../db/schema/posts-schema';
import { commentUpvotesTable } from '../db/schema/upvotes-schema';
import { loggedIn } from '../middleware/loggedIn';

export const commentRouter = new Hono<Context>()

  .post(
    '/:id',
    loggedIn,
    zValidator('param', z.object({ id: z.number({ coerce: true }) })),
    zValidator('form', createCommentSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const { content } = c.req.valid('form');
      const userId = c.get('user')?.id;

      const parentComment = await db.query.commentTable.findFirst({
        where: eq(commentTable.id, id),
      });
      if (!parentComment) {
        throw new HTTPException(404, { message: 'Parent comment not found' });
      }
      const postId = parentComment.postId;

      const comment = await db.transaction(async (tx) => {
        await tx
          .update(commentTable)
          .set({
            commentCount: sql`${commentTable.commentCount} + 1`,
          })
          .where(eq(commentTable.id, parentComment.id))
          .returning({
            commentCount: commentTable.commentCount,
          });
        await tx
          .update(postTable)
          .set({
            commentCount: sql`${postTable.commentCount} + 1`,
          })
          .where(eq(postTable.id, postId))
          .returning({
            commentCount: postTable.commentCount,
          });

        const [newComment] = await tx
          .insert(commentTable)
          .values({
            parentCommentId: id,
            authorId: userId!,
            postId,
            content,
          })
          .returning();
        return newComment;
      });

      return c.json<SuccessResponse<Comments>>({
        success: true,
        message: 'Comment created',
        data: comment,
      });
    },
  )

  .post('/:id/upvote', loggedIn, zValidator('param', z.object({ id: z.number({ coerce: true }) })), async (c) => {
    const { id } = c.req.valid('param');
    const userId = c.get('user')?.id ?? '';

    const comment = await db.query.commentTable.findFirst({
      where: eq(commentTable.id, id),
    });
    if (!comment) {
      throw new HTTPException(404, {
        message: 'comment not found',
      });
    }
    const data = {
      message: '',
      point: 0,
    };

    await db.transaction(async (tx) => {
      const existUpvote = await tx.query.commentUpvotesTable.findFirst({
        where: and(eq(commentUpvotesTable.commentId, id), eq(commentUpvotesTable.userId, userId)),
      });
      if (existUpvote) {
        await tx
          .update(commentTable)
          .set({
            points: sql`${commentTable.points} - 1`,
          })
          .where(eq(commentTable.id, id));
        await tx.delete(commentUpvotesTable).where(and(eq(commentUpvotesTable.commentId, id), eq(commentUpvotesTable.userId, userId)));
        data.message = 'You delete upvoted  comment';
        data.point = -1;
      } else {
        await tx
          .update(commentTable)
          .set({
            points: sql`${commentTable.points} + 1`,
          })
          .where(eq(commentTable.id, id));
        await tx.insert(commentUpvotesTable).values({
          commentId: id,
          userId,
        });
        data.message = 'You upvoted comment';
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
  })

  .get(
    '/:id/comments',
    zValidator('param', z.object({ id: z.number({ coerce: true }) })),
    zValidator('query', paginationSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const { limit, order, page, sortBy } = c.req.valid('query');

      const user = c.get('user');
      const offset = (page - 1) * limit;
      const sortByColumn = sortBy === 'points' ? commentTable.points : commentTable.createdAt;
      const sortOrder = order === 'desc' ? desc(sortByColumn) : asc(sortByColumn);
      const comment = await db.query.commentTable.findFirst({
        where: eq(commentTable.id, id),
      });
      if (!comment) {
        throw new HTTPException(404, { message: 'comment not found' });
      }

      const comments = await db.query.commentTable.findMany({
        where: and(eq(commentTable.parentCommentId, id)),
        offset,
        orderBy: sortOrder,
        limit,
        with: {
          author: true,
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
      const count = await db.$count(commentTable, eq(commentTable.parentCommentId, id));
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
  );

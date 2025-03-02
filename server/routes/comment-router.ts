import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { createCommentSchema } from '../../shared/types';
import type { Context } from '../context';
import { loggedIn } from '../middleware/loggedIn';

const commentRouter = new Hono<Context>();

commentRouter.post('/', loggedIn, zValidator('param', createCommentSchema), async (c) => {

    
});

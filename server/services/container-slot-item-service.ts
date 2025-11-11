import type { ContainerSlot } from '@/shared/types';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction } from '../db/db';
import { containerSlotTable } from '../db/schema';

export const containerSlotItemService = (db: TTransaction | TDataBase) => ({
  async getContainerSlotItem(id: string, options?: Parameters<typeof db.query.containerSlotTable.findFirst>[0]): Promise<ContainerSlot> {
    const containerSlotItem = await db.query.containerSlotTable.findFirst({ where: eq(containerSlotTable.id, id), ...options });
    if (!containerSlotItem) throw new HTTPException(404, { message: 'containerSlotItem not found' });

    return containerSlotItem;
  },
});

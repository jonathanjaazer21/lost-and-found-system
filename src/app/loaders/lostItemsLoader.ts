import { getLostItems } from '@/services/firestore/lostItemsService';

export async function lostItemsLoader() {
  try {
    const items = await getLostItems();
    return { items };
  } catch (error) {
    return {
      items: [],
      error: error instanceof Error ? error.message : 'Failed to load items',
    };
  }
}

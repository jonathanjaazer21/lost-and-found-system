import { LostItem } from '@/types';
import { LostItemCard } from './LostItemCard';

interface LostItemsListProps {
  items: LostItem[];
  onStatusUpdate: (itemId: string, newStatus: 'unclaimed' | 'claimed') => Promise<void>;
  onEdit: (item: LostItem) => void;
}

export function LostItemsList({ items, onStatusUpdate, onEdit }: LostItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No items found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <LostItemCard key={item.id} item={item} onStatusUpdate={onStatusUpdate} onEdit={onEdit} />
      ))}
    </div>
  );
}

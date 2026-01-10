import { LostItem } from '@/types';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { useAuth } from '@/context/AuthContext';

interface LostItemCardProps {
  item: LostItem;
  onStatusUpdate: (itemId: string, newStatus: 'unclaimed' | 'claimed') => Promise<void>;
  onEdit: (item: LostItem) => void;
}

export function LostItemCard({ item, onStatusUpdate, onEdit }: LostItemCardProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleStatusToggle = async () => {
    const newStatus = item.status === 'unclaimed' ? 'claimed' : 'unclaimed';
    await onStatusUpdate(item.id, newStatus);
  };

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{item.description}</h3>
          <div
            className={`badge ${
              item.status === 'unclaimed' ? 'badge-warning' : 'badge-success'
            }`}
          >
            {item.status}
          </div>
        </div>

        {item.mobile_number && (
          <p className="text-sm">
            <span className="font-semibold">Contact:</span> {item.mobile_number}
          </p>
        )}

        {item.upload_url && (
          <div>
            <img
              src={item.upload_url}
              alt="Lost item"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <p className="text-xs text-gray-500">
          Reported: {item.created_at.toDate().toLocaleDateString()}
        </p>

        {isAdmin && (
          <div className="card-actions justify-end gap-2">
            <Button variant="ghost" onClick={() => onEdit(item)}>
              Edit
            </Button>
            <Button variant="secondary" onClick={handleStatusToggle}>
              Mark as {item.status === 'unclaimed' ? 'Claimed' : 'Unclaimed'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

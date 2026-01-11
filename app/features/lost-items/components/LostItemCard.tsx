import { LostItem } from '~/types';
import { Card } from '~/ui/Card';
import { Button } from '~/ui/Button';
import { useAuth } from '~/context/AuthContext';
import { formatDate } from '~/utils/date';

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
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </div>
        </div>

        {/* Image preview - always visible with fixed landscape aspect ratio */}
        <div className="w-full aspect-video bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          {item.upload_url ? (
            <img
              src={item.upload_url}
              alt="Lost item"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-sm">No image</div>
          )}
        </div>

        <p className="text-sm">
          <span className="font-semibold">Contact:</span> {item.mobile_number || 'None'}
        </p>

        <p className="text-xs text-gray-500">
          Reported: {formatDate(item.created_at)}
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

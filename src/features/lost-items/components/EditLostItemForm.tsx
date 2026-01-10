import { FormEvent, useState } from 'react';
import { Input } from '@/ui/Input';
import { Textarea } from '@/ui/Textarea';
import { Button } from '@/ui/Button';
import { LostItem } from '@/types';

interface EditLostItemFormProps {
  item: LostItem;
  onSubmit: (data: {
    description: string;
    mobile_number?: string;
    upload_url?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export function EditLostItemForm({ item, onSubmit, onCancel }: EditLostItemFormProps) {
  const [description, setDescription] = useState(item.description);
  const [mobileNumber, setMobileNumber] = useState(item.mobile_number || '');
  const [uploadUrl, setUploadUrl] = useState(item.upload_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        description: description.trim(),
        mobile_number: mobileNumber.trim() || undefined,
        upload_url: uploadUrl.trim() || undefined,
      });

      // No need to reset fields - modal will close
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lost item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Lost Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <Textarea
          label="Description *"
          placeholder="Describe the lost item..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
        />

        <Input
          label="Mobile Number (Optional)"
          type="tel"
          placeholder="Enter contact number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />

        <Input
          label="Photo URL (Optional)"
          type="url"
          placeholder="Enter image URL"
          value={uploadUrl}
          onChange={(e) => setUploadUrl(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </div>
  );
}

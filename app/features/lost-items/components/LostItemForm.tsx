import { FormEvent, useState } from 'react';
import { Input } from '~/ui/Input';
import { Button } from '~/ui/Button';
import { Card } from '~/ui/Card';

interface LostItemFormProps {
  onSubmit: (data: {
    description: string;
    mobile_number?: string;
    upload_url?: string;
  }) => Promise<void>;
}

export function LostItemForm({ onSubmit }: LostItemFormProps) {
  const [description, setDescription] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
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

      setDescription('');
      setMobileNumber('');
      setUploadUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lost item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="card-title">Report Lost Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Description *"
          type="text"
          placeholder="Describe the lost item..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
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

        <div className="card-actions justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

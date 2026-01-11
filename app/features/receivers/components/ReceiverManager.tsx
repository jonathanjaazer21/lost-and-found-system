import { useState } from 'react';
import { Card } from '~/ui/Card';
import { Button } from '~/ui/Button';

interface ReceiverManagerProps {
  emails: string[];
  onAddEmail: (email: string) => Promise<void>;
  onRemoveEmail: (email: string) => Promise<void>;
}

export function ReceiverManager({ emails, onAddEmail, onRemoveEmail }: ReceiverManagerProps) {
  const [newEmail, setNewEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = async () => {
    setError('');

    if (!newEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (!validateEmail(newEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (emails.includes(newEmail)) {
      setError('This email is already in the list');
      return;
    }

    setIsAdding(true);
    try {
      await onAddEmail(newEmail);
      setNewEmail('');
    } catch (err) {
      setError('Failed to add email. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveEmail = async (email: string) => {
    try {
      await onRemoveEmail(email);
    } catch (err) {
      console.error('Failed to remove email:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Email Receivers</h2>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Add Email Receiver
            </label>
            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                className="input input-bordered flex-1"
                placeholder="example@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddEmail();
                  }
                }}
              />
              <Button onClick={handleAddEmail} disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Add'}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-error">{error}</p>
            )}
          </div>

          <div className="divider">Saved Receivers</div>

          {emails.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              No email receivers added yet
            </p>
          ) : (
            <div className="space-y-2">
              {emails.map((email) => (
                <div
                  key={email}
                  className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                >
                  <span className="text-sm">{email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEmail(email)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

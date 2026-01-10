import { useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { LostItem } from '@/types';
import { LostItemForm } from '@/features/lost-items/components/LostItemForm';
import { EditLostItemForm } from '@/features/lost-items/components/EditLostItemForm';
import { LostItemsList } from '@/features/lost-items/components/LostItemsList';
import { StatusFilter } from '@/features/lost-items/components/StatusFilter';
import { createLostItem, updateLostItemStatus, updateLostItem } from '@/services/firestore/lostItemsService';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Button } from '@/ui/Button';

export function Dashboard() {
  const { items, error } = useLoaderData() as { items: LostItem[]; error?: string };
  const revalidator = useRevalidator();
  const [statusFilter, setStatusFilter] = useState<'all' | 'unclaimed' | 'claimed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<LostItem | null>(null);

  const handleCreateItem = async (data: {
    description: string;
    mobile_number?: string;
    upload_url?: string;
  }) => {
    await createLostItem(data.description, data.mobile_number, data.upload_url);
    revalidator.revalidate();
    setIsModalOpen(false);
  };

  const handleStatusUpdate = async (itemId: string, newStatus: 'unclaimed' | 'claimed') => {
    await updateLostItemStatus(itemId, newStatus);
    revalidator.revalidate();
  };

  const handleEditItem = async (data: {
    description: string;
    mobile_number?: string;
    upload_url?: string;
  }) => {
    if (!itemToEdit) return;

    await updateLostItem(itemToEdit.id, data);
    revalidator.revalidate();
    setIsEditModalOpen(false);
    setItemToEdit(null);
  };

  const openEditModal = (item: LostItem) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setItemToEdit(null);
  };

  const filteredItems =
    statusFilter === 'all'
      ? items
      : items.filter((item) => item.status === statusFilter);

  return (
    <div className="space-y-8">
      <div className="flex justify-start">
        <Button onClick={() => setIsModalOpen(true)}>
          Report Lost Item
        </Button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Lost Items</h2>
          <StatusFilter currentFilter={statusFilter} onFilterChange={setStatusFilter} />
        </div>

        {error && <ErrorMessage message={error} />}

        <LostItemsList items={filteredItems} onStatusUpdate={handleStatusUpdate} onEdit={openEditModal} />
      </div>

      {/* Create Modal */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsModalOpen(false)}
          >
            ✕
          </button>
          <LostItemForm onSubmit={handleCreateItem} />
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <button>close</button>
        </form>
      </dialog>

      {/* Edit Modal */}
      <dialog className={`modal ${isEditModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeEditModal}
          >
            ✕
          </button>
          {itemToEdit && (
            <EditLostItemForm
              item={itemToEdit}
              onSubmit={handleEditItem}
              onCancel={closeEditModal}
            />
          )}
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeEditModal}>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

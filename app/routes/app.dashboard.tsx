import { useState, useEffect } from "react";
import { useFetcher } from "react-router";

import { getLostItems, createLostItem, updateLostItemStatus, updateLostItem } from "~/services/firestore/lostItemsService";
import { getAllReceivers, addReceiverEmail, removeReceiverEmail } from "~/services/firestore/receiversService";
import type { LostItem } from "~/types";
import { LostItemForm } from "~/features/lost-items/components/LostItemForm";
import { EditLostItemForm } from "~/features/lost-items/components/EditLostItemForm";
import { LostItemsList } from "~/features/lost-items/components/LostItemsList";
import { StatusFilter } from "~/features/lost-items/components/StatusFilter";
import { ReceiverManager } from "~/features/receivers/components/ReceiverManager";
import { ErrorMessage } from "~/components/ErrorMessage";
import { Button } from "~/ui/Button";
import { Loading } from "~/components/Loading";

export default function Dashboard() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "unclaimed" | "claimed">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<LostItem | null>(null);

  // Fetch data client-side
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsData, emailsData] = await Promise.all([
          getLostItems(),
          getAllReceivers(),
        ]);
        setItems(itemsData);
        setEmails(emailsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    try {
      const [itemsData, emailsData] = await Promise.all([
        getLostItems(),
        getAllReceivers(),
      ]);
      setItems(itemsData);
      setEmails(emailsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh data");
    }
  };

  const handleCreateItem = async (data: {
    description: string;
    mobile_number?: string;
    upload_url?: string;
  }) => {
    await createLostItem(data.description, data.mobile_number, data.upload_url);

    // Send email notification server-side
    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/notify-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: data.description,
            mobile_number: data.mobile_number,
            upload_url: data.upload_url,
            status: 'unclaimed',
            recipients: emails,
          }),
        });
      } catch (err) {
        console.error('Failed to send email notification:', err);
      }
    }

    await refreshData();
    setIsModalOpen(false);
  };

  const handleStatusUpdate = async (itemId: string, newStatus: "unclaimed" | "claimed") => {
    await updateLostItemStatus(itemId, newStatus);
    await refreshData();
  };

  const handleEditItem = async (data: {
    description: string;
    mobile_number?: string;
    upload_url?: string;
  }) => {
    if (!itemToEdit) return;

    await updateLostItem(itemToEdit.id, data);

    // Send email notification server-side
    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/notify-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: data.description,
            mobile_number: data.mobile_number,
            upload_url: data.upload_url,
            status: itemToEdit.status,
            recipients: emails,
          }),
        });
      } catch (err) {
        console.error('Failed to send email notification:', err);
      }
    }

    await refreshData();
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

  const handleAddEmail = async (email: string) => {
    await addReceiverEmail(email);
    await refreshData();
  };

  const handleRemoveEmail = async (email: string) => {
    await removeReceiverEmail(email);
    await refreshData();
  };

  const filteredItems =
    statusFilter === "all"
      ? items
      : items.filter((item) => item.status === statusFilter);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-start">
        <Button onClick={() => setIsModalOpen(true)}>Report Lost Item</Button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Lost Items</h2>
          <StatusFilter currentFilter={statusFilter} onFilterChange={setStatusFilter} />
        </div>

        {error && <ErrorMessage message={error} />}

        <LostItemsList items={filteredItems} onStatusUpdate={handleStatusUpdate} onEdit={openEditModal} />
      </div>

      <ReceiverManager
        emails={emails}
        onAddEmail={handleAddEmail}
        onRemoveEmail={handleRemoveEmail}
      />

      {/* Create Modal */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
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
      <dialog className={`modal ${isEditModalOpen ? "modal-open" : ""}`}>
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

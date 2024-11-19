import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  name,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete {name}?</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";

type DeleteConfirmModalProps = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function DeleteConfirmModal({
  show,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  if (!show) return null;

  const handleConfirm = async () => {
    if (deleteConfirmText !== "DELETE") return;

    setDeleting(true);
    try {
      await onConfirm();
      setDeleteConfirmText("");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (deleting) return;
    setDeleteConfirmText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Profile
            </h3>
            <p className="text-sm text-gray-600">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Deleting your profile will permanently remove all your data
            including:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-2">
            <li>Your profile information</li>
            <li>Your genre preferences</li>
            <li>Your social links</li>
            <li>Your subscription data</li>
          </ul>
          <p className="text-sm text-gray-700 font-medium">
            To confirm, type{" "}
            <span className="font-bold text-red-600">DELETE</span> below:
          </p>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={deleting}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={deleting}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleteConfirmText !== "DELETE" || deleting}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

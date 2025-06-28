import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComplaint } from '../apicalls/citizenapi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import LoadingPage from './LoadingPage';

const ComplaintDelete = ({ complaint, setDelete }) => {
  const user = useSelector((state) => state.user?.user);
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteComplaint(id),
    onSuccess: (_, id) => {
      toast.success("🎉 Complaint deleted successfully!");
      queryClient.setQueryData(['complaints', user?.user_id], old =>
        old ? old.filter(c => c.complaint_id !== id) : []
      );
      setDelete(false);
    },
    onError: (error) => {
      console.error('Delete complaint error:', error);
      toast.error(error.message || 'Delete failed');
    },
  });

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmAndDelete = () => {
    deleteMutation.mutate(complaint.complaint_id);
  };

  const handleClose = () => {
    setDelete(false);
  };

  if (deleteMutation.isPending) {
    return <LoadingPage status="delete" message="Deleting complaint, please wait..." />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative mx-4">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
          aria-label="Close"
        >
          &times;
        </button>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">{complaint.title}</h3>
        <p className="text-gray-700 mb-4">{complaint.description}</p>
        <p className="text-sm text-gray-500 mb-6">Status: <span className="capitalize">{complaint.status}</span></p>

        <div className="flex justify-end gap-3">
          {!confirmDelete ? (
            <>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 text-sm font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Delete
              </button>
            </>
          ) : (
            <div className="flex flex-col items-end gap-3 w-full">
              <p className="text-red-600 text-sm font-medium w-full text-center">
                Are you sure you want to delete this complaint?
              </p>
              <div className="flex gap-3 w-full justify-end">
                <button
                  onClick={() => {
  setConfirmDelete(false);
  handleClose();
}}

                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  No, Keep It
                </button>
                <button
                  onClick={confirmAndDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDelete;
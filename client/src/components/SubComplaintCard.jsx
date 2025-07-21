import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Correctly import your actual API functions from your API file
import { updateComplaintStatus, uploadCaseFile } from '../apicalls/policeapi';
import ViewFullComplaint from './ViewFullComplaint';


// --- Helper Modals ---

const StatusUpdateModal = ({ complaint, onClose, queryClient, parentQueryKey }) => {
    const [status, setStatus] = useState(complaint.status);
    const [remark, setRemark] = useState(complaint.remark || '');

    // Single, correctly configured mutation for updating status
    const mutation = useMutation({
        mutationFn: updateComplaintStatus,
        onSuccess: () => {
            toast.success("Complaint status updated successfully!");
            // Invalidate the parent page's query to refetch the list
            queryClient.invalidateQueries({ queryKey: parentQueryKey });
            onClose();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update status.");
        }
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ complaintId: complaint.complaint_id, status, remark });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Update Case Status</h3>
                        <p className="text-sm text-gray-500 mb-6">Complaint ID: #{complaint.complaint_id}</p>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                    <option value="pending" disabled>Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">Remarks (Required)</label>
                                <textarea id="remark" rows="4" value={remark} onChange={(e) => setRemark(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Provide a reason for the status change..." required />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onClose} disabled={mutation.isPending} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={mutation.isPending} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">{mutation.isPending ? 'Updating...' : 'Update Remark/Status'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CaseFileModal = ({ complaint, onClose, queryClient, parentQueryKey }) => {
    const [url, setUrl] = useState(complaint.case_file_url || '');

    // Single, correctly configured mutation for updating the case file URL
    const mutation = useMutation({
        mutationFn: uploadCaseFile,
        onSuccess: () => {
            toast.success("Case file URL updated successfully!");
            queryClient.invalidateQueries({ queryKey: parentQueryKey });
            onClose();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update URL.");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ complaintId: complaint.complaint_id, case_file_url: url });
console.log('Sending to backend:', { complaintId: complaint.complaint_id, url });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Update Case File URL</h3>
                        <p className="text-sm text-gray-500 mb-6">Link to Google Drive, Dropbox, etc.</p>
                        <div>
                            <label htmlFor="case-file-url" className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                            <input
  type="text"
  id="case-file-url"
  value={url}
  onChange={(e) => setUrl(e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
  placeholder="Enter case file link or notes..."
  required
/>

                             </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onClose} disabled={mutation.isPending} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={mutation.isPending} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">{mutation.isPending ? 'Saving...' : 'Save URL'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main Card Component ---

const SubComplaintCard = ({ complaint }) => {
    const [viewFull, setViewFull] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showCaseFileModal, setShowCaseFileModal] = useState(false);
    
    const queryClient = useQueryClient();
    const user = useSelector(state => state.user.user);
    const parentQueryKey = ['stationComplaints', user?.user_id];

    const normalizedStatus = (complaint.status || '')
        .replace('-', ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

    const statusConfig = {
        'Pending': { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200', icon: '⏳', badge: 'bg-yellow-100 text-yellow-800' },
        'In Progress': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', icon: '🛠️', badge: 'bg-blue-100 text-blue-800' },
        'Resolved': { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200', icon: '✅', badge: 'bg-green-100 text-green-800' },
        'Rejected': { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', icon: '❌', badge: 'bg-red-100 text-red-800' }
    };

    const status = statusConfig[normalizedStatus] || {
        bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200', icon: 'ℹ️', badge: 'bg-gray-100 text-gray-800'
    };

    return (
        <div className={`border rounded-lg overflow-hidden mb-6 ${status.border} ${status.bg} transition-all hover:shadow-lg`}>
            {viewFull && <ViewFullComplaint complaint={complaint} setViewFull={setViewFull} />}
            {showStatusModal && <StatusUpdateModal complaint={complaint} onClose={() => setShowStatusModal(false)} queryClient={queryClient} parentQueryKey={parentQueryKey} />}
            {showCaseFileModal && <CaseFileModal complaint={complaint} onClose={() => setShowCaseFileModal(false)} queryClient={queryClient} parentQueryKey={parentQueryKey} />}

            <div className="p-5">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2">
                            <h3 className="text-lg font-bold text-gray-800">{complaint.title}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.badge}`}>{complaint.crime_type}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{complaint.description}</p>
                    </div>
                    <div className="flex flex-col items-start text-left sm:text-right sm:items-end gap-1 min-w-[150px]">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${status.badge}`}>
                            <span>{status.icon}</span>
                            {normalizedStatus}
                        </span>
                        <div className="text-xs text-gray-500 mt-1 space-y-1">
                            <p><strong>Filed:</strong> {new Date(complaint.crime_datetime).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {complaint.assigned_by_name && complaint.assignment_date && (
                    <div className="mt-4 bg-gray-100 border border-gray-200 rounded-md p-3 text-sm">
                        <p className="text-gray-800">Assigned by <span className="font-semibold text-gray-900">{complaint.assigned_by_name}</span> on <span className="font-semibold text-gray-900">{new Date(complaint.assignment_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>.</p>
                    </div>
                )}

                {(complaint.status === 'in-progress' || complaint.status === 'resolved' || complaint.status === 'rejected') && complaint.remark && (
                    <div className="mt-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-r p-3">
                        <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 mt-0.5"><svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg></div>
                            <div>
                                <h4 className="text-sm font-medium text-indigo-800">Latest Update / Remarks</h4>
                                <p className="text-sm text-indigo-700 mt-1">{complaint.remark}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-5 pt-4 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3">
                    <span className="text-sm text-gray-500 font-medium">Complaint ID: #{complaint.complaint_id}</span>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setViewFull(true)} className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-sm font-medium rounded-md shadow-sm transition-colors">View Details</button>
                        <button onClick={() => setShowCaseFileModal(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors">{complaint.case_file_url ? 'Update' : 'Upload'} Case File</button>
                        <button onClick={() => setShowStatusModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors">Status/Remark</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubComplaintCard;

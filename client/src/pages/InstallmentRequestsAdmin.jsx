import React, { useState, useEffect } from 'react';
import api from '../api';
import { CheckCircle, XCircle, Calendar, User, Package, CreditCard } from 'lucide-react';

const InstallmentRequestsAdmin = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/installments/requests/all');
            setRequests(res.data);
        } catch (err) {
            console.error('Error fetching requests:', err);
            setError('Failed to load installment requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = (request) => {
        setSelectedRequest(request);
        setShowApprovalModal(true);
    };

    const handleReject = async (requestId) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;

        try {
            await api.post(`/installments/reject/${requestId}`, {
                admin_notes: reason
            });
            alert('Request rejected successfully');
            fetchRequests();
        } catch (err) {
            console.error('Error rejecting request:', err);
            alert('Failed to reject request');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pending' },
            approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                {badge.label}
            </span>
        );
    };

    if (loading) return <div className="text-center py-20">Loading requests...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <CreditCard className="text-blue-600" /> Installment Requests
            </h1>

            {requests.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                    <p className="text-gray-500">No installment requests found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div key={request.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex flex-col lg:flex-row justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-xl font-bold text-gray-800">Request #{request.id}</h3>
                                        {getStatusBadge(request.status)}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-gray-400" />
                                            <span className="text-gray-600">User:</span>
                                            <span className="font-semibold">{request.user_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Package size={16} className="text-gray-400" />
                                            <span className="text-gray-600">Order:</span>
                                            <span className="font-semibold">#{request.order_number}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CreditCard size={16} className="text-gray-400" />
                                            <span className="text-gray-600">Amount:</span>
                                            <span className="font-bold text-blue-600">
                                                ₹{parseFloat(request.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span className="text-gray-600">Requested:</span>
                                            <span className="font-semibold">
                                                {new Date(request.created_at).toLocaleDateString('en-IN')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="text-sm text-gray-600 mb-1">Requested Installments:</div>
                                        <div className="font-bold text-lg">{request.requested_installments} installments</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            ~₹{(parseFloat(request.total_amount) / request.requested_installments).toLocaleString('en-IN', { minimumFractionDigits: 2 })} per installment
                                        </div>
                                    </div>

                                    {request.reason && (
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                            <div className="text-sm text-gray-600 mb-1">Reason:</div>
                                            <div className="text-gray-800">{request.reason}</div>
                                        </div>
                                    )}

                                    {request.admin_notes && (
                                        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                            <div className="text-sm text-gray-600 mb-1">Admin Notes:</div>
                                            <div className="text-gray-800">{request.admin_notes}</div>
                                        </div>
                                    )}
                                </div>

                                {request.status === 'pending' && (
                                    <div className="flex lg:flex-col gap-3">
                                        <button
                                            onClick={() => handleApprove(request)}
                                            className="flex-1 lg:flex-none px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 font-semibold"
                                        >
                                            <CheckCircle size={18} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(request.id)}
                                            className="flex-1 lg:flex-none px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 font-semibold"
                                        >
                                            <XCircle size={18} />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showApprovalModal && selectedRequest && (
                <ApprovalModal
                    request={selectedRequest}
                    onClose={() => {
                        setShowApprovalModal(false);
                        setSelectedRequest(null);
                    }}
                    onSuccess={() => {
                        fetchRequests();
                        setShowApprovalModal(false);
                        setSelectedRequest(null);
                    }}
                />
            )}
        </div>
    );
};

const ApprovalModal = ({ request, onClose, onSuccess }) => {
    const [installments, setInstallments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [approvedAmount, setApprovedAmount] = useState(request.total_amount);

    useEffect(() => {
        // Initialize with equal installments based on APPROVED amount
        recalculateInstallments(request.total_amount);
    }, [request]);

    const recalculateInstallments = (total) => {
        const amount = parseFloat(total);
        const count = request.requested_installments;
        const perInstallment = amount / count;

        const today = new Date();
        const initialInstallments = Array.from({ length: count }, (_, i) => {
            const dueDate = new Date(today);
            dueDate.setMonth(dueDate.getMonth() + i + 1);
            return {
                amount: perInstallment.toFixed(2),
                due_date: dueDate.toISOString().split('T')[0]
            };
        });

        setInstallments(initialInstallments);
    };

    const handleAmountChange = (e) => {
        const newAmount = e.target.value;
        setApprovedAmount(newAmount);
        recalculateInstallments(newAmount);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post(`/installments/approve/${request.id}`, {
                installments: installments,
                approvedTotal: approvedAmount
            });
            setShowSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (err) {
            console.error('Error approving request:', err);
            alert(err.response?.data?.message || 'Failed to approve request');
            setLoading(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Approved!</h3>
                    <p className="text-gray-600 mb-6">Installment plan has been created successfully.</p>
                </div>
            </div>
        );
    }

    const updateInstallment = (index, field, value) => {
        const updated = [...installments];
        updated[index][field] = value;
        setInstallments(updated);
    };

    const totalConfigured = installments.reduce((sum, inst) => sum + parseFloat(inst.amount || 0), 0);
    const targetTotal = parseFloat(approvedAmount);
    const isValid = Math.abs(totalConfigured - targetTotal) < 0.1;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white rounded-t-2xl">
                    <h2 className="text-2xl font-bold">Approve Installment Request</h2>
                    <p className="text-sm mt-1">Configure installment plan for Order #{request.order_number}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600 block mb-1">Original Request:</span>
                                <div className="font-medium text-gray-500">
                                    ₹{parseFloat(request.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                            <div>
                                <label className="text-blue-600 font-bold block mb-1">Approved Total (Edit):</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={approvedAmount}
                                    onChange={handleAmountChange}
                                    className="w-full px-3 py-1 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none font-bold text-lg"
                                />
                            </div>
                            <div>
                                <span className="text-gray-600 block mb-1">Configured Total:</span>
                                <div className={`font-bold text-lg ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                                    ₹{totalConfigured.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800">Configure Installments</h3>
                        {installments.map((inst, index) => (
                            <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                                <div className="font-bold text-blue-600 w-8">#{index + 1}</div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-600">Amount (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={inst.amount}
                                        onChange={(e) => updateInstallment(index, 'amount', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-600">Due Date</label>
                                    <input
                                        type="date"
                                        value={inst.due_date}
                                        onChange={(e) => updateInstallment(index, 'due_date', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {!isValid && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            ⚠️ Total installment amount must equal order amount
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !isValid}
                            className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white ${loading || !isValid
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-lg'
                                }`}
                        >
                            {loading ? 'Approving...' : 'Approve Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InstallmentRequestsAdmin;

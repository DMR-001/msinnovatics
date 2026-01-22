import React, { useState } from 'react';
import api from '../api';
import { X, CreditCard } from 'lucide-react';

const RequestInstallmentModal = ({ isOpen, onClose, order, onSuccess }) => {
    const [requestedInstallments, setRequestedInstallments] = useState(2);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !order) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post('/installments/request', {
                order_id: order.id,
                requested_installments: requestedInstallments,
                reason: reason
            });

            alert('Installment request submitted successfully! Please wait for admin approval.');
            onSuccess();
            onClose();
            setReason('');
            setRequestedInstallments(2);
        } catch (err) {
            console.error('Error requesting installment:', err);
            setError(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    const estimatedInstallmentAmount = order.total_amount / requestedInstallments;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <CreditCard size={28} />
                            <h2 className="text-2xl font-bold">Request Installment</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Order Details */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-gray-700 mb-2">Order Details</h3>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-semibold">#{order.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-bold text-lg text-blue-600">
                                    ₹{parseFloat(order.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Number of Installments - Fixed to 2 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Number of Installments
                        </label>
                        <select
                            value={requestedInstallments}
                            onChange={(e) => setRequestedInstallments(parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value={2}>2 Installments (50% each)</option>
                        </select>
                    </div>

                    {/* Estimated Amount */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <div className="text-sm text-gray-600 mb-1">Estimated per installment:</div>
                        <div className="text-2xl font-bold text-blue-600">
                            ₹{estimatedInstallmentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            *Final amounts will be set by admin
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Reason for Request (Optional)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Need flexible payment option..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
                                }`}
                        >
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestInstallmentModal;

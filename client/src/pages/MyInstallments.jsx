import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { CreditCard, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const MyInstallments = () => {
    const [installments, setInstallments] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [payingInstallmentId, setPayingInstallmentId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const fetchData = async () => {
        try {
            const [installmentsRes, requestsRes] = await Promise.all([
                api.get('/installments/my-installments'),
                api.get('/installments/my-requests')
            ]);
            setInstallments(installmentsRes.data);
            setRequests(requestsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load installment data');
        } finally {
            setLoading(false);
        }
    };

    const handlePayInstallment = async (installment) => {
        setPayingInstallmentId(installment.id);

        try {
            // Initiate payment
            const res = await api.post(`/payment/installment/initiate/${installment.id}`);
            const { installmentId, razorpayOrderId, amount, currency, keyId } = res.data;

            if (!window.Razorpay) {
                alert('Payment system is loading. Please try again in a moment.');
                setPayingInstallmentId(null);
                return;
            }

            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: 'MS Innovatics',
                description: `Installment #${installment.installment_number} Payment`,
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/payment/installment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            installment_id: installmentId
                        });

                        if (verifyRes.data.success) {
                            alert('Payment successful!');
                            fetchData(); // Refresh list

                            if (verifyRes.data.allPaid) {
                                alert('All installments paid! Your order is now complete.');
                            }
                        } else {
                            alert('Payment verification failed');
                        }
                    } catch (err) {
                        console.error('Verification error:', err);
                        alert('Payment verification failed');
                    } finally {
                        setPayingInstallmentId(null);
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: ''
                },
                theme: {
                    color: '#3B82F6'
                },
                modal: {
                    ondismiss: function () {
                        setPayingInstallmentId(null);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

            razorpay.on('payment.failed', function (response) {
                setPayingInstallmentId(null);
                alert('Payment failed: ' + (response.error.description || 'Please try again'));
            });

        } catch (err) {
            console.error('Payment initiation error:', err);
            alert('Failed to initiate payment. Please try again.');
            setPayingInstallmentId(null);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Clock, label: 'Pending' },
            paid: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Paid' },
            overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle, label: 'Overdue' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle, label: 'Rejected' },
            approved: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle, label: 'Approved' }
        };

        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1`}>
                <Icon size={14} />
                {badge.label}
            </span>
        );
    };

    if (loading) return <div className="text-center py-20">Loading installments...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

    // Group installments by order
    const groupedInstallments = installments.reduce((acc, inst) => {
        const orderId = inst.order_id;
        if (!acc[orderId]) {
            acc[orderId] = [];
        }
        acc[orderId].push(inst);
        return acc;
    }, {});

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <CreditCard className="text-blue-600" /> My Installments
            </h1>

            {/* Pending Requests Section */}
            {requests.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Installment Requests</h2>
                    <div className="space-y-4">
                        {requests.map(request => (
                            <div key={request.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg text-gray-800">Order #{request.order_number}</h3>
                                            {getStatusBadge(request.status)}
                                        </div>
                                        <p className="text-gray-600">
                                            Requesting to pay <span className="font-bold text-gray-900">₹{parseFloat(request.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span> in {request.requested_installments} installments
                                        </p>
                                        <p className="text-sm text-gray-400 mt-2">
                                            Requested on {new Date(request.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        {request.admin_notes && (
                                            <div className="mt-3 bg-red-50 p-3 rounded-lg border border-red-100 text-sm text-red-700">
                                                <span className="font-semibold">Admin Note:</span> {request.admin_notes}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        {request.status === 'pending' && (
                                            <div className="text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                                                Waiting for admin approval. Check back later.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {installments.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
                    <p className="text-gray-500 text-lg mb-4">You don't have any active installments.</p>
                    <p className="text-gray-400 text-sm">Approved installment plans will appear here.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Active Installment Plans</h2>
                    {Object.entries(groupedInstallments).map(([orderId, orderInstallments]) => {
                        const totalInstallments = orderInstallments.length;
                        const paidInstallments = orderInstallments.filter(i => i.status === 'paid').length;
                        const totalAmount = orderInstallments.reduce((sum, i) => sum + parseFloat(i.amount), 0);

                        return (
                            <div key={orderId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">Order #{orderId}</h2>
                                            <p className="text-gray-600 mt-1">
                                                Total Plan: ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {paidInstallments}/{totalInstallments}
                                            </div>
                                            <div className="text-sm text-gray-500">Installments Paid</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {orderInstallments
                                            .sort((a, b) => a.installment_number - b.installment_number)
                                            .map((installment) => (
                                                <div key={installment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-white p-3 rounded-lg shadow-sm">
                                                            <span className="text-xl font-bold text-blue-600">
                                                                #{installment.installment_number}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-lg text-gray-900">
                                                                ₹{parseFloat(installment.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                            </div>
                                                            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                                <Calendar size={14} />
                                                                Due: {new Date(installment.due_date).toLocaleDateString('en-IN', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </div>
                                                            {installment.paid_at && (
                                                                <div className="text-xs text-green-600 mt-1">
                                                                    Paid on {new Date(installment.paid_at).toLocaleDateString('en-IN')}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        {getStatusBadge(installment.status)}

                                                        {installment.status === 'pending' && (
                                                            <button
                                                                onClick={() => handlePayInstallment(installment)}
                                                                disabled={payingInstallmentId === installment.id}
                                                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${payingInstallmentId === installment.id
                                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                                                    }`}
                                                            >
                                                                {payingInstallmentId === installment.id ? 'Processing...' : 'Pay Now'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyInstallments;

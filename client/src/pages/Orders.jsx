import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Package, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryingOrderId, setRetryingOrderId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/myorders');
                setOrders(res.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleRetryPayment = async (order) => {
        setRetryingOrderId(order.id);
        try {
            // Get order items from the order
            const orderItemsRes = await api.get(`/orders/${order.id}/items`);
            const items = orderItemsRes.data;

            // Initiate payment with existing order details
            const res = await api.post('/payment/initiate', {
                items: items.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price_at_purchase
                })),
                total_amount: order.total_amount,
                existing_order_id: order.id // Pass existing order ID to update instead of creating new
            });

            const { orderId, razorpayOrderId, amount, currency, keyId } = res.data;

            // Configure Razorpay Options
            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: 'MS Innovatics',
                description: `Retry Payment - Order #${order.id}`,
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: orderId
                        });

                        if (verifyRes.data.success) {
                            navigate(`/payment/success?order_id=${orderId}&payment_id=${response.razorpay_payment_id}`);
                        } else {
                            navigate(`/payment/failure?order_id=${orderId}`);
                        }
                    } catch (err) {
                        console.error('Verification error:', err);
                        navigate(`/payment/failure?order_id=${orderId}`);
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
                        setRetryingOrderId(null);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

            razorpay.on('payment.failed', function (response) {
                setRetryingOrderId(null);
                alert('Payment failed: ' + (response.error.description || 'Please try again'));
            });

        } catch (err) {
            console.error('Retry payment error:', err);
            alert('Failed to initiate payment. Please try again.');
            setRetryingOrderId(null);
        }
    };

    if (loading) return <div className="text-center py-20">Loading orders...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Package className="text-blue-600" /> My Orders
            </h1>

            {orders.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
                    <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 border-b pb-4">
                                <div>
                                    <span className="text-sm text-gray-400 block mb-1">Order #{order.id}</span>
                                    <div className="font-bold text-lg text-gray-800">
                                        {new Date(order.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-4 md:mt-0">
                                    <div className="font-bold text-xl text-blue-600">
                                        ₹{parseFloat(order.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    {order.status === 'completed' && <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Paid via Razorpay</span>}
                                    {order.status === 'pending' && <span className="text-orange-500 flex items-center gap-1"><Clock size={14} /> Payment Pending</span>}
                                    {order.status === 'failed' && <span className="text-red-500 flex items-center gap-1"><XCircle size={14} /> Payment Failed</span>}
                                    {order.status === 'cancelled' && <span className="text-red-500 flex items-center gap-1"><XCircle size={14} /> Cancelled</span>}
                                </div>

                                {(order.status === 'pending' || order.status === 'failed') && (
                                    <button
                                        onClick={() => handleRetryPayment(order)}
                                        disabled={retryingOrderId === order.id}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${retryingOrderId === order.id
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                            }`}
                                    >
                                        <RefreshCw size={16} className={retryingOrderId === order.id ? 'animate-spin' : ''} />
                                        {retryingOrderId === order.id ? 'Processing...' : 'Retry Payment'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    let colorClass = 'bg-gray-100 text-gray-800';
    if (status === 'completed') colorClass = 'bg-green-100 text-green-800';
    if (status === 'pending') colorClass = 'bg-orange-100 text-orange-800';
    if (status === 'failed' || status === 'cancelled') colorClass = 'bg-red-100 text-red-800';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colorClass}`}>
            {status}
        </span>
    );
};

export default Orders;

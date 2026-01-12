import React, { useState, useEffect } from 'react';
import api from '../api';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                            {/* Order Items could be expanded here if the API returned them. 
                                Currently getUserOrders only returns the order wrapper. 
                                If detailed items are needed, the backend query needs to join order_items.
                                For now, we just show the summary.
                            */}

                            <div className="text-sm text-gray-500">
                                {order.status === 'completed' && <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Paid via CCAvenue</span>}
                                {order.status === 'pending' && <span className="text-orange-500 flex items-center gap-1"><Clock size={14} /> Payment Pending</span>}
                                {order.status === 'failed' && <span className="text-red-500 flex items-center gap-1"><XCircle size={14} /> Payment Failed</span>}
                                {order.status === 'cancelled' && <span className="text-red-500 flex items-center gap-1"><XCircle size={14} /> Cancelled</span>}
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

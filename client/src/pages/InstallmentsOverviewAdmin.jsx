import React, { useState, useEffect } from 'react';
import api from '../api';
import { CreditCard, CheckCircle, Clock, AlertCircle, User, Package, Calendar } from 'lucide-react';

const InstallmentsOverviewAdmin = () => {
    const [installments, setInstallments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, paid, overdue

    useEffect(() => {
        fetchInstallments();
    }, []);

    const fetchInstallments = async () => {
        try {
            const res = await api.get('/installments/all');
            setInstallments(res.data);
        } catch (err) {
            console.error('Error fetching installments:', err);
            setError('Failed to load installments');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Clock, label: 'Pending' },
            paid: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Paid' },
            overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle, label: 'Overdue' }
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;
        return (
            <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1`}>
                <Icon size={14} />
                {badge.label}
            </span>
        );
    };

    const filteredInstallments = filter === 'all'
        ? installments
        : installments.filter(inst => inst.status === filter);

    // Group by order
    const groupedInstallments = filteredInstallments.reduce((acc, inst) => {
        const orderId = inst.order_id;
        if (!acc[orderId]) {
            acc[orderId] = {
                order_id: orderId,
                order_number: inst.order_number,
                user_name: inst.user_name,
                user_email: inst.user_email,
                order_total: inst.order_total,
                installments: []
            };
        }
        acc[orderId].installments.push(inst);
        return acc;
    }, {});

    const stats = {
        total: installments.length,
        pending: installments.filter(i => i.status === 'pending').length,
        paid: installments.filter(i => i.status === 'paid').length,
        overdue: installments.filter(i => i.status === 'overdue').length,
        totalAmount: installments.reduce((sum, i) => sum + parseFloat(i.amount), 0),
        paidAmount: installments.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseFloat(i.amount), 0)
    };

    if (loading) return <div className="text-center py-20">Loading installments...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <CreditCard className="text-blue-600" /> Installments Overview
            </h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Installments</div>
                    <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Pending</div>
                    <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Paid</div>
                    <div className="text-3xl font-bold text-green-600">{stats.paid}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Collected</div>
                    <div className="text-2xl font-bold text-green-600">
                        ₹{stats.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    All ({stats.total})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Pending ({stats.pending})
                </button>
                <button
                    onClick={() => setFilter('paid')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Paid ({stats.paid})
                </button>
            </div>

            {/* Installments List */}
            {Object.keys(groupedInstallments).length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                    <p className="text-gray-500">No installments found.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.values(groupedInstallments).map((group) => {
                        const paidCount = group.installments.filter(i => i.status === 'paid').length;
                        const totalCount = group.installments.length;

                        return (
                            <div key={group.order_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">Order #{group.order_number}</h2>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <User size={14} />
                                                    {group.user_name}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Package size={14} />
                                                    ₹{parseFloat(group.order_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {paidCount}/{totalCount}
                                            </div>
                                            <div className="text-sm text-gray-500">Paid</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-3">
                                        {group.installments
                                            .sort((a, b) => a.installment_number - b.installment_number)
                                            .map((installment) => (
                                                <div key={installment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-white p-3 rounded-lg shadow-sm">
                                                            <span className="text-lg font-bold text-blue-600">
                                                                #{installment.installment_number}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-lg text-gray-900">
                                                                ₹{parseFloat(installment.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                            </div>
                                                            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                                <Calendar size={14} />
                                                                Due: {new Date(installment.due_date).toLocaleDateString('en-IN')}
                                                            </div>
                                                            {installment.paid_at && (
                                                                <div className="text-xs text-green-600 mt-1">
                                                                    Paid: {new Date(installment.paid_at).toLocaleDateString('en-IN')}
                                                                </div>
                                                            )}
                                                            {installment.payment_id && (
                                                                <div className="text-xs text-gray-400 mt-1">
                                                                    Payment ID: {installment.payment_id}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {getStatusBadge(installment.status)}
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

export default InstallmentsOverviewAdmin;

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (cart.length === 0) {
        // Don't redirect immediately to avoid flash if checking cart
        // navigate('/cart');
        return <div className="p-8 text-center">Redirecting to cart...</div>;
    }

    const handlePayment = async () => {
        setLoading(true);
        setError('');
        try {
            if (!user) {
                navigate('/login');
                return;
            }

            // 1. Initiate Payment Request to Backend
            const res = await api.post('/payment/initiate', {
                items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
                total_amount: total,
                userId: user.id,
                billing_name: user.name,
                billing_email: user.email,
                // billing_tel: user.phone || '' // Add if phone exists in user model
            });

            const { encRequest, accessCode, url } = res.data;

            // 2. Create Hidden Form and Submit to CCAvenue
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = url;

            const encRequestInput = document.createElement('input');
            encRequestInput.type = 'hidden';
            encRequestInput.name = 'encRequest';
            encRequestInput.value = encRequest;
            form.appendChild(encRequestInput);

            const accessCodeInput = document.createElement('input');
            accessCodeInput.type = 'hidden';
            accessCodeInput.name = 'access_code';
            accessCodeInput.value = accessCode;
            form.appendChild(accessCodeInput);

            document.body.appendChild(form);

            // Clear cart locally as order is created (pending) on server. 
            // User can re-add if they cancel, or we can clear ONLY on success return.
            // Usually better to keep cart until success, but simple approach: clear here or on success page.
            // Let's NOT clear cart here in case they cancel.

            form.submit();

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to initiate payment.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Checkout</h1>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-700">Review Your Order</h2>
                <div className="space-y-4 mb-8">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                            <div>
                                <div className="font-bold text-gray-900">{item.title}</div>
                                <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                            </div>
                            <div className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center text-2xl font-bold border-t pt-6 mb-8 text-gray-900">
                    <span>Total</span>
                    <span className="text-blue-600">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>}

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 hover:shadow-blue-500/30'}`}
                >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">Safe and Secure Payment via CCAvenue</p>
            </div>
        </div>
    );
};

export default Checkout;

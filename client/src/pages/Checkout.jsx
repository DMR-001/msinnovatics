import React, { useState, useEffect } from 'react';
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

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    if (cart.length === 0) {
        return <div className="p-8 text-center">Your cart is empty. Redirecting...</div>;
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
                userId: user.id
            });

            const { orderId, razorpayOrderId, amount, currency, keyId } = res.data;

            // 2. Configure Razorpay Options
            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: 'MS Innovatics',
                description: 'E-commerce Purchase',
                order_id: razorpayOrderId,
                handler: async function (response) {
                    // Payment successful, verify on backend
                    try {
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: orderId
                        });

                        if (verifyRes.data.success) {
                            // Clear cart and redirect to success page
                            clearCart();
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
                    name: user.name || '',
                    email: user.email || '',
                    contact: user.phone || ''
                },
                theme: {
                    color: '#3B82F6' // Blue color matching your theme
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        setError('Payment cancelled. Your order is still pending.');
                    }
                }
            };

            // 3. Open Razorpay Checkout Modal
            const razorpay = new window.Razorpay(options);
            razorpay.open();

            razorpay.on('payment.failed', function (response) {
                setLoading(false);
                setError(response.error.description || 'Payment failed. Please try again.');
            });

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
                <p className="text-center text-xs text-gray-400 mt-4">Safe and Secure Payment via Razorpay</p>
            </div>
        </div>
    );
};

export default Checkout;

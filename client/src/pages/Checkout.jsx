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
    const [paymentMode, setPaymentMode] = useState('full'); // 'full' or 'installment'
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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
                userId: user.id,
                payment_mode: paymentMode,
                installment_reason: 'Checkout request'
            });

            // Handle Installment Request Success
            if (res.data.isInstallmentRequest) {
                setSuccessMessage(res.data.message);
                setShowSuccessModal(true);
                setLoading(false);
                return;
            }

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

                {/* Payment Mode Selection */}
                <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-3">Select Payment Mode</h3>
                    <div className="space-y-3">
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMode === 'full' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-100'}`}>
                            <input
                                type="radio"
                                name="paymentMode"
                                value="full"
                                checked={paymentMode === 'full'}
                                onChange={() => setPaymentMode('full')}
                                className="mr-3 h-5 w-5 text-blue-600"
                            />
                            <div>
                                <div className="font-bold text-gray-800">Pay Full Amount Now</div>
                                <div className="text-sm text-gray-500">Fast and secure payment via Razorpay</div>
                            </div>
                        </label>

                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMode === 'installment' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-100'}`}>
                            <input
                                type="radio"
                                name="paymentMode"
                                value="installment"
                                checked={paymentMode === 'installment'}
                                onChange={() => setPaymentMode('installment')}
                                className="mr-3 h-5 w-5 text-blue-600"
                            />
                            <div>
                                <div className="font-bold text-gray-800">Pay in 2 Installments</div>
                                <div className="text-sm text-gray-500">Request approval to pay 50% now and 50% later</div>
                            </div>
                        </label>
                    </div>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>}

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 hover:shadow-blue-500/30'}`}
                >
                    {loading ? 'Processing...' : (paymentMode === 'installment' ? 'Request Installment Plan' : 'Proceed to Payment')}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                    {paymentMode === 'installment'
                        ? 'Your order will be pending approval. You can pay installments after admin approval.'
                        : 'Safe and Secure Payment via Razorpay'}
                </p>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform scale-100 animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h3>
                        <p className="text-gray-600 mb-6">{successMessage}</p>
                        <button
                            onClick={() => {
                                clearCart();
                                setShowSuccessModal(false);
                                navigate('/orders');
                            }}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
                        >
                            View Orders
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;

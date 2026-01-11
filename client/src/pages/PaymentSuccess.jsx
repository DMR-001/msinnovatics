import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const trackingId = searchParams.get('tracking_id');
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, []);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
            <div className="bg-green-100 rounded-full p-6 mb-6">
                <CheckCircle size={64} className="text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Payment Successful!</h1>
            <p className="text-xl text-gray-600 mb-8">Thank you for your purchase. Your order has been confirmed.</p>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-left w-full max-w-md mb-8">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-bold text-gray-900">#{orderId}</span>
                </div>
                {trackingId && (
                    <div className="flex justify-between">
                        <span className="text-gray-500">Transaction ID:</span>
                        <span className="font-mono text-gray-900">{trackingId}</span>
                    </div>
                )}
            </div>

            <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30">
                Continue Shopping
            </Link>
        </div>
    );
};

export default PaymentSuccess;

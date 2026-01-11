import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailure = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
            <div className="bg-red-100 rounded-full p-6 mb-6">
                <XCircle size={64} className="text-red-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Payment Failed</h1>
            <p className="text-xl text-gray-600 mb-8">Something went wrong with your transaction. You have not been charged.</p>

            {orderId && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100 mb-8 text-sm text-gray-500">
                    Failed Order Reference: #{orderId}
                </div>
            )}

            <div className="flex gap-4">
                <Link to="/checkout" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-all">
                    Try Again
                </Link>
                <Link to="/" className="text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-all">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default PaymentFailure;

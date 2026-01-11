import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, addToCart, total } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added any projects yet.</p>
                <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg">
                    Browse Projects
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                    {cart.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-xl shadow-md flex items-center gap-6 border border-gray-100">
                            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                <p className="text-gray-500">{item.category}</p>
                                <div className="text-blue-600 font-bold mt-1">${item.price}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Quantity controls if needed, though for projects usually 1 is enough. Let's keep it simple. */}
                                {/* <button className="p-1 hover:bg-gray-100 rounded"><Minus size={16} /></button>
                 <span className="font-semibold">{item.quantity}</span>
                 <button onClick={() => addToCart(item)} className="p-1 hover:bg-gray-100 rounded"><Plus size={16} /></button> */}
                                <div className="font-semibold">Qty: {item.quantity}</div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                title="Remove"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="lg:w-1/3">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
                        <h3 className="text-2xl font-bold mb-6 border-b pb-4">Order Summary</h3>
                        <div className="flex justify-between mb-4 text-gray-600">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-6 text-xl font-bold text-gray-900">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:opacity-90 transition-all text-lg"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

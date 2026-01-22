import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Check, Shield, Zap, Award } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Product not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading product details...</div>;
    if (error) return <div className="text-center py-20 text-red-600 font-bold">{error}</div>;

    const handleAddToCart = () => {
        addToCart(product);
        // Optionally navigate to cart or show success toast
        // navigate('/cart'); 
    };

    const handleBuyNow = () => {
        addToCart(product);
        navigate('/cart');
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs or Back Link */}
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-blue-600 mb-6 flex items-center gap-1">
                &larr; Back to Products
            </button>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="flex flex-col md:flex-row">
                    {/* Image Section - Left Panel */}
                    <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center relative">
                        <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-full max-w-md object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm border border-gray-200">
                                {product.category}
                            </span>
                        </div>
                    </div>

                    {/* Details Section - Right Panel */}
                    <div className="md:w-1/2 p-6 md:p-10 flex flex-col">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.title}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-blue-600">
                                ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.stock > 0 ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">In Stock</span>
                            ) : (
                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">Out of Stock</span>
                            )}
                        </div>

                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {product.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Check size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">Instant Access</h4>
                                    <p className="text-xs text-gray-500">Download immediately after purchase</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Shield size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">Secure Payment</h4>
                                    <p className="text-xs text-gray-500">100% Encrypted Transactions</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-yellow-50 p-2 rounded-lg text-yellow-600"><Zap size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">Premium Support</h4>
                                    <p className="text-xs text-gray-500">24/7 dedicated assistance</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-green-50 p-2 rounded-lg text-green-600"><Award size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">Quality Assured</h4>
                                    <p className="text-xs text-gray-500">Verified & tested code</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg 
                                    ${product.stock > 0
                                        ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-gray-900/30'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            >
                                <ShoppingCart size={20} />
                                {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock <= 0}
                                className={`px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:border-gray-900 hover:text-gray-900 transition-colors
                                ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specifications Tab Section */}
            <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-bold mb-6">Product Specifications & Features</h3>
                <div className="prose max-w-none text-gray-600">
                    {product.specifications_text ? (
                        <div className="markdown-body">
                            <ReactMarkdown>{product.specifications_text}</ReactMarkdown>
                        </div>
                    ) : (
                        <div>
                            {/* Fallback for legacy data or empty state */}
                            <p className="mb-4">No detailed specifications available for this project.</p>
                            {product.features && product.features.length > 0 && (
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 list-none pl-0">
                                    {product.features.map((feat, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div> {feat}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

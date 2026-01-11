import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
                setProducts(res.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center py-20">Loading products...</div>;

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-700 to-purple-800 text-white rounded-3xl p-12 mb-12 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Discover Premium Quality Projects</h1>
                    <p className="text-xl text-blue-100 mb-8">Elevate your portfolio with our curated collection of high-quality software projects.</p>
                    <a href="#products" className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg inline-block">
                        Shop Now
                    </a>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 transform skew-x-12 translate-x-20"></div>
            </div>

            <h2 id="products" className="text-3xl font-bold mb-8 text-gray-800">Latest Projects</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-gray-100 flex flex-col">
                        <div className="h-48 bg-gray-200 overflow-hidden relative">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">No Image</div>
                            )}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700 shadow-sm">
                                {product.category || 'Project'}
                            </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{product.title}</h3>
                            <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{product.description}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;

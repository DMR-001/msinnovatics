import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, Package, ShoppingBag } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', image_url: '', category: '', stock: 10
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'products') {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
                setProducts(res.data);
            } else {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/all`);
                setOrders(res.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`);
            fetchData();
        } catch (error) {
            alert('Error deleting product');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`, formData);
            setShowAddModal(false);
            setFormData({ title: '', description: '', price: '', image_url: '', category: '', stock: 10 });
            fetchData();
        } catch (error) {
            alert('Error adding product');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                    <Package size={20} /> Products
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                    <ShoppingBag size={20} /> Orders
                </button>
            </div>

            {activeTab === 'products' && (
                <div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="mb-6 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-all shadow flex items-center gap-2"
                    >
                        <Plus size={20} /> Add New Project
                    </button>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium">{product.title}</td>
                                        <td className="p-4">${product.price}</td>
                                        <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{product.category}</span></td>
                                        <td className="p-4 flex gap-2">
                                            {/* Edit button placeholder - navigate to edit page or open modal */}
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><Edit size={18} /></button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="p-4">#{order.id}</td>
                                    <td className="p-4">
                                        <div className="font-medium">{order.user_name}</div>
                                        <div className="text-sm text-gray-500">{order.user_email}</div>
                                    </td>
                                    <td className="p-4 font-bold text-green-600">${order.total_amount}</td>
                                    <td className="p-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="p-4"><span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase">{order.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">Add New Project</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                            <input name="title" placeholder="Project Title" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <textarea name="description" placeholder="Description" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32" onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="price" type="number" placeholder="Price" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                <input name="stock" type="number" placeholder="Stock" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                            </div>
                            <input name="category" placeholder="Category" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            <input name="image_url" placeholder="Image URL" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Create Project</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

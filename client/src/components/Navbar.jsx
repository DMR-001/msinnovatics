import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img
                        src="/logo.png"
                        alt="MS Innovatics Logo"
                        className="h-12 w-auto"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</Link>

                    <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
                        <ShoppingCart size={24} />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Admin</Link>
                            )}
                            <Link to="/orders" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Orders</Link>
                            <span className="text-gray-800 font-medium">Hello, {user.name}</span>
                            <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Login</Link>
                            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30">
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
                        <ShoppingCart size={24} />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cart.length}
                            </span>
                        )}
                    </Link>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg absolute w-full left-0">
                    <div className="flex flex-col space-y-4">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-blue-600 font-medium py-2">Home</Link>

                        {user ? (
                            <>
                                <div className="py-2 border-b border-gray-100 mb-2">
                                    <span className="text-gray-800 font-bold">Hi, {user.name}</span>
                                </div>
                                {user.role === 'admin' && (
                                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-blue-600 font-medium py-2">Admin Dashboard</Link>
                                )}
                                <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-blue-600 font-medium py-2">My Orders</Link>
                                <button
                                    onClick={() => { logout(); setIsMenuOpen(false); }}
                                    className="text-left text-red-500 hover:text-red-700 font-medium py-2 flex items-center gap-2"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-blue-600 font-medium py-2">Login</Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-blue-600 font-bold py-2">Register Now</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

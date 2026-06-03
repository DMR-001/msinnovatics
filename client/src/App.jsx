import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CertificateView from './pages/CertificateView';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Standalone certificate pages — no Navbar/Footer */}
                    <Route path="/certificate/:certId" element={<CertificateView />} />
                    <Route path="/verify/:certId" element={<CertificateView />} />

                    {/* All other pages with Navbar + Footer */}
                    <Route path="*" element={
                        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 flex flex-col">
                            <Navbar />
                            <main className="w-full flex-grow overflow-x-hidden">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                    <Route path="/terms-conditions" element={<TermsConditions />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/admin" element={
                                        <ProtectedRoute adminOnly>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    } />
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, ExternalLink, Copy, CheckCheck, Award } from 'lucide-react';

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const PERFORMANCE_OPTIONS = ['Excellent', 'Very Good', 'Good', 'Satisfactory'];

export default function CertificatesAdmin() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const emptyForm = {
        intern_name: '', domain: '', start_date: '', end_date: '',
        duration: '', performance: 'Good',
    };
    const [form, setForm] = useState(emptyForm);

    const fetchCerts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/certificates');
            setCerts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCerts(); }, []);

    // Auto-calculate duration when dates change
    useEffect(() => {
        if (form.start_date && form.end_date) {
            const start = new Date(form.start_date);
            const end = new Date(form.end_date);
            const diffMs = end - start;
            if (diffMs <= 0) { setForm(f => ({ ...f, duration: '' })); return; }
            const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
            const months = Math.round(days / 30.44);
            const weeks = Math.round(days / 7);
            let duration = '';
            if (months >= 1) duration = `${months} Month${months > 1 ? 's' : ''}`;
            else if (weeks >= 1) duration = `${weeks} Week${weeks > 1 ? 's' : ''}`;
            else duration = `${days} Day${days > 1 ? 's' : ''}`;
            setForm(f => ({ ...f, duration }));
        }
    }, [form.start_date, form.end_date]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/certificates', form);
            setShowForm(false);
            setForm(emptyForm);
            fetchCerts();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to issue certificate.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (certId) => {
        if (!window.confirm(`Revoke certificate ${certId}? This cannot be undone.`)) return;
        setDeleting(certId);
        try {
            await api.delete(`/certificates/${certId}`);
            fetchCerts();
        } catch (err) {
            alert('Failed to revoke certificate.');
        } finally {
            setDeleting(null);
        }
    };

    const copyLink = (certId) => {
        const url = `${window.location.origin}/certificate/${certId}`;
        navigator.clipboard.writeText(url);
        setCopiedId(certId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Internship Certificates</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{certs.length} certificate{certs.length !== 1 ? 's' : ''} issued</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow"
                >
                    <Plus size={18} /> Issue Certificate
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : certs.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400">
                    <Award size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No certificates issued yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Certificate ID</th>
                                <th className="p-4 font-semibold text-gray-600">Intern Name</th>
                                <th className="p-4 font-semibold text-gray-600">Domain</th>
                                <th className="p-4 font-semibold text-gray-600">Duration</th>
                                <th className="p-4 font-semibold text-gray-600">Performance</th>
                                <th className="p-4 font-semibold text-gray-600">Issued On</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certs.map(cert => (
                                <tr key={cert.certificate_id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs font-bold">
                                            {cert.certificate_id}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">{cert.intern_name}</td>
                                    <td className="p-4 text-gray-700">{cert.domain}</td>
                                    <td className="p-4 text-gray-600">{cert.duration}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                            cert.performance === 'Excellent' ? 'bg-green-100 text-green-700' :
                                            cert.performance === 'Very Good' ? 'bg-blue-100 text-blue-700' :
                                            cert.performance === 'Good' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {cert.performance}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{formatDate(cert.issued_date)}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1">
                                            <a
                                                href={`/certificate/${cert.certificate_id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                                                title="View Certificate"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                            <button
                                                onClick={() => copyLink(cert.certificate_id)}
                                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"
                                                title="Copy shareable link"
                                            >
                                                {copiedId === cert.certificate_id ? <CheckCheck size={16} className="text-green-600" /> : <Copy size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cert.certificate_id)}
                                                disabled={deleting === cert.certificate_id}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition disabled:opacity-50"
                                                title="Revoke Certificate"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Issue Certificate Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-2">
                                <Award size={20} className="text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-800">Issue New Certificate</h3>
                            </div>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Intern Full Name <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    placeholder="e.g. Rahul Sharma"
                                    value={form.intern_name}
                                    onChange={e => setForm({ ...form, intern_name: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Internship Domain <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    placeholder="e.g. Web Development, Digital Marketing"
                                    value={form.domain}
                                    onChange={e => setForm({ ...form, domain: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        required
                                        value={form.start_date}
                                        onChange={e => setForm({ ...form, start_date: e.target.value })}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        required
                                        value={form.end_date}
                                        onChange={e => setForm({ ...form, end_date: e.target.value })}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        placeholder="Auto-calculated"
                                        value={form.duration}
                                        onChange={e => setForm({ ...form, duration: e.target.value })}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Auto-filled from dates, editable</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Performance</label>
                                    <select
                                        value={form.performance}
                                        onChange={e => setForm({ ...form, performance: e.target.value })}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                                    >
                                        {PERFORMANCE_OPTIONS.map(p => <option key={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-3 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg text-sm disabled:opacity-60"
                                >
                                    {submitting ? 'Issuing...' : 'Issue Certificate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

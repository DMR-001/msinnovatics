import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
};

const Row = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, color: '#111827', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
);

export default function CertificateVerify() {
    const { certId } = useParams();
    const [cert, setCert] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/certificates/${certId}`)
            .then(res => setCert(res.data))
            .catch(() => setError('Certificate not found or has been revoked.'))
            .finally(() => setLoading(false));
    }, [certId]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
                <div style={{ width: 36, height: 36, border: '4px solid #16a34a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'DM Sans, sans-serif' }}>
                <div style={{ textAlign: 'center', padding: 40, maxWidth: 400 }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: '50%',
                        background: '#fef2f2', border: '3px solid #fca5a5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px', fontSize: 36,
                    }}>✕</div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Invalid Certificate</h2>
                    <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>{error}</p>
                    <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontSize: 14 }}>← Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'DM Sans, sans-serif' }}>
            <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '40px 36px', maxWidth: 440, width: '100%' }}>

                {/* Green tick */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: '50%',
                        background: '#f0fdf4', border: '3px solid #86efac',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path d="M10 20L17 27L30 13" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#15803d', margin: 0 }}>Certificate Verified</h2>
                    <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>This is an authentic certificate issued by MS Innovatics</p>
                </div>

                {/* Details */}
                <div style={{ background: '#f9fafb', borderRadius: 10, padding: '4px 16px', marginBottom: 24 }}>
                    <Row label="Certificate ID" value={cert.certificate_id} />
                    <Row label="Intern Name" value={cert.intern_name} />
                    <Row label="Domain" value={cert.domain} />
                    <Row label="Duration" value={cert.duration} />
                    <Row label="From" value={formatDate(cert.start_date)} />
                    <Row label="To" value={formatDate(cert.end_date)} />
                    <Row label="Performance" value={cert.performance} />
                    <Row label="Issued On" value={formatDate(cert.issued_date)} />
                </div>

                {/* Issued by */}
                <div style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af' }}>
                    Issued by <strong style={{ color: '#374151' }}>MS Innovatics</strong> &nbsp;·&nbsp; UDYAM-TS-09-0209714
                </div>

                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <Link to="/" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>← Back to Home</Link>
                </div>
            </div>
        </div>
    );
}

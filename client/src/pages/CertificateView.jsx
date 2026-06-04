import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { ShieldCheck, AlertCircle, Printer, ArrowLeft } from 'lucide-react';

const COMPANY = {
    name: 'MS Innovatics',
    udyam: 'UDYAM-TS-09-0209714',
    signatory: 'Dorankula Mukteshwara Reddy',
    designation: 'Co-Founder',
    website: 'www.msinnovatics.com',
    email: 'support@msinnovatics.com',
};

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function CertificateView() {
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
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
                <div style={{ width: 36, height: 36, border: '4px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'DM Sans, sans-serif' }}>
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Invalid Certificate</h2>
                    <p style={{ color: '#6b7280', marginBottom: 24 }}>{error}</p>
                    <Link to="/" style={{ color: '#2563eb', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Toolbar — hidden on print */}
            <div className="no-print" style={{
                background: '#f1f5f9', padding: '12px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid #e2e8f0',
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', textDecoration: 'none', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
                        <ShieldCheck size={15} /> Verified Certificate
                    </span>
                    <button
                        onClick={() => window.print()}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: '#2563eb', color: 'white', border: 'none',
                            padding: '8px 18px', borderRadius: 8, fontWeight: 700,
                            fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                        }}
                    >
                        <Printer size={16} /> Download / Print
                    </button>
                </div>
            </div>

            {/* Outer screen background */}
            <div className="no-print-bg" style={{ background: '#e5e7eb', padding: '32px 0', display: 'flex', justifyContent: 'center', minHeight: 'calc(100vh - 57px)' }}>

                {/* Certificate paper — A4 landscape, flex column so footer pins to bottom */}
                <div id="certificate" style={{
                    width: '297mm',
                    padding: '11mm 16mm 10mm',
                    fontFamily: "'DM Sans', sans-serif",
                    boxSizing: 'border-box',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
                }}>

                    {/* Corner brackets */}
                    {[
                        { top: 8, left: 8, borderTop: '4px solid #1d4ed8', borderLeft: '4px solid #1d4ed8', borderRadius: '4px 0 0 0' },
                        { top: 8, right: 8, borderTop: '4px solid #1d4ed8', borderRight: '4px solid #1d4ed8', borderRadius: '0 4px 0 0' },
                        { bottom: 8, left: 8, borderBottom: '4px solid #1d4ed8', borderLeft: '4px solid #1d4ed8', borderRadius: '0 0 0 4px' },
                        { bottom: 8, right: 8, borderBottom: '4px solid #1d4ed8', borderRight: '4px solid #1d4ed8', borderRadius: '0 0 4px 0' },
                    ].map((s, i) => (
                        <div key={i} style={{ position: 'absolute', width: 44, height: 44, ...s }} />
                    ))}

                    {/* Inner border */}
                    <div style={{ position: 'absolute', inset: 16, border: '1px solid #bfdbfe', borderRadius: 3, pointerEvents: 'none' }} />

                    {/* Watermark */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%) rotate(-28deg)',
                        fontSize: 80, fontWeight: 900,
                        color: 'rgba(37,99,235,0.035)',
                        whiteSpace: 'nowrap', letterSpacing: 8,
                        pointerEvents: 'none', userSelect: 'none',
                    }}>
                        MS INNOVATICS
                    </div>

                    {/* ── HEADER ── logo only */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5mm', flexShrink: 0 }}>
                        <img src="/logo.png" alt="MS Innovatics" style={{ height: 48, width: 'auto' }} />
                    </div>

                    {/* ── TITLE + ISSUE DATE ── */}
                    <div style={{ textAlign: 'center', marginBottom: '3mm', flexShrink: 0 }}>
                        <div style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                            color: 'white',
                            padding: '5px 36px',
                            borderRadius: 40,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 4,
                            textTransform: 'uppercase',
                            marginBottom: 6,
                        }}>
                            Certificate of Internship
                        </div>
                        <div style={{ fontSize: 10, color: '#9ca3af', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                            Issued on: {formatDate(cert.issued_date)}
                        </div>
                    </div>

                    {/* ── THIS IS TO CERTIFY ── */}
                    <div style={{ textAlign: 'center', fontSize: 11, color: '#6b7280', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '2.5mm', flexShrink: 0 }}>
                        This is to certify that
                    </div>

                    {/* ── INTERN NAME ── */}
                    <div style={{ textAlign: 'center', marginBottom: '3mm', flexShrink: 0 }}>
                        <div style={{
                            fontSize: 36,
                            fontWeight: 800,
                            color: '#1e3a8a',
                            fontFamily: "'Syne', sans-serif",
                            lineHeight: 1.1,
                        }}>
                            {cert.intern_name}
                        </div>
                        <div style={{
                            width: 100, height: 3,
                            background: 'linear-gradient(90deg, transparent, #2563eb, transparent)',
                            margin: '5px auto 0',
                            borderRadius: 2,
                        }} />
                    </div>

                    {/* ── BODY SENTENCE ── */}
                    <div style={{
                        textAlign: 'center', fontSize: 13, color: '#374151',
                        lineHeight: 1.9, flexShrink: 0,
                        maxWidth: '82%', margin: '0 auto',
                    }}>
                        has successfully completed an internship in the domain of{' '}
                        <strong style={{ color: '#1d4ed8' }}>{cert.domain}</strong>{' '}
                        at <strong>MS Innovatics</strong> from{' '}
                        <strong>{formatDate(cert.start_date)}</strong> to{' '}
                        <strong>{formatDate(cert.end_date)}</strong>{' '}
                        ({cert.duration}). We acknowledge their dedication and performance
                        as <strong>{cert.performance}</strong> during this period.
                    </div>

                    {/* ── SIGNATURE ROW ── */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0, marginTop: '10mm', marginBottom: '6mm' }}>

                        {/* Signature block */}
                        <div style={{ textAlign: 'center', minWidth: 160 }}>
                            <img
                                src="/signature.png"
                                alt="Signature"
                                style={{ height: 52, width: 'auto', display: 'block', margin: '0 auto 4px' }}
                                onError={e => { e.target.style.display = 'none'; }}
                            />
                            <div style={{ width: '100%', height: 1, background: '#d1d5db', marginBottom: 5 }} />
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>{COMPANY.signatory}</div>
                            <div style={{ fontSize: 10, color: '#6b7280' }}>{COMPANY.designation}</div>
                            <div style={{ fontSize: 10, color: '#6b7280' }}>{COMPANY.name}</div>
                        </div>

                        {/* Certificate ID — center */}
                        <div style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{
                                display: 'inline-block',
                                background: '#f0f9ff',
                                border: '1px solid #bae6fd',
                                borderRadius: 8,
                                padding: '7px 18px',
                            }}>
                                <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>Certificate ID</div>
                                <div style={{ fontSize: 13, fontWeight: 800, color: '#0369a1', letterSpacing: 1 }}>{cert.certificate_id}</div>
                                <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 3 }}>
                                    Verify at {COMPANY.website}/verify/{cert.certificate_id}
                                </div>
                            </div>
                        </div>

                        {/* MSME stamp + UDYAM — right side */}
                        <div style={{ textAlign: 'center', minWidth: 160 }}>
                            <img
                                src="/msme-stamp.png"
                                alt="MSME Registered"
                                style={{ height: 72, width: 'auto', display: 'block', margin: '0 auto 4px' }}
                                onError={e => { e.target.style.opacity = 0; }}
                            />
                            <div style={{ fontSize: 9, fontWeight: 700, color: '#1d4ed8', letterSpacing: 0.5 }}>{COMPANY.udyam}</div>
                        </div>
                    </div>

                    {/* ── FOOTER ── */}
                    <div style={{
                        flexShrink: 0,
                        paddingTop: 7,
                        borderTop: '1px solid #e5e7eb',
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: 9, color: '#9ca3af',
                    }}>
                        <span>{COMPANY.website}</span>
                        <span>{COMPANY.name}</span>
                        <span>{COMPANY.email}</span>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .no-print-bg {
                        background: none !important;
                        padding: 0 !important;
                        min-height: unset !important;
                        display: flex !important;
                        justify-content: center !important;
                        align-items: flex-start !important;
                    }
                    body, html { margin: 0; padding: 0; }
                    #certificate {
                        box-shadow: none !important;
                        width: 277mm !important;
                        height: auto !important;
                        margin: 10mm auto !important;
                    }
                    @page { size: A4 landscape; margin: 0; }
                }
            `}</style>
        </>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { ShieldCheck, AlertCircle, Printer, ArrowLeft } from 'lucide-react';

const COMPANY = {
    name: 'MS Innovatics',
    udyam: 'UDYAM-TS-09-0209714',
    signatory: 'Dorankula Mukteshwara Reddy',
    designation: 'Founder & Director',
    website: 'www.msinnovatics.com',
    email: 'contact@msinnovatics.com',
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
    const printRef = useRef();

    useEffect(() => {
        api.get(`/certificates/${certId}`)
            .then(res => setCert(res.data))
            .catch(() => setError('Certificate not found or has been revoked.'))
            .finally(() => setLoading(false));
    }, [certId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Certificate</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <Link to="/" className="text-blue-600 hover:underline flex items-center gap-2 justify-center">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Print controls — hidden when printing */}
            <div className="no-print bg-gray-100 py-4 px-6 flex items-center justify-between border-b">
                <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                    <ArrowLeft size={18} /> Back to Home
                </Link>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <ShieldCheck size={16} /> Verified Certificate
                    </span>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow"
                    >
                        <Printer size={18} /> Download / Print
                    </button>
                </div>
            </div>

            {/* Certificate — this is what gets printed */}
            <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 no-print-bg">
                <div
                    ref={printRef}
                    id="certificate"
                    className="certificate-paper relative bg-white"
                    style={{
                        width: '297mm',
                        minHeight: '210mm',
                        padding: '14mm 18mm',
                        fontFamily: "'DM Sans', sans-serif",
                        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                    }}
                >
                    {/* Decorative corner borders */}
                    <div style={{position:'absolute',top:10,left:10,width:50,height:50,borderTop:'4px solid #1d4ed8',borderLeft:'4px solid #1d4ed8',borderRadius:'4px 0 0 0'}} />
                    <div style={{position:'absolute',top:10,right:10,width:50,height:50,borderTop:'4px solid #1d4ed8',borderRight:'4px solid #1d4ed8',borderRadius:'0 4px 0 0'}} />
                    <div style={{position:'absolute',bottom:10,left:10,width:50,height:50,borderBottom:'4px solid #1d4ed8',borderLeft:'4px solid #1d4ed8',borderRadius:'0 0 0 4px'}} />
                    <div style={{position:'absolute',bottom:10,right:10,width:50,height:50,borderBottom:'4px solid #1d4ed8',borderRight:'4px solid #1d4ed8',borderRadius:'0 0 4px 0'}} />

                    {/* Outer border line */}
                    <div style={{position:'absolute',inset:18,border:'1.5px solid #bfdbfe',borderRadius:4,pointerEvents:'none'}} />

                    {/* Watermark */}
                    <div style={{
                        position:'absolute',top:'50%',left:'50%',
                        transform:'translate(-50%,-50%) rotate(-30deg)',
                        fontSize:'90px',fontWeight:900,
                        color:'rgba(37,99,235,0.04)',
                        whiteSpace:'nowrap',letterSpacing:8,
                        pointerEvents:'none',userSelect:'none',
                    }}>
                        MS INNOVATICS
                    </div>

                    {/* Header */}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8mm'}}>
                        {/* Logo */}
                        <div style={{display:'flex',alignItems:'center',gap:12}}>
                            <img src="/logo.png" alt="MS Innovatics" style={{height:56,width:'auto'}} />
                        </div>

                        {/* MSME Stamp */}
                        <div style={{
                            display:'flex',flexDirection:'column',alignItems:'center',
                            border:'2.5px solid #1d4ed8',borderRadius:'50%',
                            width:90,height:90,justifyContent:'center',
                            background:'linear-gradient(135deg,#eff6ff,#dbeafe)',
                            boxShadow:'0 2px 8px rgba(29,78,216,0.25)',
                            padding:6,textAlign:'center',flexShrink:0,
                        }}>
                            <div style={{fontSize:'6.5px',fontWeight:800,color:'#1d4ed8',letterSpacing:1,textTransform:'uppercase',lineHeight:1.3}}>
                                MSME<br />Registered
                            </div>
                            <div style={{fontSize:'5px',color:'#1e40af',fontWeight:700,marginTop:2,lineHeight:1.4,wordBreak:'break-all'}}>
                                {COMPANY.udyam}
            </div>
                            <div style={{fontSize:'5px',color:'#3b82f6',marginTop:2,fontWeight:600}}>
                                Govt. of India
                            </div>
                        </div>
                    </div>

                    {/* Title band */}
                    <div style={{textAlign:'center',marginBottom:'6mm'}}>
                        <div style={{
                            display:'inline-block',
                            background:'linear-gradient(135deg,#1d4ed8,#2563eb)',
                            color:'white',
                            padding:'6px 40px',
                            borderRadius:40,
                            fontSize:11,
                            fontWeight:700,
                            letterSpacing:4,
                            textTransform:'uppercase',
                            marginBottom:8,
                        }}>
                            Certificate of Internship
                        </div>
                        <div style={{fontSize:11,color:'#6b7280',letterSpacing:2,textTransform:'uppercase'}}>
                            This is to certify that
                        </div>
                    </div>

                    {/* Intern Name */}
                    <div style={{textAlign:'center',marginBottom:'4mm'}}>
                        <div style={{
                            fontSize:38,
                            fontWeight:800,
                            color:'#1e3a8a',
                            fontFamily:"'Syne', sans-serif",
                            lineHeight:1.1,
                        }}>
                            {cert.intern_name}
                        </div>
                        <div style={{
                            width:120,height:3,
                            background:'linear-gradient(90deg,transparent,#2563eb,transparent)',
                            margin:'6px auto 0',
                            borderRadius:2,
                        }} />
                    </div>

                    {/* Body text */}
                    <div style={{textAlign:'center',fontSize:13,color:'#374151',lineHeight:1.8,marginBottom:'6mm',maxWidth:'80%',margin:'0 auto 6mm'}}>
                        has successfully completed an internship in the domain of{' '}
                        <strong style={{color:'#1d4ed8'}}>{cert.domain}</strong>{' '}
                        at <strong>MS Innovatics</strong> from{' '}
                        <strong>{formatDate(cert.start_date)}</strong> to{' '}
                        <strong>{formatDate(cert.end_date)}</strong>{' '}
                        ({cert.duration}).
                    </div>

                    {/* Performance + details row */}
                    <div style={{
                        display:'flex',justifyContent:'center',gap:32,
                        marginBottom:'8mm',
                        flexWrap:'wrap',
                    }}>
                        {[
                            {label:'Domain',value:cert.domain},
                            {label:'Duration',value:cert.duration},
                            {label:'Performance',value:cert.performance},
                            {label:'Issue Date',value:formatDate(cert.issued_date)},
                        ].map(({label,value}) => (
                            <div key={label} style={{textAlign:'center',minWidth:100}}>
                                <div style={{fontSize:9,color:'#9ca3af',fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:2}}>{label}</div>
                                <div style={{fontSize:13,fontWeight:700,color:'#111827'}}>{value}</div>
                                <div style={{width:'100%',height:1,background:'#e5e7eb',marginTop:4}} />
                            </div>
                        ))}
                    </div>

                    {/* Signature + seal row */}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginTop:'auto'}}>

                        {/* Signature block */}
                        <div style={{textAlign:'center',minWidth:160}}>
                            {/* Stylised signature */}
                            <div style={{
                                fontFamily:'cursive',
                                fontSize:26,
                                color:'#1d4ed8',
                                lineHeight:1,
                                marginBottom:4,
                                borderBottom:'2px solid #1d4ed8',
                                paddingBottom:4,
                                letterSpacing:1,
                            }}>
                                D. Mukteshwara
                            </div>
                            <div style={{fontSize:11,fontWeight:700,color:'#111827'}}>{COMPANY.signatory}</div>
                            <div style={{fontSize:10,color:'#6b7280'}}>{COMPANY.designation}</div>
                            <div style={{fontSize:10,color:'#6b7280'}}>{COMPANY.name}</div>
                        </div>

                        {/* Cert ID + verify note — centered */}
                        <div style={{textAlign:'center',flex:1}}>
                            <div style={{
                                display:'inline-block',
                                background:'#f0f9ff',
                                border:'1px solid #bae6fd',
                                borderRadius:8,
                                padding:'6px 16px',
                            }}>
                                <div style={{fontSize:9,color:'#6b7280',letterSpacing:1.5,textTransform:'uppercase',marginBottom:2}}>Certificate ID</div>
                                <div style={{fontSize:13,fontWeight:800,color:'#0369a1',letterSpacing:1}}>{cert.certificate_id}</div>
                                <div style={{fontSize:8,color:'#94a3b8',marginTop:2}}>
                                    Verify at {COMPANY.website}/verify/{cert.certificate_id}
                                </div>
                            </div>
                        </div>

                        {/* Round MSME official seal — right side */}
                        <div style={{
                            width:100,height:100,
                            borderRadius:'50%',
                            border:'3px double #1d4ed8',
                            display:'flex',flexDirection:'column',
                            alignItems:'center',justifyContent:'center',
                            background:'radial-gradient(circle,#eff6ff,#dbeafe)',
                            boxShadow:'0 2px 12px rgba(29,78,216,0.3)',
                            textAlign:'center',
                            padding:8,
                            flexShrink:0,
                        }}>
                            <div style={{fontSize:'7px',fontWeight:800,color:'#1d4ed8',letterSpacing:1.5,textTransform:'uppercase'}}>MS Innovatics</div>
                            <div style={{width:50,height:1,background:'#3b82f6',margin:'3px 0'}} />
                            <div style={{fontSize:'6px',fontWeight:700,color:'#1e40af',letterSpacing:0.5,lineHeight:1.4}}>MSME Registered</div>
                            <div style={{fontSize:'5.5px',color:'#3b82f6',fontWeight:600,lineHeight:1.3,marginTop:1}}>UDYAM-TS-09-0209714</div>
                            <div style={{width:50,height:1,background:'#3b82f6',margin:'3px 0'}} />
                            <div style={{fontSize:'6px',color:'#6b7280'}}>Govt. of India</div>
                        </div>
                    </div>

                    {/* Footer strip */}
                    <div style={{
                        marginTop:10,
                        paddingTop:8,
                        borderTop:'1px solid #e5e7eb',
                        display:'flex',justifyContent:'space-between',
                        fontSize:9,color:'#9ca3af',
                    }}>
                        <span>{COMPANY.website}</span>
                        <span>{COMPANY.name} | {COMPANY.udyam}</span>
                        <span>{COMPANY.email}</span>
                    </div>
                </div>
            </div>

            {/* Print-only styles */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .no-print-bg { background: none !important; padding: 0 !important; }
                    body { margin: 0; }
                    #certificate {
                        box-shadow: none !important;
                        width: 297mm !important;
                        min-height: 210mm !important;
                        margin: 0 !important;
                    }
                    @page { size: A4 landscape; margin: 0; }
                }
            `}</style>
        </>
    );
}

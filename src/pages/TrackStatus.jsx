import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { databases } from '../utils/appwrite';

const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const TrackStatus = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
        setReport(response);
      } catch (err) {
        setError('Report not found. Please verify your reference ID.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  const getStepStatus = (step) => {
    if (!report) return 'pending';
    const status = report.status.toLowerCase();
    
    if (step === 1) return 'completed'; // Always submitted
    if (step === 2) {
      if (status === 'pending') return 'current';
      return (status === 'reviewed' || status === 'under review') ? 'current' : 'completed';
    }
    if (step === 3) {
      return status === 'resolved' ? 'completed' : 'pending';
    }
    return 'pending';
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-bold tracking-widest text-brand-accent">CONNECTING TO SECURE DATABASE...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen text-center p-6">
      <div className="glass-card p-12 max-w-lg">
        <h2 className="text-3xl font-black mb-4">Tracking Failed</h2>
        <p className="text-gray-400 mb-8 font-medium">{error}</p>
        <Link to="/track" className="btn-primary inline-block">Try Again</Link>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="glass-card w-full max-w-3xl p-12 text-center">
        <header className="mb-12 border-b border-white/5 pb-10">
          <img src="/logo.png" alt="Silent Shield Logo" className="w-20 mx-auto mb-6" />
          <h1 className="text-4xl font-black mb-2 tracking-tight">Report Tracker</h1>
          <p className="font-mono text-brand-accent tracking-widest text-sm uppercase">REFERENCE ID: {report.$id}</p>
        </header>

        {/* Professional Stepper UI */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16 px-10">
          {[
            { step: 1, label: "Submitted", sub: "Report Encrypted" },
            { step: 2, label: "Reviewing", sub: "Staff Assessment" },
            { step: 3, label: "Resolved", sub: "Final Resolution" }
          ].map((s, i) => {
            const status = getStepStatus(s.step);
            return (
              <React.Fragment key={s.step}>
                <div className="flex flex-col items-center relative z-10 group">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 ${
                    status === 'completed' ? 'bg-brand-accent border-brand-accent text-black scale-110' : 
                    status === 'current' ? 'bg-brand-primary border-brand-accent animate-pulse text-white scale-110 shadow-glow' : 
                    'bg-black/40 border-white/10 text-gray-600'
                  }`}>
                    {status === 'completed' ? '✔' : s.step}
                  </div>
                  <div className="mt-4">
                    <p className={`font-bold uppercase tracking-widest text-xs mb-1 ${status !== 'pending' ? 'text-white' : 'text-gray-600'}`}>{s.label}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{s.sub}</p>
                  </div>
                </div>
                {i < 2 && (
                  <div className={`hidden md:block flex-1 h-[4px] rounded-full transition-all duration-1000 ${
                    getStepStatus(s.step + 1) !== 'pending' ? 'bg-brand-accent shadow-glow' : 'bg-white/5'
                  }`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
          <div className="bg-black/30 p-8 rounded-2xl border border-white/5 group transition-colors hover:border-white/10">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Category</label>
            <p className="text-xl font-bold">{report.type}</p>
          </div>
          <div className="bg-black/30 p-8 rounded-2xl border border-white/5 group transition-colors hover:border-white/10">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Platform</label>
            <p className="text-xl font-bold">{report.platform}</p>
          </div>
          <div className="bg-black/30 p-8 rounded-2xl border border-white/5 group transition-colors hover:border-white/10">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Last Updated</label>
            <p className="text-lg font-bold text-gray-300">{new Date(report.$updatedAt).toLocaleString(undefined, { dateStyle: 'full' })}</p>
          </div>
          <div className="bg-black/30 p-8 rounded-2xl border border-white/5 group transition-colors hover:border-white/10">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Security Status</label>
            <p className="text-lg font-bold text-brand-accent tracking-[0.1em]">256-BIT ENCRYPTED</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link to="/" className="btn-primary text-lg py-5">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackStatus;

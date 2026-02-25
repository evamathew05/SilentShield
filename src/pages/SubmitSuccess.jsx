import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const SubmitSuccess = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-black/10">
      <div className="glass-card w-full max-w-3xl p-16 flex flex-col items-center">
        <div className="mb-10 p-6 bg-brand-accent/10 rounded-full animate-bounce">
          <img src="/success.png" alt="Success" className="w-24 drop-shadow-glow" />
        </div>

        <h2 className="text-5xl font-black mb-6 tracking-tight">Report Received</h2>
        <p className="text-xl text-gray-300 max-w-lg mb-12 opacity-90">
          Your case has been securely encrypted and transmitted to authorized staff for immediate review.
        </p>
        
        <div className="bg-black/30 p-10 rounded-3xl border border-brand-accent/20 mb-10 w-full max-w-md group hover:border-brand-accent/50 transition-colors">
          <label className="text-xs font-black text-brand-accent uppercase tracking-widest block mb-4">Your Private Reference ID</label>
          <p className="text-3xl font-black tracking-[0.2em] font-mono break-all group-hover:scale-105 transition-transform">
            {id || 'N/A'}
          </p>
        </div>

        <p className="text-sm text-gray-500 max-w-xs mb-12 font-medium">
          Please record this ID carefully. It is the only way to track your report progress anonymously.
        </p>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
            <Link to="/" className="btn-primary flex-1 py-5 text-xl">
                Close Portal
            </Link>
            <Link to={`/track-status/${id}`} className="btn-outline flex-1 py-5 text-lg">
                View Tracking
            </Link>
        </div>
        
        <div className="mt-12 flex items-center gap-3 opacity-60">
            <img src="/logo.png" alt="Logo" className="w-8 grayscale" />
            <span className="text-xs font-black tracking-widest text-gray-500 uppercase">Silent Shield Security Protocol</span>
        </div>
      </div>
    </div>
  );
};

export default SubmitSuccess;

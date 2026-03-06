import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const SubmitSuccess = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-black/10">
      <div className="glass-card w-full max-w-4xl p-16 flex flex-col items-center">
        <div className="mb-10 p-6 bg-brand-accent/10 rounded-full animate-bounce">
          <img src="/success.png" alt="Success" className="w-24 drop-shadow-glow" />
        </div>

        <h2 className="text-5xl font-black mb-6 tracking-tight">Report Received</h2>
        <p className="text-xl text-gray-300 max-w-lg mb-12 opacity-90">
          Your case has been securely encrypted and transmitted to authorized staff for immediate review.
        </p>
        
        <div className="bg-black/30 p-10 rounded-3xl border border-brand-accent/20 mb-10 w-full max-w-2xl group hover:border-brand-accent/50 transition-colors relative">
          <label className="text-xs font-black text-brand-accent uppercase tracking-widest block mb-6">Your Private Reference ID</label>
          <div className="flex flex-col items-center justify-center gap-8">
            <p className="text-2xl md:text-4xl font-black tracking-[0.1em] font-mono whitespace-nowrap group-hover:scale-105 transition-transform">
              {id || 'N/A'}
            </p>
            <button 
              onClick={copyToClipboard}
              className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 cursor-pointer ${
                copied 
                ? 'bg-brand-accent text-black shadow-[0_0_25px_rgba(0,255,136,0.6)] scale-105' 
                : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-brand-accent/30'
              }`}
            >
              {copied ? 'Copied to Clipboard ✓' : 'Copy Reference ID'}
            </button>
          </div>
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

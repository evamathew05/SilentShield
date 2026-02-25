import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TrackReport = () => {
  const [reportId, setReportId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reportId.trim()) {
      navigate(`/track-status/${reportId.trim()}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="glass-card w-full max-w-xl p-12 text-center">
        <div className="mb-10">
          <img src="/logo.png" alt="Silent Shield Logo" className="w-24 mx-auto mb-6" />
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">Track Status</h1>
          <p className="text-gray-400 text-lg">Enter your unique reference ID to check the progress of your report.</p>
        </div>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="text-left">
            <label className="text-sm font-semibold text-gray-300 ml-1 mb-2 block">Reference ID</label>
            <input 
              type="text" 
              placeholder="e.g. 699694080..." 
              className="input-field text-center tracking-widest font-mono"
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
              required 
            />
          </div>

          <div className="flex flex-col gap-4">
            <button 
              type="submit" 
              className="btn-primary text-xl py-5"
            >
              Check Progress
            </button>
            <Link 
              to="/" 
              className="btn-outline text-lg"
            >
              ← Back to Homepage
            </Link>
          </div>
        </form>

        <p className="mt-12 text-sm text-gray-500 font-medium">© 2026 Silent Shield Monitoring System</p>
      </div>
    </div>
  );
};

export default TrackReport;

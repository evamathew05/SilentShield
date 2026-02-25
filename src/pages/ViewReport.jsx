import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { account, databases, storage } from '../utils/appwrite';

const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

const ViewReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        await account.get();
        const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
        setReport(response);
        setStatus(response.status);
      } catch (error) {
        navigate('/admin-login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [id, navigate]);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, { status: status });
      setReport(prev => ({ ...prev, status: status }));
      alert('Case status updated successfully.');
    } catch (error) {
      alert('Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><p className="text-xl animate-pulse tracking-widest">LOADING CASE FILE...</p></div>;
  if (!report) return <div className="flex justify-center items-center min-h-screen text-center"><div className="glass-card p-10"><h2 className="text-2xl font-bold mb-4">Case Not Found</h2><Link to="/admin" className="btn-primary">Return to Dashboard</Link></div></div>;

  const evidenceUrl = report.evidenceId ? storage.getFileView(BUCKET_ID, report.evidenceId) : null;
  const previewUrl = report.evidenceId ? storage.getFilePreview(BUCKET_ID, report.evidenceId, 800) : null;

  return (
    <div className="min-h-screen p-8 bg-black/10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <Link to="/admin" className="text-gray-400 hover:text-white flex items-center gap-2 font-bold transition-colors">
                <span>←</span> BACK TO DASHBOARD
            </Link>
            <div className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                report.status === 'pending' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 
                report.status === 'resolved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}>
                Current Status: {report.status}
            </div>
        </div>

        <div className="glass-card p-10">
          <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">Case Report</h1>
              <p className="font-mono text-brand-accent tracking-widest text-sm">REF_ID: {report.$id}</p>
            </div>
            <img src="/logo.png" alt="Logo" className="w-14" />
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Category</label>
              <p className="text-2xl font-bold">{report.type}</p>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Digital Location</label>
              <p className="text-2xl font-bold">{report.platform}</p>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Timestamp of Incident</label>
              <p className="text-lg font-medium text-gray-300">{new Date(report.date).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Reported On</label>
              <p className="text-lg font-medium text-gray-300">{new Date(report.$createdAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
          </div>

          <div className="mb-12">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Official Statement</label>
            <div className="bg-black/20 p-8 rounded-2xl border border-white/5 leading-relaxed text-lg text-gray-300 italic">
              "{report.description}"
            </div>
          </div>

          {report.evidenceId && (
            <div className="mb-12">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Digital Evidence</label>
              <div className="bg-black/20 p-4 rounded-3xl border border-white/10 group">
                <img 
                  src={previewUrl} 
                  alt="Evidence" 
                  className="w-full h-auto rounded-2xl shadow-2xl" 
                />
                <div className="mt-4 text-center">
                  <a 
                    href={evidenceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-outline inline-block px-10 py-3 text-sm"
                  >
                    EXAMINE FULL RESOLUTION IMAGE
                  </a>
                </div>
              </div>
            </div>
          )}

          <footer className="border-t border-white/5 pt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="font-bold text-lg mb-1">Administrative Actions</h3>
                    <p className="text-gray-500 text-sm">Authorized case status modification</p>
                </div>
                <div className="flex items-center gap-3">
                    <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-black/40 border border-white/20 px-6 py-3.5 rounded-xl font-bold text-sm outline-none focus:border-brand-accent transition-colors"
                    >
                        <option value="pending">PENDING</option>
                        <option value="reviewed">UNDER REVIEW</option>
                        <option value="resolved">RESOLVED</option>
                    </select>
                    <button 
                    onClick={handleUpdateStatus}
                    disabled={isUpdating}
                    className="btn-primary py-3.5 px-8 disabled:opacity-50"
                    >
                    {isUpdating ? 'SAVING...' : 'UPDATE CASE'}
                    </button>
                </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;

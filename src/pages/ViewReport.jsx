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
  const [showFullImage, setShowFullImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel fetch for speed
        const [user, response] = await Promise.all([
          account.get(),
          databases.getDocument(DATABASE_ID, COLLECTION_ID, id)
        ]);
        
        console.log("Report Data Loaded:", response);
        setReport(response);
        setStatus(response.status);
      } catch (error) {
        console.error("Critical Load Error:", error);
        navigate('/admin-login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowFullImage(null);
      }
    };

    if (showFullImage) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showFullImage]);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, { status: status });
      setReport(prev => ({ ...prev, status: status }));
      alert('Case updated.');
    } catch (error) {
      alert('Update failed.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!report) return null;

  // ROBUST ID EXTRACTION
  const evidenceIds = (report.evidenceId || "")
    .split(',')
    .map(s => s.trim())
    .filter(id => id.length > 5); // Ensure they are valid IDs

  const evidenceItems = evidenceIds.map(fileId => {
    try {
      const view = storage.getFileView(BUCKET_ID, fileId);
      const preview = storage.getFilePreview(BUCKET_ID, fileId, 400);
      
      return {
        id: fileId,
        viewUrl: view.href || view.toString(),
        previewUrl: preview.href || preview.toString()
      };
    } catch (e) {
      console.error("URL Generation Error for ID:", fileId, e);
      return null;
    }
  }).filter(Boolean);

  console.log("Generated Evidence Items:", evidenceItems);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#050505] text-white">
      {/* Zoom Modal */}
      {showFullImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setShowFullImage(null)}
        >
          <img src={showFullImage} className="max-h-full max-w-full rounded-lg shadow-2xl" alt="Full Evidence" />
        </div>
      )}

      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8">
            <Link to="/admin" className="text-gray-500 hover:text-white flex items-center gap-2 font-black text-[10px] tracking-widest uppercase">
                <span>←</span> Dashboard
            </Link>
            <div className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/5">
                Internal Case File
            </div>
        </div>

        <div className="glass-card overflow-hidden border border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Sidebar */}
            <div className="lg:col-span-4 border-r border-white/5 p-8 space-y-10 bg-black/20">
                <header>
                    <h1 className="text-xl font-black uppercase italic mb-1">Case Analysis</h1>
                    <p className="font-mono text-[9px] text-gray-500 tracking-tighter">{report.$id}</p>
                </header>

                <div className="space-y-6">
                    <div>
                        <label className="text-[9px] font-black text-brand-primary uppercase tracking-widest block mb-1">Incident Type</label>
                        <p className="text-lg font-bold uppercase">{report.type}</p>
                    </div>
                    <div>
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Platform</label>
                        <p className="text-sm font-bold uppercase">{report.platform}</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-4">Evidence Gallery ({evidenceItems.length})</label>
                    <div className="grid grid-cols-2 gap-4">
                        {evidenceItems.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => setShowFullImage(item.viewUrl)}
                                className="relative aspect-square bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer group"
                            >
                                <img 
                                    src={item.previewUrl} 
                                    className="w-full h-full object-cover blur-[3px] transition-all duration-500 group-hover:scale-105 group-hover:blur-none group-hover:brightness-75" 
                                    alt="Thumbnail"
                                    onError={(e) => {
                                        console.warn("Retrying image load with View URL...");
                                        e.target.src = item.viewUrl; // Fallback to view URL if preview fails
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-full border border-white/20 shadow-2xl flex items-center gap-2">
                                      <span>🔍</span> Open
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {evidenceItems.length === 0 && <p className="text-[10px] text-gray-600 italic">No valid image data found.</p>}
                </div>
            </div>

            {/* Main Area */}
            <div className="lg:col-span-8 p-10 flex flex-col justify-between">
                <section>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block mb-6">Extracted OCR Metadata</label>
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5 shadow-inner">
                        <p className="text-sm leading-relaxed text-gray-400 italic">
                            "{report.description}"
                        </p>
                    </div>
                </section>

                <footer className="pt-10 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">Verification Terminal</p>
                    <div className="flex items-center gap-3">
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-black border border-white/10 text-white font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl"
                        >
                            <option value="under review">Under Review</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <button 
                            onClick={handleUpdateStatus}
                            disabled={isUpdating}
                            className="bg-brand-primary text-white font-black text-[10px] uppercase px-8 py-3 rounded-xl disabled:opacity-50"
                        >
                            {isUpdating ? 'Wait...' : 'Commit'}
                        </button>
                    </div>
                </footer>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
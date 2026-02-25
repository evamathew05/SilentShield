import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { databases, storage, ID } from '../utils/appwrite';

const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

const ReportBully = () => {
  const [type, setType] = useState('');
  const [platform, setPlatform] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let evidenceId = null;
      if (evidenceFile) {
        const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), evidenceFile);
        evidenceId = uploadedFile.$id;
      }

      const report = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          type,
          platform,
          description,
          date: new Date(date).toISOString(),
          evidenceId: evidenceId || '',
          status: 'pending'
        }
      );

      navigate(`/submit-success?id=${report.$id}`);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit report: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="glass-card w-full max-w-2xl p-10 flex flex-col">
        <div className="flex items-center gap-6 mb-8">
          <img src="/logo.png" alt="Logo" className="w-20" />
          <div>
            <h1 className="text-4xl font-extrabold text-white">Report Incident</h1>
            <p className="text-gray-400 mt-1">Your identity is fully protected by 256-bit encryption.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Incident Type</label>
              <select 
                className="input-field appearance-none cursor-pointer"
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                required
              >
                <option value="" disabled>Select Type</option>
                <option>Harassment</option>
                <option>Hate Speech</option>
                <option>Threats</option>
                <option>Impersonation</option>
                <option>Cyber Stalking</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Digital Platform</label>
              <input 
                type="text" 
                className="input-field"
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)} 
                placeholder="e.g. Instagram, WhatsApp" 
                required 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300 ml-1">Detailed Description</label>
            <textarea 
              rows="5" 
              className="input-field resize-none min-h-[140px]"
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Please provide specific details about the incident..." 
              required 
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Evidence (Optional)</label>
              <label htmlFor="evidence" className="input-field flex items-center justify-center gap-3 cursor-pointer hover:bg-white/5 bg-brand-primary/10 border-brand-primary/30">
                <span className="text-2xl">📁</span>
                <span>{evidenceFile ? 'Change File' : 'Upload Screenshot'}</span>
                <input 
                  type="file" 
                  id="evidence" 
                  ref={fileInputRef}
                  onChange={(e) => setEvidenceFile(e.target.files[0])} 
                  accept="image/*" 
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Incident Date</label>
              <div 
                className="input-field flex items-center justify-between cursor-pointer"
                onClick={() => document.getElementById('date-picker').showPicker()}
              >
                <span>📅 {new Date(date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                <input 
                  type="date" 
                  id="date-picker"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="absolute opacity-0 pointer-events-none" 
                  required 
                />
              </div>
            </div>
          </div>

          {evidenceFile && (
            <div className="flex items-center gap-4 bg-brand-accent/10 border border-brand-accent/20 p-4 rounded-xl animate-slide-in">
              <span className="text-brand-accent text-xl">✅</span>
              <span className="text-sm flex-1 font-medium truncate">File Ready: {evidenceFile.name}</span>
              <button 
                type="button" 
                onClick={() => { setEvidenceFile(null); fileInputRef.current.value = ''; }}
                className="text-red-400 hover:text-red-300 font-bold text-sm"
              >
                Remove
              </button>
            </div>
          )}

          <div className="pt-6 flex flex-col md:flex-row gap-4">
            <button 
              type="submit" 
              className="btn-primary flex-1 text-lg" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Encrypting & Sending...' : 'Submit Report Anonymously'}
            </button>
            <Link to="/" className="btn-outline flex items-center justify-center gap-2">
              Cancel
            </Link>
          </div>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          By submitting, you agree that this report is true to the best of your knowledge.
        </p>
      </div>
    </div>
  );
};

export default ReportBully;

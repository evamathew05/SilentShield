import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { databases, storage, ID } from '../utils/appwrite';
import Tesseract from 'tesseract.js';

const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

const ReportBully = () => {
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [platform, setPlatform] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');
  const [rejectionMessage, setRejectionMessage] = useState(null);
  const [platformError, setPlatformError] = useState(false);
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const incidentTypes = [
    'Harassment', 'Hate Speech', 'Threats', 'Impersonation', 'Cyber Stalking', 'Sexual Harassment'
  ];

  // AI Status Check on Load
  useEffect(() => {
    const checkAiStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "ping", labels: ["ping"] })
        });
        if (response.ok) {
          console.log("✅ AI Engine Online: Local Server is reachable.");
        } else {
          throw new Error();
        }
      } catch (err) {
        console.log("ℹ️ AI Engine Offline: Local Server not reachable. Using Smart-Keyword Engine fallback.");
      }
    };
    checkAiStatus();
  }, []);

  // --- AGGRESSIVE HEURISTIC ENGINE (Fast Pre-Check) ---
  const classifySmart = (text) => {
    const lowerText = text.toLowerCase();
    const toxicPatterns = [
      'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'slut', 'whore', 'bastard', 'cunt',
      'sex', 'sexy', 'hot', 'make out', 'naked', 'nude', 'porn', 'horny', 'lust', 'strip',
      'body', 'breast', 'cock', 'boobs', 'tits', 'ugly', 'fat', 'stupid', 'idiot', 'moron', 
      'loser', 'hate you', 'disgusting', 'freak', 'trash', 'garbage', 'worthless', 
      'kill yourself', 'kys', 'die', 'end your', 'nigger', 'faggot', 'retard', 'tranny', 
      'spic', 'chink', 'find you', 'know where you live', 'watch out', 'coming for you', 
      'hurt you', 'beat you', 'stalk', 'harass', 'post your', 'leak your', 'expose you'
    ];
    const categories = {
      'Sexual Harassment': ['sex', 'sexy', 'make out', 'hot', 'naked', 'nude', 'horny', 'porn'],
      'Hate Speech': ['racist', 'slur', 'nazi', 'supremacy', 'homophobic', 'xenophobic', 'hate'],
      'Threats': ['kill', 'die', 'murder', 'hurt', 'shoot', 'bomb', 'stab', 'beat'],
      'Impersonation': ['fake account', 'not the real', 'impersonate', 'identity', 'stolen'],
      'Cyber Stalking': ['watching', 'outside', 'address', 'location', 'follow', 'creep', 'dox'],
    };
    if (toxicPatterns.filter(word => lowerText.includes(word)).length > 0) {
      for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some(k => lowerText.includes(k))) return { type: cat, confidence: 0.95 };
      }
      return { type: 'Harassment', confidence: 0.9 };
    }
    return null;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    setRejectionMessage(null);
    setEvidenceFiles(prev => [...prev, ...selectedFiles]);
    setPlatformError(false);
  };

  const removeFile = (index) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartAnalysis = async () => {
    if (evidenceFiles.length === 0) return;
    if (!platform) { setPlatformError(true); return; }

    setPlatformError(false);
    setIsProcessing(true);
    let combinedText = "";
    let detectedType = 'Harassment';
    let isFlaggedOverall = false;

    // Use descriptive labels for the AI to understand context better
    const aiLabels = [
        "Personal Harassment or Bullying",
        "Hate Speech or Racism",
        "Physical Threats or Violence",
        "Fake Account or Identity Theft",
        "Stalking or Doxing",
        "Sexual Harassment or Explicit Content"
    ];

    const labelMap = {
        "Personal Harassment or Bullying": "Harassment",
        "Hate Speech or Racism": "Hate Speech",
        "Physical Threats or Violence": "Threats",
        "Fake Account or Identity Theft": "Impersonation",
        "Stalking or Doxing": "Cyber Stalking",
        "Sexual Harassment or Explicit Content": "Sexual Harassment"
    };

    try {
      for (let i = 0; i < evidenceFiles.length; i++) {
        setProcessStatus(`Scanning Image ${i + 1}/${evidenceFiles.length}...`);
        const { data: { text } } = await Tesseract.recognize(evidenceFiles[i], 'eng');
        combinedText += `\n[EVIDENCE_${i+1}]: ${text}`;

        // 1. Check Smart Keywords First
        const smartResult = classifySmart(text);
        if (smartResult) { 
            detectedType = smartResult.type; 
            isFlaggedOverall = true; 
        }

        // 2. Call Local AI Server for Deep Analysis
        try {
          setProcessStatus(`Deep Analyzing Image ${i + 1}...`);
          const response = await fetch("http://localhost:8000/classify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: text,
              labels: aiLabels
            })
          });
          
          if (response.ok) {
            const bertResult = await response.json();
            const topLabel = bertResult.labels[0];
            const topScore = bertResult.scores[0];

            if (labelMap[topLabel] && topScore > 0.45) {
              detectedType = labelMap[topLabel];
              isFlaggedOverall = true;
            }
          }
        } catch (serverErr) {
          console.warn("Local AI Server not reachable. Relying on Keyword Engine.");
        }
      }

      if (!isFlaggedOverall) {
        setRejectionMessage('No clear harassment detected in these screenshots.');
        setIsProcessing(false);
        return;
      }

      setProcessStatus(`Verified as ${detectedType}. Finalizing...`);
      const uploadedIds = [];
      for (let i = 0; i < evidenceFiles.length; i++) {
        const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), evidenceFiles[i]);
        uploadedIds.push(uploadedFile.$id);
      }
      
      const report = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
          type: detectedType,
          platform: platform,
          description: combinedText.substring(0, 4500),
          date: new Date().toISOString(),
          evidenceId: uploadedIds.join(','),
          status: 'under review'
      });

      navigate(`/submit-success?id=${report.$id}`);
    } catch (error) {
      console.error('Process failed:', error);
      setRejectionMessage('Analysis failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="glass-card w-full max-w-2xl p-10 flex flex-col text-center">
        <div className="flex flex-col items-center gap-6 mb-10">
          <img src="/logo.png" alt="Logo" className="w-24 transition-transform hover:scale-110" />
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase italic underline decoration-brand-primary decoration-4">Shield AI</h1>
            <p className="text-gray-400 mt-2 font-medium">Local-Server Intelligence</p>
          </div>
        </div>

        <div className="space-y-6">
          {evidenceFiles.length > 0 && !isProcessing && (
            <div className="flex flex-col gap-4 animate-slide-in mb-4 text-left">
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Platform Origin</label>
                  <select 
                    className={`input-field appearance-none cursor-pointer text-center transition-all ${platformError ? 'border-red-500 bg-red-500/10 ring-2 ring-red-500/20' : ''}`}
                    value={platform} 
                    onChange={(e) => { setPlatform(e.target.value); setPlatformError(false); }} 
                    required
                  >
                    <option value="" disabled>Select Digital Platform</option>
                    <option>WhatsApp</option>
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>Discord</option>
                    <option>Twitter / X</option>
                    <option>Other / Unknown</option>
                  </select>
                  {platformError && <p className="text-red-400 text-[10px] font-black uppercase tracking-widest ml-1 animate-pulse">⚠️ Platform Required</p>}
                </div>
            </div>
          )}

          <div className="relative">
            <input type="file" id="evidence" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" disabled={isProcessing} />
            <label htmlFor="evidence" className={`flex flex-col items-center justify-center gap-8 p-12 rounded-3xl border-2 border-dashed transition-all ${isProcessing ? 'bg-white/5 border-brand-primary/20 cursor-wait' : evidenceFiles.length > 0 ? 'bg-brand-primary/10 border-brand-primary/50' : 'bg-brand-primary/5 border-brand-primary/30 hover:bg-brand-primary/10 hover:border-brand-primary/50 cursor-pointer shadow-xl shadow-brand-primary/5'}`}>
              {isProcessing ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative"><div className="w-20 h-20 border-4 border-white/5 border-t-brand-accent rounded-full animate-spin"></div><div className="absolute inset-0 flex items-center justify-center text-xs font-black text-brand-accent uppercase italic">Shield</div></div>
                  <div className="flex flex-col gap-2"><span className="text-brand-accent font-black tracking-widest uppercase text-[10px] animate-pulse">{processStatus}</span></div>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-4xl">🛡️</div>
                  <div className="flex flex-col gap-3">
                    <span className="text-2xl font-black text-white uppercase tracking-tight">Upload screenshots</span>
                    <p className="text-sm text-gray-500 max-w-[280px] mx-auto leading-relaxed font-medium">Click or drag screenshots of harassment to begin.</p>
                  </div>
                </>
              )}
            </label>
          </div>

          {evidenceFiles.length > 0 && !isProcessing && (
            <div className="grid grid-cols-1 gap-3 animate-fade-in max-h-[200px] overflow-y-auto px-2 custom-scrollbar">
                {evidenceFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                        <span className="text-xl">📄</span>
                        <div className="flex-1 min-w-0"><p className="text-sm font-bold text-white truncate uppercase tracking-wider">{file.name}</p></div>
                        <button onClick={() => removeFile(index)} className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">✕</button>
                    </div>
                ))}
            </div>
          )}

          {evidenceFiles.length > 0 && !isProcessing && (
            <button onClick={handleStartAnalysis} className="btn-primary w-full py-5 text-lg uppercase font-black tracking-[0.2em] shadow-2xl shadow-brand-primary/20 animate-fade-in italic">Analyze & Submit {evidenceFiles.length} file{evidenceFiles.length > 1 ? 's' : ''}</button>
          )}

          {rejectionMessage && (
            <div className="p-6 rounded-2xl border bg-red-500/10 border-red-500/30 animate-slide-up">
              <div className="flex items-center justify-center gap-3 mb-3"><span className="text-2xl">🚫</span><h3 className="font-black uppercase tracking-widest text-sm text-red-400 italic">Discharged</h3></div>
              <p className="text-sm text-gray-400 leading-relaxed px-4">{rejectionMessage}</p>
              <button onClick={() => { setRejectionMessage(null); setEvidenceFiles([]); setPlatform(''); setPlatformError(false); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="mt-5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors py-2 px-6 border border-white/10 rounded-lg hover:bg-white/5">Retry</button>
            </div>
          )}

          <div className="pt-2"><Link to="/" className="text-gray-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"><span>←</span> Return to Dashboard</Link></div>
        </div>
        
        <div className="mt-10 p-6 bg-black/30 rounded-3xl border border-white/5 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-4">Neural Shield v3.0</h4>
          <p className="text-xs text-gray-500 leading-relaxed relative z-10 font-medium">Silent Shield now utilizes a dedicated local AI server for maximum classification accuracy. All processing is executed on your local machine to ensure absolute anonymity.</p>
        </div>
      </div>
    </div>
  );
};

export default ReportBully;
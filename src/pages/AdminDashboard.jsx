import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { databases } from '../utils/appwrite';
import authService from '../utils/auth';

const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      const docs = response.documents;
      setReports(docs);
      
      const pending = docs.filter(r => 
        r.status === 'pending' || 
        r.status === 'under review' || 
        r.status === 'reviewed'
      ).length;
      const resolved = docs.filter(r => r.status === 'resolved').length;
      setStats({
        total: docs.length,
        pending: pending,
        resolved: resolved
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-bold tracking-widest text-brand-accent">AUTHORIZED ACCESS ONLY</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-5">
            <img src="/logo.png" alt="Silent Shield" className="w-16" />
            <div>
              <h1 className="text-4xl font-black tracking-tight">Staff Portal</h1>
              <p className="text-gray-400 font-medium tracking-wide">INCIDENT MANAGEMENT SYSTEM</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="btn-outline px-6 py-2.5 text-sm">Main Site</Link>
            <button 
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 cursor-pointer"
            >
              Secure Logout
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: "Total Incidents", val: stats.total, color: "from-blue-600/20 to-blue-900/40", border: "border-blue-500/30" },
            { label: "Pending Review", val: stats.pending, color: "from-purple-600/20 to-purple-900/40", border: "border-purple-500/30" },
            { label: "Resolved Cases", val: stats.resolved, color: "from-emerald-600/20 to-emerald-900/40", border: "border-emerald-500/30" }
          ].map((s, i) => (
            <div key={i} className={`glass-card p-8 border-l-4 ${s.border} bg-gradient-to-br ${s.color}`}>
              <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">{s.label}</h3>
              <p className="text-5xl font-black">{s.val}</p>
            </div>
          ))}
        </section>

        {/* Table Section */}
        <section className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/5">
            <h2 className="text-xl font-bold">Recent Incident Reports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/20 text-gray-400 uppercase text-xs tracking-[0.2em]">
                  <th className="px-8 py-5">Reference</th>
                  <th className="px-8 py-5">Incident Type</th>
                  <th className="px-8 py-5">Platform</th>
                  <th className="px-8 py-5">Date Reported</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reports.map(report => (
                  <tr key={report.$id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6 font-mono text-sm text-brand-accent">{report.$id}</td>
                    <td className="px-8 py-6 font-bold">{report.type}</td>
                    <td className="px-8 py-6 text-gray-300">{report.platform}</td>
                    <td className="px-8 py-6 text-gray-400">{new Date(report.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${
                        report.status === 'pending' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 
                        report.status === 'resolved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                        'bg-blue-500/10 border-blue-500/30 text-blue-400'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link to={`/admin/view/${report.$id}`}>
                        <button className="px-5 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold hover:bg-brand-primary transition-all cursor-pointer">Review Case</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;

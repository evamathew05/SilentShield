import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ReportBully from './pages/ReportBully';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TrackReport from './pages/TrackReport';
import TrackStatus from './pages/TrackStatus';
import SubmitSuccess from './pages/SubmitSuccess';
import ViewReport from './pages/ViewReport';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportBully />} />
        <Route path="/submit-success" element={<SubmitSuccess />} />
        <Route path="/track" element={<TrackReport />} />
        <Route path="/track-status/:id" element={<TrackStatus />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/view/:id" 
          element={
            <ProtectedRoute>
              <ViewReport />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

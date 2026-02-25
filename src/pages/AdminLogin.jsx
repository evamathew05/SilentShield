import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../utils/auth';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        navigate('/admin');
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    console.log("Attempting login with email:", email);

    try {
      // First, try to clear any existing sessions to avoid the "session active" error
      try {
        await authService.logout();
        console.log("Previous session cleared");
      } catch (logoutError) {
        // Ignore logout errors (no session active)
      }

      const response = await authService.login({ email, password });
      console.log("Login successful, session:", response);
      navigate('/admin');
    } catch (error) {
      console.error('Detailed Login error:', error);
      alert('Authentication failed: ' + error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="glass-card w-full max-w-lg p-12 flex flex-col items-center">
        <div className="mb-10 text-center">
          <img src="/logo.png" alt="Silent Shield Logo" className="w-24 mx-auto mb-6" />
          <h1 className="text-4xl font-black tracking-tight mb-2">Staff Login</h1>
          <p className="text-gray-400 font-medium">Access incident management tools.</p>
        </div>

        <form className="w-full space-y-8" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Staff Email</label>
            <input 
              type="email" 
              placeholder="Email" 
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Secure Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button 
              type="submit" 
              className="btn-primary w-full py-5 text-lg"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'AUTHENTICATING...' : 'ENTER PORTAL'}
            </button>
            <Link to="/" className="text-gray-500 hover:text-white text-sm font-bold transition-colors text-center py-2">
              ← Return to public site
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Lock, User, ArrowRight, HardHat, Wrench, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_DETAILS } from '../config/rolePermissions';

export const Login = () => {
  const [username, setUsername] = useState('engineer_sarah');
  const [password, setPassword] = useState('Engineer123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(username, password);
      const userRole = data.user?.role || 'ENGINEER';
      const targetPath = ROLE_DETAILS[userRole]?.dashboardPath || '/dashboard';
      navigate(targetPath);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please verify your login credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col justify-center items-center p-4 selection:bg-[#16A34A] selection:text-white">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#14532D] text-white shadow-xl shadow-emerald-950/20 mb-3 border border-emerald-500/30">
            <span className="text-2xl font-black font-mono text-[#FACC15]">RG</span>
          </div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">RailGuard AI</h1>
          <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-widest mt-0.5">
            Role-Based Railway Surveillance & Predictive Maintenance
          </p>
          <p className="text-xs text-slate-500 italic mt-1">
            "Inspect Smarter. Predict Earlier. Maintain Safer."
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-7 backdrop-blur-md">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Username or Work Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. engineer_sarah"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-slate-900 font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-slate-900 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#16A34A] focus:ring-[#16A34A]"
                />
                <span className="text-slate-600 font-medium">Remember session</span>
              </label>
              <span className="text-[#16A34A] hover:underline cursor-pointer">Railway SSO Help</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#14532D] hover:bg-[#16A34A] text-white font-bold shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all group disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Operations Console'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Quick 5-Role Demo Selector */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
              Quick Role Authentication (Select Persona)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('engineer_sarah', 'Engineer123!')}
                className="p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold hover:bg-emerald-100 text-center"
              >
                1. Engineer
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'Admin123!')}
                className="p-2 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 font-bold hover:bg-purple-100 text-center"
              >
                2. Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('inspector_john', 'Inspector123!')}
                className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 font-bold hover:bg-blue-100 text-center"
              >
                3. Inspector
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('maintenance_dave', 'Maint123!')}
                className="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-bold hover:bg-amber-100 text-center"
              >
                4. Maintenance
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('viewer_alice', 'Viewer123!')}
                className="p-2 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-bold hover:bg-slate-200 text-center col-span-2 sm:col-span-1"
              >
                5. Viewer (Read-only)
              </button>
            </div>
          </div>
        </div>

        {/* Regulatory Governance Footer */}
        <div className="text-center mt-5 text-[11px] text-slate-500">
          <p>Advisory Decision Support System • Compliant with EN 50126 Railway Safety Standards</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

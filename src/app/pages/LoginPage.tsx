import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Heart, Mail, Lock, ArrowRight, Stethoscope } from "lucide-react";
import { useApp } from "../context/AppContext";
import { UserRole } from "../context/AppContext";

const DEMO_ACCOUNTS = [
  { label: "Patient Demo", email: "ali@email.com", password: "123", role: "patient" as UserRole, id: "1", name: "Ali" },
  { label: "Doctor Demo", email: "ahmed@email.com", password: "123", role: "doctor" as UserRole, id: "2", name: "Ahmed" },
  { label: "Admin Demo", email: "admin@email.com", password: "123", role: "admin" as UserRole, id: "3", name: "Admin" },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser({
          id: String(user.user_id),
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
        });

        if (user.role === 'admin') navigate('/admin-dashboard');
        else if (user.role === 'doctor') navigate('/doctor-dashboard');
        else navigate('/patient-dashboard');
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Heart size={24} className="text-white" />
            </div>
            <span className="text-white text-2xl font-bold">SmartClinic</span>
          </div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Your Health,<br />Our Priority
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Access top-rated doctors, book appointments, and manage your health journey — all in one place.
          </p>
        </div>

        <div className="relative space-y-4">
          {[
            { icon: <Stethoscope size={18} />, title: "200+ Specialists", desc: "Connect with certified doctors" },
            { icon: <Heart size={18} />, title: "24/7 Healthcare", desc: "Round-the-clock medical support" },
          ].map((feat) => (
            <div key={feat.title} className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-2xl p-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                {feat.icon}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{feat.title}</p>
                <p className="text-blue-200 text-xs">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <span className="text-gray-800 text-xl font-bold">SmartClinic</span>
          </div>

          <div className="mb-8">
            <h1 className="text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to your account to continue</p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-3 uppercase tracking-wider">Quick Demo Access</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.label}
                  onClick={() => fillDemo(acc)}
                  className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                Remember me
              </label>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

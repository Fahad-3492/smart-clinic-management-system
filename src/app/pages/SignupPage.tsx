import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Heart, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { UserRole } from "../context/AppContext";

const ROLES = [
  { value: "patient", label: "Patient", desc: "Book appointments & track health" },
  { value: "doctor", label: "Doctor", desc: "Manage patients & appointments" },
  { value: "admin", label: "Admin", desc: "Oversee clinic operations" },
];

export function SignupPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "patient" as UserRole });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 3) { setError("Password must be at least 3 characters."); return; }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser({
          id: String(user.user_id),
          name: user.name,
          email: user.email,
          role: 'patient' as UserRole,
        });
        setSuccess(true);
        setTimeout(() => navigate("/patient-dashboard"), 1500);
      } else {
        const msg = await response.text();
        setError(msg || "Signup failed. Try a different email.");
      }
    } catch {
      setError("Cannot connect to server. Make sure backend is running.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><Heart size={24} className="text-white" /></div>
            <span className="text-white text-2xl font-bold">SmartClinic</span>
          </div>
          <h2 className="text-white text-3xl font-bold mb-4">Join Our Healthcare Community</h2>
          <p className="text-blue-200 text-base leading-relaxed mb-10">Create your account and start your journey to better health management today.</p>
          <div className="space-y-4">
            {["Instant appointment booking", "Access to 200+ specialists", "Digital health records", "24/7 chat support"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-blue-100 text-sm">
                <CheckCircle size={16} className="text-blue-300 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Heart size={20} className="text-white" /></div>
            <span className="text-gray-800 text-xl font-bold">SmartClinic</span>
          </div>

          {success ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="text-gray-800 mb-2">Account Created!</h2>
              <p className="text-gray-500 text-sm">Redirecting you to your dashboard...</p>
              <div className="mt-4 flex justify-center"><div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-gray-900 mb-1">Create Account</h1>
                <p className="text-gray-500 text-sm">Fill in your details to get started</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
                <div className="grid grid-cols-3 gap-3">
                  {ROLES.map((role) => (
                    <button key={role.value} type="button" onClick={() => setForm((f) => ({ ...f, role: role.value as UserRole }))}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${form.role === role.value ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <p className={`text-sm font-semibold ${form.role === role.value ? "text-blue-700" : "text-gray-700"}`}>{role.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-tight">{role.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 rounded border-gray-300 text-blue-600" />
                  I agree to the <button type="button" className="text-blue-600 hover:underline">Terms of Service</button> and <button type="button" className="text-blue-600 hover:underline">Privacy Policy</button>
                </label>

                {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

                <button type="submit" disabled={loading} className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-gray-500">
                Already have an account? <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

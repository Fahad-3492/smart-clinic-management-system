import React, { useState, useEffect } from "react";
import {
  Users, Stethoscope, Calendar, TrendingUp, Plus, Search,
  Edit2, Trash2, CheckCircle, XCircle, AlertCircle,
  Star, Activity, DollarSign, Shield, Eye
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { DOCTORS, PATIENTS, APPOINTMENTS, Doctor } from "../data/mockData";
import { useLocation } from "react-router";

type TabType = "overview" | "doctors" | "patients" | "appointments";

const STATUS_CONFIG = {
  confirmed: { icon: <CheckCircle size={13} />, color: "text-emerald-600 bg-emerald-50", label: "Confirmed" },
  pending: { icon: <AlertCircle size={13} />, color: "text-amber-600 bg-amber-50", label: "Pending" },
  cancelled: { icon: <XCircle size={13} />, color: "text-red-500 bg-red-50", label: "Cancelled" },
  completed: { icon: <CheckCircle size={13} />, color: "text-blue-600 bg-blue-50", label: "Completed" },
};

export function AdminDashboard() {
  const location = useLocation();
  const urlTab = new URLSearchParams(location.search).get("tab") as TabType | null;
  const [activeTab, setActiveTab] = useState<TabType>(urlTab || "overview");
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState(DOCTORS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "", experience: "", fee: "" });

  useEffect(() => {
    if (urlTab) setActiveTab(urlTab);
  }, [urlTab]);

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleAvailability = (id: string) => {
    setDoctors((prev) => prev.map((d) => d.id === id ? { ...d, available: !d.available } : d));
  };

  const handleRemoveDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const doc: Doctor = {
      id: "d-" + Date.now(),
      name: newDoctor.name,
      specialty: newDoctor.specialty,
      experience: newDoctor.experience,
      fee: parseInt(newDoctor.fee) || 100,
      rating: 4.5, reviews: 0, available: true,
      image: "https://images.unsplash.com/photo-1627093143401-2ade923be6c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      email: newDoctor.name.toLowerCase().replace(" ", ".") + "@smartclinic.com",
      phone: "+1 (555) 000-0000",
      bio: "New doctor joining our clinic.",
      patients: 0,
    };
    setDoctors((prev) => [...prev, doc]);
    setNewDoctor({ name: "", specialty: "", experience: "", fee: "" });
    setShowAddModal(false);
  };

  const totalRevenue = APPOINTMENTS.filter((a) => a.status === "completed").length * 130;

  const TABS: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <Activity size={16} /> },
    { key: "doctors", label: "Doctors", icon: <Stethoscope size={16} /> },
    { key: "patients", label: "Patients", icon: <Users size={16} /> },
    { key: "appointments", label: "Appointments", icon: <Calendar size={16} /> },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-52 h-52 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-sm mb-1">Admin Control Panel</p>
            <h2 className="text-white text-xl font-bold mb-1">SmartClinic Management</h2>
            <p className="text-violet-200 text-sm">Managing {doctors.length} doctors · {PATIENTS.length} patients · {APPOINTMENTS.length} appointments</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
            <Shield size={18} className="text-white" />
            <span className="text-white text-sm font-medium">Admin Access</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Doctors", value: doctors.length, sub: `${doctors.filter(d => d.available).length} available`, icon: <Stethoscope size={20} />, color: "bg-blue-50 text-blue-600" },
          { label: "Total Patients", value: PATIENTS.length, sub: "Active patients", icon: <Users size={20} />, color: "bg-emerald-50 text-emerald-600" },
          { label: "Appointments", value: APPOINTMENTS.length, sub: `${APPOINTMENTS.filter(a => a.status === "confirmed").length} confirmed`, icon: <Calendar size={20} />, color: "bg-violet-50 text-violet-600" },
          { label: "Revenue", value: `$${(totalRevenue / 1000).toFixed(1)}K`, sub: "This month", icon: <DollarSign size={20} />, color: "bg-amber-50 text-amber-600" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${kpi.color}`}>{kpi.icon}</div>
            <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearch(""); }}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50/40" : "text-gray-500 hover:text-gray-700"}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Doctors by Specialty</h3>
                <div className="space-y-3">
                  {[...new Set(DOCTORS.map(d => d.specialty))].map((specialty) => {
                    const count = doctors.filter(d => d.specialty === specialty).length;
                    const pct = Math.round((count / doctors.length) * 100);
                    return (
                      <div key={specialty}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-700">{specialty}</span>
                          <span className="text-sm font-semibold text-gray-800">{count} doctor{count > 1 ? "s" : ""}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-full bg-violet-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Appointment Status</h3>
                <div className="space-y-3">
                  {(["confirmed", "pending", "completed", "cancelled"] as const).map((status) => {
                    const count = APPOINTMENTS.filter(a => a.status === status).length;
                    const pct = Math.round((count / APPOINTMENTS.length) * 100);
                    const colors = { confirmed: "bg-emerald-500", pending: "bg-amber-500", completed: "bg-blue-500", cancelled: "bg-red-400" };
                    return (
                      <div key={status}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-700 capitalize">{status}</span>
                          <span className="text-sm font-semibold text-gray-800">{count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className={`h-full ${colors[status]} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "doctors" && (
          <div>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctors..." className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition">
                <Plus size={15} /> Add Doctor
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Specialty</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Rating</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={doctor.image} alt={doctor.name} className="w-10 h-10 rounded-xl object-cover object-top" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{doctor.name}</p>
                            <p className="text-xs text-gray-400">{doctor.experience}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell"><span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{doctor.specialty}</span></td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
                          <span className="text-xs text-gray-400">({doctor.reviews})</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button onClick={() => handleToggleAvailability(doctor.id)} className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${doctor.available ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                          {doctor.available ? "● Available" : "● Unavailable"}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition"><Eye size={14} /></button>
                          <button className="p-1.5 hover:bg-amber-50 rounded-lg text-amber-500 transition"><Edit2 size={14} /></button>
                          <button onClick={() => handleRemoveDoctor(doctor.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "patients" && (
          <div>
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients..." className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Age</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Condition</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Visit</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {PATIENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase())).map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center font-bold text-indigo-700 text-sm flex-shrink-0">
                            {patient.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <p className="text-sm font-semibold text-gray-800">{patient.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <p className="text-xs text-gray-600">{patient.email}</p>
                        <p className="text-xs text-gray-400">{patient.phone}</p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell"><p className="text-sm text-gray-700">{patient.age}y · {patient.gender}</p></td>
                      <td className="px-4 py-4 hidden lg:table-cell"><span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full">{patient.condition}</span></td>
                      <td className="px-4 py-4 hidden lg:table-cell"><p className="text-sm text-gray-500">{patient.lastVisit}</p></td>
                      <td className="px-4 py-4"><button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition"><Eye size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div>
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search appointments..." className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date & Time</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {APPOINTMENTS.filter(a => a.patientName.toLowerCase().includes(search.toLowerCase()) || a.doctorName.toLowerCase().includes(search.toLowerCase())).map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800">{apt.patientName}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[150px]">{apt.reason}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <img src={apt.doctorImage} alt={apt.doctorName} className="w-8 h-8 rounded-lg object-cover object-top" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{apt.doctorName}</p>
                            <p className="text-xs text-gray-400">{apt.specialty}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-sm text-gray-700">{apt.date}</p>
                        <p className="text-xs text-gray-400">{apt.time}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold w-fit ${STATUS_CONFIG[apt.status].color}`}>
                          {STATUS_CONFIG[apt.status].icon}{STATUS_CONFIG[apt.status].label}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800">Add New Doctor</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><XCircle size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleAddDoctor} className="space-y-4">
              {[
                { label: "Full Name", name: "name", placeholder: "Dr. John Smith", value: newDoctor.name },
                { label: "Specialty", name: "specialty", placeholder: "e.g. Cardiologist", value: newDoctor.specialty },
                { label: "Experience", name: "experience", placeholder: "e.g. 10 years", value: newDoctor.experience },
                { label: "Consultation Fee ($)", name: "fee", placeholder: "e.g. 150", value: newDoctor.fee },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                  <input name={field.name} value={field.value} onChange={(e) => setNewDoctor(prev => ({ ...prev, [e.target.name]: e.target.value }))} placeholder={field.placeholder} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium shadow-md shadow-violet-200">Add Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

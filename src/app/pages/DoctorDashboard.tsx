import React, { useState, useEffect } from "react";
import {
  Calendar, Clock, Users, CheckCircle, AlertCircle,
  XCircle, TrendingUp, Star, Activity, MessageCircle, Video, Search
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useApp } from "../context/AppContext";
import { APPOINTMENTS, PATIENTS, DOCTORS } from "../data/mockData";
import { useLocation } from "react-router";

const STATUS_CONFIG = {
  confirmed: { icon: <CheckCircle size={13} />, color: "text-emerald-600 bg-emerald-50 border-emerald-200", label: "Confirmed" },
  pending: { icon: <AlertCircle size={13} />, color: "text-amber-600 bg-amber-50 border-amber-200", label: "Pending" },
  cancelled: { icon: <XCircle size={13} />, color: "text-red-500 bg-red-50 border-red-200", label: "Cancelled" },
  completed: { icon: <CheckCircle size={13} />, color: "text-blue-600 bg-blue-50 border-blue-200", label: "Completed" },
};

const WEEKLY_DATA = [
  { day: "Mon", patients: 6 }, { day: "Tue", patients: 8 },
  { day: "Wed", patients: 5 }, { day: "Thu", patients: 9 },
  { day: "Fri", patients: 7 }, { day: "Sat", patients: 4 }, { day: "Sun", patients: 2 },
];

export function DoctorDashboard() {
  const { currentUser } = useApp();
  const location = useLocation();
  const urlTab = new URLSearchParams(location.search).get("tab") as "appointments" | "patients" | null;
  const [activeTab, setActiveTab] = useState<"appointments" | "patients">(urlTab || "appointments");
  const [searchPatient, setSearchPatient] = useState("");

  useEffect(() => { if (urlTab) setActiveTab(urlTab); }, [urlTab]);

  const doctorId = currentUser?.id ?? "d1";
  const doctor = DOCTORS.find((d) => d.id === doctorId) ?? DOCTORS[0];
  const doctorAppointments = APPOINTMENTS.filter((a) => a.doctorId === doctorId);
  const todayApts = doctorAppointments.filter((a) => a.status === "confirmed" || a.status === "pending");
  const completedApts = doctorAppointments.filter((a) => a.status === "completed");
  const patientIds = [...new Set(doctorAppointments.map((a) => a.patientId))];
  const myPatients = PATIENTS.filter((p) => patientIds.includes(p.id));
  const filteredPatients = myPatients.filter((p) => p.name.toLowerCase().includes(searchPatient.toLowerCase()));
  const maxPatients = Math.max(...WEEKLY_DATA.map((d) => d.patients));

  return (
    <DashboardLayout title="Doctor Dashboard">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-52 h-52 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center gap-5">
          <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-white/30" />
          <div className="flex-1">
            <p className="text-emerald-200 text-xs mb-0.5">Welcome back,</p>
            <h2 className="text-white text-xl font-bold">{currentUser?.name ?? doctor.name}</h2>
            <p className="text-emerald-200 text-sm">{doctor.specialty} · {doctor.experience} experience</p>
            <div className="flex items-center gap-1 mt-2">
              <Star size={12} className="text-amber-300 fill-amber-300" />
              <span className="text-white text-xs font-semibold">{doctor.rating}</span>
              <span className="text-emerald-200 text-xs">({doctor.reviews} reviews)</span>
            </div>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm transition">
            <Video size={15} /> Start Video Call
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Today's Appointments", value: todayApts.length, icon: <Calendar size={20} />, color: "bg-blue-50 text-blue-600", change: "+2" },
          { label: "Total Patients", value: doctor.patients.toLocaleString(), icon: <Users size={20} />, color: "bg-emerald-50 text-emerald-600", change: "+12" },
          { label: "Completed", value: completedApts.length, icon: <CheckCircle size={20} />, color: "bg-violet-50 text-violet-600", change: "+5" },
          { label: "Rating", value: doctor.rating, icon: <Star size={20} />, color: "bg-amber-50 text-amber-600", change: "+0.1" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>{stat.icon}</div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">{stat.change}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {(["appointments", "patients"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3.5 text-sm font-medium capitalize transition-all ${activeTab === tab ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/40" : "text-gray-500 hover:text-gray-700"}`}>
                  {tab === "appointments" ? "Appointments" : "My Patients"}
                </button>
              ))}
            </div>

            {activeTab === "appointments" && (
              <div className="divide-y divide-gray-50">
                {doctorAppointments.length === 0 && (
                  <div className="py-12 text-center"><Calendar size={32} className="text-gray-300 mx-auto mb-3" /><p className="text-gray-400 text-sm">No appointments yet</p></div>
                )}
                {doctorAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center font-bold text-blue-700 text-sm flex-shrink-0">
                      {apt.patientName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{apt.patientName}</p>
                      <p className="text-xs text-gray-500 truncate">{apt.reason}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10} /> {apt.date}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} /> {apt.time}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 ${STATUS_CONFIG[apt.status].color}`}>
                      {STATUS_CONFIG[apt.status].icon}{STATUS_CONFIG[apt.status].label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "patients" && (
              <div>
                <div className="p-4 border-b border-gray-50">
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={searchPatient} onChange={(e) => setSearchPatient(e.target.value)} placeholder="Search patients..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {filteredPatients.map((patient) => (
                    <div key={patient.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl flex items-center justify-center font-bold text-violet-700 text-sm flex-shrink-0">
                        {patient.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">{patient.name}</p>
                        <p className="text-xs text-gray-500">{patient.age}y · {patient.gender} · {patient.condition}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Last visit: {patient.lastVisit}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"><MessageCircle size={15} /></button>
                        <button className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition"><Video size={15} /></button>
                      </div>
                    </div>
                  ))}
                  {filteredPatients.length === 0 && (
                    <div className="py-12 text-center"><Users size={32} className="text-gray-300 mx-auto mb-3" /><p className="text-gray-400 text-sm">No patients found</p></div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Weekly Patients</h3>
              <TrendingUp size={16} className="text-emerald-600" />
            </div>
            <div className="flex items-end justify-between gap-1 h-28">
              {WEEKLY_DATA.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-600" style={{ height: `${(d.patients / maxPatients) * 100}%` }} />
                  <span className="text-xs text-gray-400">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {todayApts.slice(0, 3).map((apt, i) => (
                <div key={apt.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === 0 ? "bg-green-500" : "bg-blue-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{apt.patientName}</p>
                    <p className="text-xs text-gray-500">{apt.time}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>{i === 0 ? "Now" : "Next"}</span>
                </div>
              ))}
              {todayApts.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No appointments today</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Performance</h3>
            {[
              { label: "Patient Satisfaction", value: 96, color: "bg-emerald-500" },
              { label: "Appointments Completed", value: 88, color: "bg-blue-500" },
              { label: "On-Time Rate", value: 92, color: "bg-violet-500" },
            ].map((perf) => (
              <div key={perf.label} className="mb-3 last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">{perf.label}</span>
                  <span className="text-xs font-bold text-gray-800">{perf.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${perf.color} rounded-full`} style={{ width: `${perf.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
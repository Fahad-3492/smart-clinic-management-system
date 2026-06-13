import { useNavigate, useLocation } from "react-router";
import {
  Calendar, Clock, ChevronRight, Heart, Activity,
  Stethoscope, CheckCircle, AlertCircle, XCircle, Plus,
  FileText, Bell
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useApp } from "../context/AppContext";
import { useEffect, useState } from "react";
import { APPOINTMENTS } from "../data/mockData";

const STATUS_CONFIG = {
  confirmed: { icon: <CheckCircle size={14} />, color: "text-emerald-600 bg-emerald-50", label: "Confirmed" },
  pending: { icon: <AlertCircle size={14} />, color: "text-amber-600 bg-amber-50", label: "Pending" },
  cancelled: { icon: <XCircle size={14} />, color: "text-red-500 bg-red-50", label: "Cancelled" },
  completed: { icon: <CheckCircle size={14} />, color: "text-blue-600 bg-blue-50", label: "Completed" },
  booked: { icon: <CheckCircle size={14} />, color: "text-emerald-600 bg-emerald-50", label: "Booked" },
};

const HEALTH_METRICS = [
  { label: "Blood Pressure", value: "120/80", unit: "mmHg", status: "Normal", color: "text-green-600" },
  { label: "Heart Rate", value: "72", unit: "bpm", status: "Normal", color: "text-green-600" },
  { label: "Blood Sugar", value: "95", unit: "mg/dL", status: "Normal", color: "text-green-600" },
  { label: "BMI", value: "22.4", unit: "kg/m²", status: "Healthy", color: "text-green-600" },
];

export function PatientDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useApp();
  const urlTab = new URLSearchParams(location.search).get("tab") as "upcoming" | "past" | null;
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">(urlTab || "upcoming");
  const [dbAppointments, setDbAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (urlTab) setActiveTab(urlTab);
  }, [urlTab]);

  useEffect(() => {
    fetch(`http://localhost:5000/appointments/${currentUser?.id || 1}`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setDbAppointments(data); })
      .catch(() => {});
  }, []);

  const mockApts = APPOINTMENTS.filter(a => a.patientId === "p1");
  const formattedDbApts = dbAppointments.map((a: any) => ({
    id: String(a.appointment_id),
    doctorId: String(a.doctor_id),
    doctorName: a.doctorName || `Doctor ${a.doctor_id}`,
    patientId: String(a.patient_id),
    patientName: currentUser?.name || "Patient",
    date: a.appointment_date?.split("T")[0] || a.appointment_date,
    time: "09:00 AM",
    specialty: a.specialty || "Specialist",
    status: (a.status as any) || "booked",
    reason: "Appointment",
    doctorImage: "https://images.unsplash.com/photo-1627093143401-2ade923be6c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  }));

  const allAppointments = [...mockApts, ...formattedDbApts];
  const upcoming = allAppointments.filter(a => a.status !== "completed" && a.status !== "cancelled");
  const past = allAppointments.filter(a => a.status === "completed" || a.status === "cancelled");
  const nextAppointment = upcoming[0];

  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.confirmed;
  };

  return (
    <DashboardLayout title="Patient Dashboard">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-blue-200 text-sm mb-1">Good Morning,</p>
          <h2 className="text-white text-xl font-bold mb-4">{currentUser?.name ?? "Patient"} 👋</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate("/doctors")} className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-50 transition">
              <Plus size={16} /> Book Appointment
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/30 transition">
              <FileText size={16} /> View Records
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Appointments", value: allAppointments.length, icon: <Calendar size={20} />, color: "bg-blue-50 text-blue-600" },
          { label: "Upcoming", value: upcoming.length, icon: <Clock size={20} />, color: "bg-indigo-50 text-indigo-600" },
          { label: "Completed", value: past.filter(a => a.status === "completed").length, icon: <CheckCircle size={20} />, color: "bg-emerald-50 text-emerald-600" },
          { label: "Doctors Visited", value: new Set(allAppointments.map(a => a.doctorId)).size, icon: <Stethoscope size={20} />, color: "bg-violet-50 text-violet-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {nextAppointment && (
            <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Next Appointment</h3>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Upcoming</span>
              </div>
              <div className="flex items-center gap-4">
                <img src={nextAppointment.doctorImage} alt={nextAppointment.doctorName} className="w-14 h-14 rounded-2xl object-cover object-top" />
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{nextAppointment.doctorName}</p>
                  <p className="text-blue-600 text-sm">{nextAppointment.specialty}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500"><Calendar size={12} /> {nextAppointment.date}</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500"><Clock size={12} /> {nextAppointment.time}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold ${getStatusConfig(nextAppointment.status).color}`}>
                  {getStatusConfig(nextAppointment.status).icon}{getStatusConfig(nextAppointment.status).label}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {(["upcoming", "past"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3.5 text-sm font-medium capitalize transition-all ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-gray-700"}`}>
                  {tab} ({tab === "upcoming" ? upcoming.length : past.length})
                </button>
              ))}
            </div>
            <div className="divide-y divide-gray-50">
              {(activeTab === "upcoming" ? upcoming : past).map((apt) => (
                <div key={apt.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                  <img src={apt.doctorImage} alt={apt.doctorName} className="w-12 h-12 rounded-xl object-cover object-top" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{apt.doctorName}</p>
                    <p className="text-xs text-gray-500">{apt.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10} /> {apt.date}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} /> {apt.time}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusConfig(apt.status).color}`}>
                    {getStatusConfig(apt.status).icon}{getStatusConfig(apt.status).label}
                  </div>
                </div>
              ))}
              {(activeTab === "upcoming" ? upcoming : past).length === 0 && (
                <div className="py-12 text-center">
                  <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No {activeTab} appointments</p>
                  {activeTab === "upcoming" && (
                    <button onClick={() => navigate("/doctors")} className="mt-3 text-blue-600 text-sm hover:underline">Book an appointment →</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Health Metrics</h3>
              <Activity size={18} className="text-blue-600" />
            </div>
            <div className="space-y-3">
              {HEALTH_METRICS.map((m) => (
                <div key={m.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500">{m.label}</p>
                    <p className="font-bold text-gray-800 text-sm">{m.value} <span className="font-normal text-gray-400 text-xs">{m.unit}</span></p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-green-50 ${m.color}`}>{m.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Book New Appointment", icon: <Plus size={16} />, action: () => navigate("/doctors"), color: "text-blue-600 bg-blue-50" },
                { label: "View Medical History", icon: <FileText size={16} />, action: () => {}, color: "text-violet-600 bg-violet-50" },
                { label: "Health Reminders", icon: <Bell size={16} />, action: () => {}, color: "text-amber-600 bg-amber-50" },
                { label: "Favorite Doctors", icon: <Heart size={16} />, action: () => {}, color: "text-red-500 bg-red-50" },
              ].map((action) => (
                <button key={action.label} onClick={action.action} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition text-left">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color}`}>{action.icon}</div>
                  <span className="text-sm text-gray-700 font-medium">{action.label}</span>
                  <ChevronRight size={14} className="ml-auto text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
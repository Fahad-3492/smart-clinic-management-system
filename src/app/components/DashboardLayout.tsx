import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Calendar, Users, Stethoscope,
  LogOut, Menu, Bell, ChevronRight, Settings, Heart,
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  tab?: string;
}

const patientNav: NavItem[] = [
  { label: "Dashboard", path: "/patient-dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Find Doctors", path: "/doctors", icon: <Stethoscope size={18} /> },
  { label: "Appointments", path: "/patient-dashboard?tab=appointments", icon: <Calendar size={18} />, tab: "appointments" },
];

const doctorNav: NavItem[] = [
  { label: "Dashboard", path: "/doctor-dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Appointments", path: "/doctor-dashboard?tab=appointments", icon: <Calendar size={18} />, tab: "appointments" },
  { label: "My Patients", path: "/doctor-dashboard?tab=patients", icon: <Users size={18} />, tab: "patients" },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", path: "/admin-dashboard?tab=overview", icon: <LayoutDashboard size={18} />, tab: "overview" },
  { label: "Manage Doctors", path: "/admin-dashboard?tab=doctors", icon: <Stethoscope size={18} />, tab: "doctors" },
  { label: "All Patients", path: "/admin-dashboard?tab=patients", icon: <Users size={18} />, tab: "patients" },
  { label: "Appointments", path: "/admin-dashboard?tab=appointments", icon: <Calendar size={18} />, tab: "appointments" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { currentUser, setCurrentUser } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(3);

  const navItems =
    currentUser?.role === "admin" ? adminNav :
    currentUser?.role === "doctor" ? doctorNav : patientNav;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  const roleColors = {
    patient: "from-blue-600 to-blue-700",
    doctor: "from-emerald-600 to-emerald-700",
    admin: "from-violet-600 to-violet-700",
  };

  const roleColor = currentUser ? roleColors[currentUser.role] : "from-blue-600 to-blue-700";
  const currentTab = new URLSearchParams(location.search).get("tab");

  const isActive = (item: NavItem) => {
    if (item.tab) return currentTab === item.tab;
    return location.pathname === item.path && !currentTab;
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className={`px-6 py-5 bg-gradient-to-r ${roleColor}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Heart size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">SmartClinic</p>
              <p className="text-white/70 text-xs capitalize">{currentUser?.role} Portal</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {currentUser?.name?.charAt(0) ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{currentUser?.name ?? "User"}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser?.email ?? ""}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Menu</p>
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link key={item.label} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                <span className={active ? "text-white" : "text-gray-400"}>{item.icon}</span>
                <span>{item.label}</span>
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100 space-y-1">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 w-full">
            <Settings size={18} className="text-gray-400" />Settings
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full">
            <LogOut size={18} />Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-800 font-semibold text-lg">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{notifications}</span>
              )}
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              {currentUser?.name?.charAt(0) ?? "U"}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
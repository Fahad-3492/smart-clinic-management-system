import { useNavigate } from "react-router";
import {
  Star, Clock, Search, Filter, Heart,
  ChevronRight, Award, Users, Calendar, ArrowLeft, MapPin
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useState } from "react";
import { DOCTORS } from "../data/mockData";

const SPECIALTIES = ["All", "Cardiologist", "Dermatologist", "Neurologist", "Pediatrician", "General Physician", "Orthopedist"];

export function DoctorsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useApp();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = DOCTORS.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialty === "All" || d.specialty === specialty;
    const matchAvailable = !availableOnly || d.available;
    return matchSearch && matchSpecialty && matchAvailable;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pt-8 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            {isAuthenticated && (
              <button onClick={() => navigate(currentUser?.role === "patient" ? "/patient-dashboard" : "/doctor-dashboard")} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition">
                <ArrowLeft size={18} />
              </button>
            )}
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <Heart size={16} className="text-white" />
                </div>
                <span className="text-white font-bold">SmartClinic</span>
              </div>
            )}
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">Find Your Doctor</h1>
          <p className="text-blue-200 text-sm mb-8">Choose from 200+ certified specialists</p>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search doctors, specialties..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-none outline-none text-gray-800 placeholder-gray-400 shadow-lg" />
            </div>
            <button onClick={() => setAvailableOnly(!availableOnly)} className={`px-4 py-3.5 rounded-2xl font-medium text-sm transition-all shadow-lg flex items-center gap-2 ${availableOnly ? "bg-blue-900 text-white" : "bg-white text-gray-700"}`}>
              <Filter size={16} />
              <span className="hidden sm:inline">Available</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 pb-12">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Doctors", value: "200+", icon: <Users size={20} className="text-blue-600" /> },
            { label: "Specialties", value: "25+", icon: <Award size={20} className="text-indigo-600" /> },
            { label: "Appointments", value: "50K+", icon: <Calendar size={20} className="text-emerald-600" /> },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">{stat.icon}</div>
              <div>
                <p className="font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {SPECIALTIES.map((s) => (
            <button key={s} onClick={() => setSpecialty(s)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${specialty === s ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600 text-sm"><span className="font-semibold text-gray-800">{filtered.length}</span> doctors found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-5 pb-0">
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${doctor.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {doctor.available ? "● Available Today" : "● Unavailable"}
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition"><Heart size={16} /></button>
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-2xl object-cover object-top shadow-md" />
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                      <Award size={12} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-gray-800 mb-0.5">{doctor.name}</h3>
                  <p className="text-blue-600 text-sm font-medium">{doctor.specialty}</p>
                  <div className="flex items-center justify-center gap-1 mt-1.5">
                    <MapPin size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Smart Clinic, New York</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 rounded-xl p-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-gray-800">{doctor.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{doctor.reviews} reviews</p>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <p className="text-sm font-bold text-gray-800">{doctor.experience}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Experience</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800">{doctor.patients.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Patients</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Consultation Fee</p>
                    <p className="font-bold text-gray-800">${doctor.fee}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/book/${doctor.id}`)}
                    disabled={!doctor.available}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${doctor.available ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                  >
                    {doctor.available ? (<>Book Now <ChevronRight size={14} /></>) : "Unavailable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

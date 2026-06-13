import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft, Calendar, Clock, Star, Award, CheckCircle,
  ChevronLeft, ChevronRight, User, FileText
} from "lucide-react";
import { DOCTORS, TIME_SLOTS } from "../data/mockData";
import { useApp } from "../context/AppContext";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function BookAppointmentPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  // Find doctor from mock data, fallback to first doctor
  const doctor = DOCTORS.find((d) => d.id === doctorId) ?? DOCTORS[0];

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  };

  const isPastDate = (day: number) => {
    const date = new Date(year, month, day);
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const formattedDate = selectedDate
    ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
    : "";

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;
    setLoading(true);

    try {
      // Get numeric doctor ID for DB
      const numericDoctorId = doctorId?.replace("d", "") || "1";
      
      const response = await fetch('http://localhost:5000/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: Number(currentUser?.id) || 1,
          doctor_id: Number(numericDoctorId),
          appointment_date: formattedDate
        })
      });

      if (response.ok) {
        setStep(3);
      } else {
        const err = await response.text();
        alert("Booking Failed: " + err);
      }
    } catch (error) {
      alert("Server Error — make sure backend is running");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate("/doctors")} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-white font-bold text-lg">Book Appointment</h1>
            <p className="text-blue-200 text-xs">with {doctor.name}</p>
          </div>
        </div>
      </div>

      {step < 3 && (
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-0">
            {[
              { n: 1, label: "Select Date & Time" },
              { n: 2, label: "Confirm Details" },
              { n: 3, label: "Done" },
            ].map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= s.n ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {step > s.n ? <CheckCircle size={16} /> : s.n}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step >= s.n ? "text-blue-700" : "text-gray-400"}`}>{s.label}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 mx-3 ${step > s.n ? "bg-blue-600" : "bg-gray-200"}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-sm border border-gray-100">
          <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-2xl object-cover object-top" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">{doctor.name}</h3>
            <p className="text-blue-600 text-sm">{doctor.specialty}</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-gray-600">{doctor.rating} ({doctor.reviews})</span>
              </div>
              <div className="flex items-center gap-1">
                <Award size={12} className="text-blue-500" />
                <span className="text-xs text-gray-600">{doctor.experience}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Fee</p>
            <p className="font-bold text-blue-600">${doctor.fee}</p>
          </div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition"><ChevronLeft size={18} /></button>
                <h3 className="font-semibold text-gray-800">{MONTHS[month]} {year}</h3>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition"><ChevronRight size={18} /></button>
              </div>
              <div className="grid grid-cols-7 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const past = isPastDate(day);
                  const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                  const selected = selectedDate === day;
                  return (
                    <button
                      key={day}
                      onClick={() => !past && setSelectedDate(day)}
                      disabled={past}
                      className={`w-full aspect-square rounded-xl text-sm font-medium transition-all ${selected ? "bg-blue-600 text-white shadow-md" : isToday ? "bg-blue-50 text-blue-700 border border-blue-200" : past ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-blue-50"}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">
                Select Time {selectedDate && <span className="text-blue-600 text-sm font-normal">— {MONTHS[month]} {selectedDate}</span>}
              </h3>
              {!selectedDate ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                  <Calendar size={32} className="mb-3 opacity-40" />
                  <p className="text-sm">Please select a date first</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${selectedTime === slot ? "bg-blue-600 text-white shadow-md" : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200"}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Describe your symptoms..." rows={3} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <button onClick={() => setStep(2)} disabled={!selectedDate || !selectedTime} className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200">
                Continue to Review
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
              <h3 className="font-bold text-gray-800 mb-5">Review Appointment</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Calendar size={18} className="text-white" /></div>
                  <div><p className="text-xs text-gray-500">Date</p><p className="font-semibold text-gray-800">{MONTHS[month]} {selectedDate}, {year}</p></div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"><Clock size={18} className="text-white" /></div>
                  <div><p className="text-xs text-gray-500">Time</p><p className="font-semibold text-gray-800">{selectedTime}</p></div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center"><User size={18} className="text-white" /></div>
                  <div><p className="text-xs text-gray-500">Patient</p><p className="font-semibold text-gray-800">{currentUser?.name ?? "Guest"}</p></div>
                </div>
                {reason && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gray-500 rounded-xl flex items-center justify-center flex-shrink-0"><FileText size={18} className="text-white" /></div>
                    <div><p className="text-xs text-gray-500">Reason</p><p className="font-medium text-gray-800 text-sm">{reason}</p></div>
                  </div>
                )}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <span className="font-semibold text-gray-700">Consultation Fee</span>
                  <span className="font-bold text-green-700">${doctor.fee}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50">Go Back</button>
              <button onClick={handleConfirm} disabled={loading} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto text-center py-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h2 className="text-gray-800 mb-2">Appointment Booked!</h2>
            <p className="text-gray-500 text-sm mb-8">
              Your appointment with <span className="font-semibold text-gray-700">{doctor.name}</span> on{" "}
              <span className="font-semibold text-gray-700">{MONTHS[month]} {selectedDate}</span> at{" "}
              <span className="font-semibold text-gray-700">{selectedTime}</span> has been confirmed.
            </p>
            <div className="bg-blue-50 rounded-2xl p-5 mb-8 text-left border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-3">Appointment Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Doctor</span><span className="font-medium text-gray-800">{doctor.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium text-gray-800">{MONTHS[month]} {selectedDate}, {year}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium text-gray-800">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-medium text-green-600">● Confirmed</span></div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate("/doctors")} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50">Browse Doctors</button>
              <button onClick={() => navigate("/patient-dashboard")} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md shadow-blue-200">View Dashboard</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

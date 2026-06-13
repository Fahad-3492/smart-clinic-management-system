export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: string;
  fee: number;
  available: boolean;
  image: string;
  email: string;
  phone: string;
  bio: string;
  patients: number;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  specialty: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  reason: string;
  doctorImage: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  condition: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. James Carter",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 312,
    experience: "15 years",
    fee: 150,
    available: true,
    image: "https://images.unsplash.com/photo-1627093143401-2ade923be6c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    email: "j.carter@smartclinic.com",
    phone: "+1 (555) 201-3344",
    bio: "Specialist in cardiovascular diseases with 15 years of clinical experience at top hospitals.",
    patients: 1240,
  },
  {
    id: "d2",
    name: "Dr. Sophia Lee",
    specialty: "Dermatologist",
    rating: 4.8,
    reviews: 245,
    experience: "10 years",
    fee: 120,
    available: true,
    image: "https://images.unsplash.com/photo-1733685372930-ee012533a876?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    email: "s.lee@smartclinic.com",
    phone: "+1 (555) 202-5566",
    bio: "Expert in skin conditions, cosmetic dermatology, and advanced laser treatments.",
    patients: 980,
  },
  {
    id: "d3",
    name: "Dr. Michael Reyes",
    specialty: "Neurologist",
    rating: 4.7,
    reviews: 198,
    experience: "12 years",
    fee: 175,
    available: false,
    image: "https://images.unsplash.com/photo-1645066928295-2506defde470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    email: "m.reyes@smartclinic.com",
    phone: "+1 (555) 203-7788",
    bio: "Specializes in neurological disorders, epilepsy management, and brain imaging diagnostics.",
    patients: 760,
  },
  {
    id: "d4",
    name: "Dr. Emma Wilson",
    specialty: "Pediatrician",
    rating: 4.9,
    reviews: 421,
    experience: "8 years",
    fee: 100,
    available: true,
    image: "https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    email: "e.wilson@smartclinic.com",
    phone: "+1 (555) 204-9900",
    bio: "Dedicated to children's health from newborns to adolescents with a compassionate approach.",
    patients: 1850,
  },
  {
    id: "d5",
    name: "Dr. Priya Sharma",
    specialty: "General Physician",
    rating: 4.6,
    reviews: 287,
    experience: "9 years",
    fee: 80,
    available: true,
    image: "https://images.unsplash.com/photo-1670191247079-f9713ae06dcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    email: "p.sharma@smartclinic.com",
    phone: "+1 (555) 205-1122",
    bio: "Holistic care provider focused on preventive medicine, chronic disease management, and patient wellness.",
    patients: 2100,
  },
  {
    id: "d6",
    name: "Dr. David Kim",
    specialty: "Orthopedist",
    rating: 4.8,
    reviews: 156,
    experience: "14 years",
    fee: 160,
    available: true,
    image: "https://images.unsplash.com/photo-1627093143401-2ade923be6c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    email: "d.kim@smartclinic.com",
    phone: "+1 (555) 206-3344",
    bio: "Specialist in joint replacements, sports injuries, and minimally invasive orthopedic procedures.",
    patients: 890,
  },
];

export const APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    doctorId: "d1",
    doctorName: "Dr. James Carter",
    patientId: "p1",
    patientName: "Alex Johnson",
    date: "2026-05-10",
    time: "10:00 AM",
    specialty: "Cardiologist",
    status: "confirmed",
    reason: "Chest pain and shortness of breath",
    doctorImage: "https://images.unsplash.com/photo-1627093143401-2ade923be6c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "a2",
    doctorId: "d4",
    doctorName: "Dr. Emma Wilson",
    patientId: "p1",
    patientName: "Alex Johnson",
    date: "2026-05-15",
    time: "02:00 PM",
    specialty: "Pediatrician",
    status: "pending",
    reason: "Annual health checkup",
    doctorImage: "https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "a3",
    doctorId: "d2",
    doctorName: "Dr. Sophia Lee",
    patientId: "p1",
    patientName: "Alex Johnson",
    date: "2026-04-28",
    time: "11:30 AM",
    specialty: "Dermatologist",
    status: "completed",
    reason: "Skin rash evaluation",
    doctorImage: "https://images.unsplash.com/photo-1733685372930-ee012533a876?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "a4",
    doctorId: "d1",
    doctorName: "Dr. James Carter",
    patientId: "p2",
    patientName: "Maria Garcia",
    date: "2026-05-10",
    time: "11:00 AM",
    specialty: "Cardiologist",
    status: "confirmed",
    reason: "Follow-up after ECG",
    doctorImage: "https://images.unsplash.com/photo-1627093143401-2ade923be6c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "a5",
    doctorId: "d1",
    doctorName: "Dr. James Carter",
    patientId: "p3",
    patientName: "Robert Chen",
    date: "2026-05-11",
    time: "09:00 AM",
    specialty: "Cardiologist",
    status: "pending",
    reason: "High blood pressure consultation",
    doctorImage: "https://images.unsplash.com/photo-1627093143401-2ade923be6c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "a6",
    doctorId: "d1",
    doctorName: "Dr. James Carter",
    patientId: "p4",
    patientName: "Sarah Williams",
    date: "2026-04-25",
    time: "03:00 PM",
    specialty: "Cardiologist",
    status: "completed",
    reason: "Post-surgery review",
    doctorImage: "https://images.unsplash.com/photo-1627093143401-2ade923be6c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
];

export const PATIENTS: Patient[] = [
  { id: "p1", name: "Alex Johnson", email: "alex@email.com", age: 34, gender: "Male", phone: "+1 555-1234", lastVisit: "2026-04-28", condition: "Hypertension" },
  { id: "p2", name: "Maria Garcia", email: "maria@email.com", age: 45, gender: "Female", phone: "+1 555-5678", lastVisit: "2026-05-01", condition: "Arrhythmia" },
  { id: "p3", name: "Robert Chen", email: "robert@email.com", age: 52, gender: "Male", phone: "+1 555-9012", lastVisit: "2026-04-15", condition: "High Blood Pressure" },
  { id: "p4", name: "Sarah Williams", email: "sarah@email.com", age: 28, gender: "Female", phone: "+1 555-3456", lastVisit: "2026-04-25", condition: "Post-Surgery" },
  { id: "p5", name: "Tom Baker", email: "tom@email.com", age: 61, gender: "Male", phone: "+1 555-7890", lastVisit: "2026-05-02", condition: "Coronary Disease" },
];

export const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
];

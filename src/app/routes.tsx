import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DoctorsPage } from "./pages/DoctorsPage";
import { BookAppointmentPage } from "./pages/BookAppointmentPage";
import { PatientDashboard } from "./pages/PatientDashboard";
import { DoctorDashboard } from "./pages/DoctorDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  { path: "/", Component: LoginPage },
  { path: "/signup", Component: SignupPage },
  { path: "/doctors", Component: DoctorsPage },
  { path: "/book/:doctorId", Component: BookAppointmentPage },
  { path: "/patient-dashboard", Component: PatientDashboard },
  { path: "/doctor-dashboard", Component: DoctorDashboard },
  { path: "/admin-dashboard", Component: AdminDashboard },
  { path: "*", Component: LoginPage },
]);
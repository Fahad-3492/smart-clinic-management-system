import React, { createContext, useContext, useState, ReactNode } from "react";
import { APPOINTMENTS, Appointment } from "../data/mockData";

export type UserRole = "patient" | "doctor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  appointments: Appointment[];
  addAppointment: (apt: Appointment) => void;
  isAuthenticated: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(APPOINTMENTS);

  const addAppointment = (apt: Appointment) => {
    setAppointments((prev) => [...prev, apt]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        appointments,
        addAppointment,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

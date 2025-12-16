import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/axios";

const CoreDataContext = createContext();

export function CoreDataProvider({ children }) {
  const [departments, setDepartments] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoreData();
  }, []);

  const loadCoreData = async () => {
    try {
      const [deptRes, hostelRes] = await Promise.all([
        api.get("/api/core/departments/"),
        api.get("/api/core/hostels/"),
      ]);

      setDepartments(deptRes.data);
      setHostels(hostelRes.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoreDataContext.Provider
      value={{ departments, hostels, loading }}
    >
      {children}
    </CoreDataContext.Provider>
  );
}

export const useCoreData = () => useContext(CoreDataContext);


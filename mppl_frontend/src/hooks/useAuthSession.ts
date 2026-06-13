import { useState, useEffect } from "react";

interface UserSession {
  id: number;
  name: string;
  email: string;
  role: string;
  profile: string;
  nim_nip: string | null;
  alamat: string | null;
  fakultas_id: number | null;
  program_studi_id: number | null;
}

export function useAuthSession() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<UserSession | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/auth/login");
  };

  return { token, user, logout };
}

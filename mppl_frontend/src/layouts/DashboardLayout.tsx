import React, { useState, useEffect } from "react";
import NavbarMain from "../components/NavbarMain";
import SidebarMain from "../components/SidebarMain";
import { useNavigate } from "react-router-dom";
import FooterMain from "../components/FooterMain";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapse, setIsSidebarCollapse] = useState<boolean>(false);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const navigate = useNavigate();

  const [userData, setUserData] = useState<{
    name: string;
    role: "admin" | "kerumahtanggaan" | "umum";
  }>({ name: "Guest", role: "umum" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          name: parsedUser.name || "User",
          role: parsedUser.role || "umum",
        });
      } catch (error) {
        console.error("Gagal membaca JSON user data:", error);
      }
    }
  }, []);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsOpenMobile(!isOpenMobile);
    } else {
      setIsSidebarCollapse(!isSidebarCollapse);
    }
  };

  const handleLogout = async () => {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      await fetch("http://localhost:8080/api/auth/logout", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
      });
    }
  } catch (error) {
    console.error("Gagal menghubungi server saat logout:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  }
};

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      <NavbarMain
        onToggleSidebar={handleToggleSidebar}
        userName={userData.name}
        userRole={userData.role}
      />

      <div className="flex flex-1 pt-16 relative">
        <SidebarMain
          isCollapse={isSidebarCollapse}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
          userName={userData.name}
          userRole={userData.role}
          onLogout={handleLogout}
        />

        <main
          className={`flex-1 transition-all duration-300 w-full overflow-x-hidden ${
            isSidebarCollapse ? "lg:pl-20" : "lg:pl-64"
          }`}
        >
          {children}
          <FooterMain />
        </main>
      </div>
    </div>
  );
}

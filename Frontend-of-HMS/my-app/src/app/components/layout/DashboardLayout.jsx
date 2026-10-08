"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileSidebar from "./MobileSidebar";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check for authentication token — redirect to login if missing
    const token = localStorage.getItem("hms_token");
    if (!token) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  // Show nothing while checking auth to avoid flash of dashboard
  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4ED]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0F766E] border-t-transparent" />
          <p className="text-sm text-[#7B8882]">Checking session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F4ED] dark:bg-[#0E1513] text-[#17201D] dark:text-[#EAEFEA]">

      {/* Desktop Sidebar */}

      <div className="hidden h-screen shrink-0 lg:block lg:sticky lg:top-0">
        <Sidebar />
      </div>


      {/* Mobile Sidebar */}

      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />


      {/* Main Application */}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">

        {/* Navbar */}

        <Navbar
          onMenuClick={() => setMobileOpen(true)}
        />


        {/* Page Content */}

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">

          <div className="mx-auto w-full max-w-[1800px]">

            <Breadcrumb />

            {children}

          </div>

        </main>


        {/* Footer */}

        <Footer />

      </div>

    </div>
  );
}
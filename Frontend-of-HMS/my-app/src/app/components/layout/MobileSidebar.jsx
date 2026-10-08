"use client";

import Sidebar from "./Sidebar";

export default function MobileSidebar({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] lg:hidden">

      {/* Overlay */}

      <button
        onClick={onClose}
        aria-label="Close sidebar"
        className="absolute inset-0 bg-[#17201D]/60 backdrop-blur-sm"
      />

      {/* Sidebar */}

      <div className="relative z-10 h-full w-[285px] shadow-2xl">

        <Sidebar
          mobile
          onClose={onClose}
        />

      </div>

    </div>
  );
}
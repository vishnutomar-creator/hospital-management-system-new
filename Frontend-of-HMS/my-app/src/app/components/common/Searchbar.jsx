"use client";

import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="relative w-full">

      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9691]"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded-xl
          border border-[#DDD9CE]
          bg-white
          py-3 pl-11 pr-11
          text-sm text-[#17201D]
          outline-none
          placeholder:text-[#9AA49F]
          transition
          focus:border-[#0F766E]
          focus:ring-4
          focus:ring-[#0F766E]/10
        "
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8A9691] transition hover:bg-[#F1F3EF] hover:text-[#17201D]"
        >
          <X size={16} />
        </button>
      )}

    </div>
  );
}
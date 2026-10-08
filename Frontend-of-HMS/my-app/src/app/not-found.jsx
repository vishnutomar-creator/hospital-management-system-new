import Link from "next/link";
import { Home, Search } from "lucide-react";

export const metadata = {
  title: "Page Not Found — HMS",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#F7F6F2] px-4 text-center dark:bg-[#0F1712]">
      <div className="relative">
        <p className="text-[120px] font-black leading-none text-[#0F766E]/10 dark:text-[#5EEAD4]/10 select-none">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <Search size={48} className="text-[#0F766E] dark:text-[#5EEAD4]" />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">Page Not Found</h1>
        <p className="mt-2 max-w-sm text-sm text-[#7B8882] dark:text-[#87938E]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]"
      >
        <Home size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}

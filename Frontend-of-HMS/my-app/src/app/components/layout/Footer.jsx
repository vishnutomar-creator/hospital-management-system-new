export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E5E2D9] bg-white px-5 py-4 md:px-6 dark:border-white/10 dark:bg-[#17201D]">

      <div className="flex flex-col items-center justify-between gap-2 text-xs text-[#87938E] sm:flex-row">

        <p>
          © {new Date().getFullYear()} MediCare Hospital Management System
        </p>

        <div className="flex items-center gap-4">

          <span>
            Secure & Reliable
          </span>

          <span className="h-1 w-1 rounded-full bg-[#B8BFBB]" />

          <span>
            v1.0.0
          </span>

        </div>

      </div>

    </footer>
  );
}
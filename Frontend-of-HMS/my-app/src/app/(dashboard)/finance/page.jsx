"use client";

import Link from "next/link";
import { BookOpen, ArrowDownCircle, ArrowUpCircle, ArrowRight } from "lucide-react";

const sections = [
  {
    title: "General Ledger",
    description: "All debit and credit transactions across accounts",
    href: "/finance/general-ledger",
    icon: BookOpen,
    stat: "1,204 entries",
  },
  {
    title: "Accounts Receivable",
    description: "Amounts owed to the hospital by patients",
    href: "/finance/accounts-receivable",
    icon: ArrowDownCircle,
    stat: "₹4.2L outstanding",
  },
  {
    title: "Accounts Payable",
    description: "Amounts owed by the hospital to suppliers",
    href: "/finance/accounts-payable",
    icon: ArrowUpCircle,
    stat: "₹2.8L due",
  },
];

export default function FinancePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Finance</h1>
        <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">General ledger, receivables, and payables</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col justify-between rounded-2xl border border-[#E5E2D9] bg-white p-5 transition hover:border-[#0F766E] hover:shadow-lg hover:shadow-black/5 dark:border-white/10 dark:bg-[#17201D] dark:hover:border-[#0F766E]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                    <Icon size={20} />
                  </div>
                  <ArrowRight size={17} className="text-[#B8BFBB] transition group-hover:translate-x-0.5 group-hover:text-[#0F766E] dark:group-hover:text-[#5EEAD4]" />
                </div>
                <h2 className="mt-4 text-base font-bold text-[#17201D] dark:text-white">{section.title}</h2>
                <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">{section.description}</p>
              </div>
              <p className="mt-5 text-xs font-semibold text-[#0F766E] dark:text-[#5EEAD4]">{section.stat}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
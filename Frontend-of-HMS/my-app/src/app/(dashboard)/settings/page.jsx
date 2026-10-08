"use client";

import { useState } from "react";
import {
  Building2,
  UserRound,
  BellRing,
  ShieldCheck,
  Users,
  CreditCard,
  Plug,
  Upload,
  Check,
  Smartphone,
  Mail,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  KeyRound,
  Pencil,
  X,
} from "lucide-react";

/* ----------------------------- Nav Config ------------------------------ */

const sections = [
  { id: "general", label: "General", icon: Building2 },
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "notifications", label: "Notifications", icon: BellRing },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "roles", label: "Roles & Access", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "integrations", label: "Integrations", icon: Plug },
];

const accessTabs = [
  { id: "users", label: "Users", icon: UserRound },
  { id: "roles", label: "Roles", icon: ShieldCheck },
  { id: "permissions", label: "Permissions", icon: KeyRound },
];

/* ------------------------------ Bits/UI -------------------------------- */

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative h-6 w-11 shrink-0 rounded-full transition
        ${checked ? "bg-[#0F766E]" : "bg-[#E3E0D7] dark:bg-white/15"}
      `}
    >
      <span
        className={`
          absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition
          ${checked ? "left-[22px]" : "left-0.5"}
        `}
      />
    </button>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 py-4 sm:grid-cols-3 sm:gap-6 sm:py-5">
      <div>
        <p className="text-sm font-semibold text-[#17201D] dark:text-white">
          {label}
        </p>
        {hint && (
          <p className="mt-0.5 text-xs text-[#87938E]">{hint}</p>
        )}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function Row({ children }) {
  return (
    <div className="border-b border-[#EEECE5] px-5 first:pt-0 last:border-b-0 dark:border-white/10">
      {children}
    </div>
  );
}

function Card({ title, description, children, footer }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
      {(title || description) && (
        <div className="border-b border-[#EEECE5] px-5 py-4 dark:border-white/10">
          {title && (
            <h2 className="font-semibold text-[#17201D] dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-0.5 text-sm text-[#7B8882] dark:text-[#87938E]">
              {description}
            </p>
          )}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="flex justify-end gap-2 border-t border-[#EEECE5] bg-[#FAFAF7] px-5 py-3.5 dark:border-white/10 dark:bg-[#12100C]/0">
          {footer}
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3.5 py-2.5 text-sm text-[#17201D] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white";

const btnPrimary =
  "rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90";

const btnGhost =
  "rounded-xl border border-[#E3E0D7] bg-white px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:bg-[#17201D] dark:text-[#AAB6B0] dark:hover:bg-white/5";

function SubTabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 rounded-xl bg-[#F1F3EF] p-1 dark:bg-white/5">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`
              flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-semibold transition
              ${
                isActive
                  ? "bg-white text-[#0F766E] shadow-sm dark:bg-[#17201D] dark:text-[#5EEAD4]"
                  : "text-[#64746E] dark:text-[#AAB6B0]"
              }
            `}
          >
            <Icon size={14} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------- Page -------------------------------- */

export default function SettingsPage() {
  const [active, setActive] = useState("general");
  const [showPassword, setShowPassword] = useState(false);

  const [hospitalName, setHospitalName] = useState("Sunrise Multispecialty Hospital");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [currency, setCurrency] = useState("INR (₹)");

  const [notif, setNotif] = useState({
    lowStock: true,
    appointments: true,
    payroll: false,
    payments: true,
    push: true,
    email: true,
    sms: false,
  });

  const [twoFactor, setTwoFactor] = useState(true);

  const [accessTab, setAccessTab] = useState("users");

  const users = [
    { name: "Dr. Shreya Iyer", email: "shreya.iyer@hospital.org", role: "Physician", status: "Active" },
    { name: "Anil Kulkarni", email: "anil.kulkarni@hospital.org", role: "Pharmacist", status: "Active" },
    { name: "Rahul Verma", email: "rahul.verma@hospital.org", role: "HR Manager", status: "Active" },
    { name: "Vikram Singh", email: "vikram.singh@hospital.org", role: "Finance Officer", status: "Active" },
    { name: "Neha Kapoor", email: "neha.kapoor@hospital.org", role: "Asset Manager", status: "Invited" },
  ];

  const roleDefs = [
    { name: "Admin", description: "Full access to every module, including billing and settings.", members: 2, system: true },
    { name: "Physician", description: "Manage appointments, patient records, and prescriptions.", members: 8, system: false },
    { name: "Pharmacist", description: "Manage inventory, batches, and dispensing records.", members: 4, system: false },
    { name: "HR Manager", description: "Manage staff, leave requests, and payroll.", members: 2, system: false },
    { name: "Finance Officer", description: "Manage billing, payments, and financial reports.", members: 3, system: false },
    { name: "Asset Manager", description: "Manage equipment, maintenance, and asset tickets.", members: 1, system: false },
  ];

  const permissionModules = ["Appointments", "Inventory", "HR", "Finance", "Assets"];
  const permissionRoles = ["Admin", "Physician", "Pharmacist", "HR Manager", "Finance Officer"];
  const defaultPerms = {
    Admin: { Appointments: true, Inventory: true, HR: true, Finance: true, Assets: true },
    Physician: { Appointments: true, Inventory: false, HR: false, Finance: false, Assets: false },
    Pharmacist: { Appointments: false, Inventory: true, HR: false, Finance: false, Assets: false },
    "HR Manager": { Appointments: false, Inventory: false, HR: true, Finance: false, Assets: false },
    "Finance Officer": { Appointments: false, Inventory: false, HR: false, Finance: true, Assets: false },
  };
  const [perms, setPerms] = useState(defaultPerms);

  const togglePerm = (role, mod) =>
    setPerms((prev) => ({
      ...prev,
      [role]: { ...prev[role], [mod]: !prev[role][mod] },
    }));

  const integrations = [
    { name: "WhatsApp Business", desc: "Appointment reminders and confirmations.", connected: true },
    { name: "Razorpay", desc: "Accept online payments against bills.", connected: true },
    { name: "Google Calendar", desc: "Sync physician schedules two-way.", connected: false },
    { name: "Tally", desc: "Push finance ledgers for reconciliation.", connected: false },
  ];

  const toggleNotif = (key) =>
    setNotif((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Settings
        </span>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
          Manage how your hospital, team, and account are configured.
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Side Nav */}
        <div className="shrink-0 lg:w-56">
          <div className="flex gap-1 overflow-x-auto rounded-2xl border border-[#E5E2D9] bg-white p-1.5 lg:flex-col lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 dark:border-white/10 dark:bg-[#17201D]">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`
                    flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold transition
                    lg:w-full
                    ${
                      isActive
                        ? "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
                        : "text-[#64746E] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/5"
                    }
                  `}
                >
                  <Icon size={16} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-5">
          {active === "general" && (
            <Card
              title="Hospital details"
              description="This information appears on invoices, receipts, and patient-facing pages."
              footer={
                <>
                  <button className={btnGhost}>Cancel</button>
                  <button className={btnPrimary}>Save changes</button>
                </>
              }
            >
              <Row>
                <Field label="Hospital name">
                  <input
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </Row>
              <Row>
                <Field label="Logo" hint="PNG or SVG, at least 256×256px.">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1F3EF] text-[#8A9691] dark:bg-white/10">
                      <Building2 size={22} />
                    </div>
                    <button className={btnGhost}>
                      <span className="flex items-center gap-2">
                        <Upload size={15} />
                        Upload logo
                      </span>
                    </button>
                  </div>
                </Field>
              </Row>
              <Row>
                <Field label="Timezone">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className={inputCls}
                  >
                    <option>Asia/Kolkata (IST)</option>
                    <option>Asia/Dubai (GST)</option>
                    <option>Europe/London (GMT)</option>
                    <option>America/New_York (EST)</option>
                  </select>
                </Field>
              </Row>
              <Row>
                <Field label="Currency">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={inputCls}
                  >
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>AED (د.إ)</option>
                    <option>EUR (€)</option>
                  </select>
                </Field>
              </Row>
            </Card>
          )}

          {active === "profile" && (
            <Card
              title="Your profile"
              description="This is how you appear to other staff on the platform."
              footer={
                <>
                  <button className={btnGhost}>Cancel</button>
                  <button className={btnPrimary}>Save changes</button>
                </>
              }
            >
              <Row>
                <Field label="Full name">
                  <input defaultValue="Ananya Bhatt" className={inputCls} />
                </Field>
              </Row>
              <Row>
                <Field label="Email address">
                  <input
                    defaultValue="ananya.bhatt@hospital.org"
                    className={inputCls}
                  />
                </Field>
              </Row>
              <Row>
                <Field label="Phone number">
                  <input defaultValue="+91 98765 43210" className={inputCls} />
                </Field>
              </Row>
              <Row>
                <Field label="Designation">
                  <input defaultValue="Hospital Administrator" className={inputCls} />
                </Field>
              </Row>
            </Card>
          )}

          {active === "notifications" && (
            <>
              <Card
                title="Notify me about"
                description="Choose which events raise a notification."
              >
                <Row>
                  <Field label="Low stock alerts" hint="When inventory falls below the reorder level.">
                    <Toggle checked={notif.lowStock} onChange={() => toggleNotif("lowStock")} />
                  </Field>
                </Row>
                <Row>
                  <Field label="Appointments" hint="New bookings, reschedules, and no-shows.">
                    <Toggle checked={notif.appointments} onChange={() => toggleNotif("appointments")} />
                  </Field>
                </Row>
                <Row>
                  <Field label="Payroll" hint="When payroll runs are processed each month.">
                    <Toggle checked={notif.payroll} onChange={() => toggleNotif("payroll")} />
                  </Field>
                </Row>
                <Row>
                  <Field label="Payments" hint="When a bill is paid or a payment fails.">
                    <Toggle checked={notif.payments} onChange={() => toggleNotif("payments")} />
                  </Field>
                </Row>
              </Card>

              <Card title="Delivery methods" description="Where these notifications should reach you.">
                <Row>
                  <Field label="Push notifications">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-[#52615B] dark:text-[#AAB6B0]">
                        <Smartphone size={15} /> In-app and mobile push
                      </span>
                      <Toggle checked={notif.push} onChange={() => toggleNotif("push")} />
                    </div>
                  </Field>
                </Row>
                <Row>
                  <Field label="Email">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-[#52615B] dark:text-[#AAB6B0]">
                        <Mail size={15} /> ananya.bhatt@hospital.org
                      </span>
                      <Toggle checked={notif.email} onChange={() => toggleNotif("email")} />
                    </div>
                  </Field>
                </Row>
                <Row>
                  <Field label="SMS">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-[#52615B] dark:text-[#AAB6B0]">
                        <Smartphone size={15} /> +91 98765 43210
                      </span>
                      <Toggle checked={notif.sms} onChange={() => toggleNotif("sms")} />
                    </div>
                  </Field>
                </Row>
              </Card>
            </>
          )}

          {active === "security" && (
            <>
              <Card
                title="Password"
                description="Use a strong password you don't use elsewhere."
                footer={<button className={btnPrimary}>Update password</button>}
              >
                <Row>
                  <Field label="Current password">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        defaultValue="••••••••••"
                        className={`${inputCls} pr-10`}
                      />
                      <button
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87938E]"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>
                </Row>
                <Row>
                  <Field label="New password">
                    <input type="password" placeholder="At least 8 characters" className={inputCls} />
                  </Field>
                </Row>
                <Row>
                  <Field label="Confirm new password">
                    <input type="password" placeholder="Re-enter new password" className={inputCls} />
                  </Field>
                </Row>
              </Card>

              <Card title="Two-factor authentication" description="Add an extra layer of security to your account.">
                <Row>
                  <Field
                    label="Authenticator app"
                    hint={twoFactor ? "Enabled — using Google Authenticator." : "Not enabled."}
                  >
                    <Toggle checked={twoFactor} onChange={setTwoFactor} />
                  </Field>
                </Row>
              </Card>

              <Card title="Active sessions" description="Devices currently signed in to your account.">
                <Row>
                  <Field label="MacBook Pro — Chrome" hint="Bhopal, India · Active now">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F766E]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                      <Check size={11} /> This device
                    </span>
                  </Field>
                </Row>
                <Row>
                  <Field label="iPhone 15 — Claude App" hint="Bhopal, India · 2 hours ago">
                    <button className="text-sm font-semibold text-red-600 hover:underline dark:text-red-400">
                      Sign out
                    </button>
                  </Field>
                </Row>
              </Card>
            </>
          )}

          {active === "roles" && (
            <div className="space-y-5">
              <SubTabs tabs={accessTabs} active={accessTab} onChange={setAccessTab} />

              {accessTab === "users" && (
                <Card
                  title="Team members"
                  description="Everyone who has access to this hospital's account."
                  footer={
                    <button className={btnPrimary}>
                      <span className="flex items-center gap-2">
                        <Plus size={15} /> Invite member
                      </span>
                    </button>
                  }
                >
                  {users.map((u) => (
                    <Row key={u.email}>
                      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F3EF] text-sm font-semibold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                            {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-[#17201D] dark:text-white">
                                {u.name}
                              </p>
                              {u.status === "Invited" && (
                                <span className="rounded-full bg-[#FCEFC7] px-2 py-0.5 text-[11px] font-semibold text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]">
                                  Invited
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#87938E]">{u.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <select
                            defaultValue={u.role}
                            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
                          >
                            {roleDefs.map((r) => (
                              <option key={r.name}>{r.name}</option>
                            ))}
                          </select>
                          <button className="rounded-lg p-2 text-[#B8BFBB] transition hover:bg-[#F1F3EF] hover:text-red-600 dark:hover:bg-white/10">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </Row>
                  ))}
                </Card>
              )}

              {accessTab === "roles" && (
                <Card
                  title="Roles"
                  description="Define the roles staff can be assigned to."
                  footer={
                    <button className={btnPrimary}>
                      <span className="flex items-center gap-2">
                        <Plus size={15} /> Create role
                      </span>
                    </button>
                  }
                >
                  {roleDefs.map((r) => (
                    <Row key={r.name}>
                      <div className="flex items-center justify-between gap-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                            <ShieldCheck size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-[#17201D] dark:text-white">
                                {r.name}
                              </p>
                              {r.system && (
                                <span className="rounded-full bg-[#F1F3EF] px-2 py-0.5 text-[11px] font-semibold text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]">
                                  System
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#87938E]">
                              {r.description} · {r.members} {r.members === 1 ? "member" : "members"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button className="rounded-lg p-2 text-[#B8BFBB] transition hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:hover:bg-white/10">
                            <Pencil size={15} />
                          </button>
                          {!r.system && (
                            <button className="rounded-lg p-2 text-[#B8BFBB] transition hover:bg-[#F1F3EF] hover:text-red-600 dark:hover:bg-white/10">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    </Row>
                  ))}
                </Card>
              )}

              {accessTab === "permissions" && (
                <Card
                  title="Permissions"
                  description="Choose which modules each role can access."
                  footer={
                    <>
                      <button className={btnGhost}>Reset to defaults</button>
                      <button className={btnPrimary}>Save changes</button>
                    </>
                  }
                >
                  <div className="overflow-x-auto px-5 py-4">
                    <table className="w-full min-w-[560px] border-collapse text-sm">
                      <thead>
                        <tr>
                          <th className="pb-3 text-left font-semibold text-[#17201D] dark:text-white">
                            Module
                          </th>
                          {permissionRoles.map((role) => (
                            <th
                              key={role}
                              className="pb-3 text-center text-xs font-semibold text-[#64746E] dark:text-[#AAB6B0]"
                            >
                              {role}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {permissionModules.map((mod) => (
                          <tr
                            key={mod}
                            className="border-t border-[#EEECE5] dark:border-white/10"
                          >
                            <td className="py-3 font-medium text-[#17201D] dark:text-white">
                              {mod}
                            </td>
                            {permissionRoles.map((role) => (
                              <td key={role} className="py-3 text-center">
                                <button
                                  onClick={() =>
                                    role === "Admin" ? null : togglePerm(role, mod)
                                  }
                                  disabled={role === "Admin"}
                                  className={`
                                    mx-auto flex h-6 w-6 items-center justify-center rounded-md border transition
                                    ${
                                      perms[role][mod]
                                        ? "border-[#0F766E] bg-[#0F766E] text-white"
                                        : "border-[#E3E0D7] bg-[#FAFAF7] text-transparent dark:border-white/15 dark:bg-[#202B27]"
                                    }
                                    ${role === "Admin" ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
                                  `}
                                >
                                  <Check size={13} />
                                </button>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          )}

          {active === "billing" && (
            <>
              <Card title="Current plan" description="You're on the Growth plan, billed monthly.">
                <Row>
                  <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#17201D] dark:text-white">
                        Growth — ₹6,999/month
                      </p>
                      <p className="mt-0.5 text-xs text-[#87938E]">
                        Up to 25 staff accounts · Renews on Sep 1, 2026
                      </p>
                    </div>
                    <button className={btnGhost}>Change plan</button>
                  </div>
                </Row>
              </Card>

              <Card
                title="Payment method"
                footer={<button className={btnGhost}>Update payment method</button>}
              >
                <Row>
                  <div className="flex items-center gap-3 py-4">
                    <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-[#F1F3EF] text-xs font-bold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                      VISA
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#17201D] dark:text-white">
                        •••• •••• •••• 4821
                      </p>
                      <p className="text-xs text-[#87938E]">Expires 08/28</p>
                    </div>
                  </div>
                </Row>
              </Card>
            </>
          )}

          {active === "integrations" && (
            <Card title="Connected apps" description="Link third-party tools to your hospital workflows.">
              {integrations.map((i) => (
                <Row key={i.name}>
                  <div className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F3EF] text-[#8A9691] dark:bg-white/10">
                        <Plug size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#17201D] dark:text-white">
                          {i.name}
                        </p>
                        <p className="text-xs text-[#87938E]">{i.desc}</p>
                      </div>
                    </div>
                    <button
                      className={
                        i.connected
                          ? btnGhost
                          : "rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90"
                      }
                    >
                      {i.connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                </Row>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
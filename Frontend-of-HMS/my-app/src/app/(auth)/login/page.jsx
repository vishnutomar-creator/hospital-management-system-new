"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Hospital,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Activity,
  Users,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await login(formData.email, formData.password);
      router.push("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F4ED]">

      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <section className="relative hidden overflow-hidden bg-[#17201D] lg:flex">

          {/* Decorative shapes */}

          <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#0F766E]/20 blur-3xl" />

          <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-[#14B8A6]/10 blur-3xl" />

          <div className="absolute right-20 top-32 h-32 w-32 rounded-full border border-[#5EEAD4]/10" />

          <div className="absolute bottom-32 left-24 h-20 w-20 rounded-full border border-[#5EEAD4]/10" />


          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-12 xl:p-16">

            {/* LOGO */}

            <Link href="/" className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F766E] text-[#F7F4ED] shadow-lg shadow-black/20">
                <Hospital size={25} />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight text-[#F7F4ED]">
                  MediCare
                </h1>

                <p className="text-xs text-[#A7B5AF]">
                  Hospital Management System
                </p>
              </div>

            </Link>


            {/* MAIN CONTENT */}

            <div className="max-w-xl">

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#5EEAD4]/15 bg-[#0F766E]/10 px-4 py-2 text-sm text-[#99F6E4]">
                <ShieldCheck size={16} />

                Secure Healthcare Platform
              </div>


              <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-[#F7F4ED] xl:text-6xl">

                Healthcare
                <br />

                <span className="text-[#5EEAD4]">
                  managed better.
                </span>

              </h2>


              <p className="mt-7 max-w-lg text-base leading-7 text-[#A7B5AF] xl:text-lg">
                One intelligent platform for managing patients, doctors,
                appointments, clinical operations, billing and hospital
                resources.
              </p>


              {/* FEATURES */}

              <div className="mt-10 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">

                <Feature
                  icon={<Users size={17} />}
                  title="Patient Management"
                  description="Centralized patient records"
                />

                <Feature
                  icon={<CalendarDays size={17} />}
                  title="Appointments"
                  description="Smart scheduling & queue"
                />

                <Feature
                  icon={<Activity size={17} />}
                  title="Clinical Operations"
                  description="Connected medical workflows"
                />

                <Feature
                  icon={<ShieldCheck size={17} />}
                  title="Secure Access"
                  description="Role-based authorization"
                />

              </div>

            </div>


            {/* FOOTER */}

            <div className="flex items-center justify-between text-xs text-[#71817B]">

              <p>
                © 2026 MediCare HMS
              </p>

              <p>
                Secure • Reliable • Connected
              </p>

            </div>

          </div>

        </section>


        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-14">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}

            <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F766E] text-white">
                <Hospital size={23} />
              </div>

              <div>

                <h1 className="font-bold text-[#17201D]">
                  MediCare
                </h1>

                <p className="text-xs text-[#64746E]">
                  Hospital Management System
                </p>

              </div>

            </div>


            {/* HEADER */}

            <div className="mb-8">

              <p className="mb-2 text-sm font-semibold text-[#0F766E]">
                Welcome back
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-[#17201D] sm:text-4xl">
                Sign in to your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#64746E]">
                Access your hospital workspace securely using your registered
                credentials.
              </p>

            </div>


            {/* LOGIN CARD */}

            <div className="rounded-3xl border border-[#DDD9CE] bg-white p-6 shadow-[0_20px_60px_rgba(23,32,29,0.08)] sm:p-8">

              <form onSubmit={handleSubmit} className="space-y-5">

                {errorMsg && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#26332F]"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#87938E]"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@hospital.com"
                      autoComplete="email"
                      required
                      className="
                        w-full rounded-xl
                        border border-[#DCDDD8]
                        bg-[#FAFAF7]
                        py-3.5 pl-11 pr-4
                        text-sm text-[#17201D]
                        outline-none transition-all
                        placeholder:text-[#9AA49F]
                        focus:border-[#0F766E]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#0F766E]/10
                      "
                    />

                  </div>

                </div>


                {/* PASSWORD */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-[#26332F]"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-[#0F766E] hover:text-[#0B5F59]"
                    >
                      Forgot password?
                    </Link>

                  </div>


                  <div className="relative">

                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#87938E]"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="
                        w-full rounded-xl
                        border border-[#DCDDD8]
                        bg-[#FAFAF7]
                        py-3.5 pl-11 pr-12
                        text-sm text-[#17201D]
                        outline-none transition-all
                        placeholder:text-[#9AA49F]
                        focus:border-[#0F766E]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#0F766E]/10
                      "
                    />


                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="
                        absolute right-3.5 top-1/2
                        -translate-y-1/2
                        rounded-lg p-1.5
                        text-[#87938E]
                        transition
                        hover:bg-[#F1F3EF]
                        hover:text-[#17201D]
                      "
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>


                {/* REMEMBER */}

                <div className="flex items-center justify-between">

                  <label className="flex cursor-pointer items-center gap-2">

                    <input
                      type="checkbox"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="
                        h-4 w-4 rounded
                        border-[#C9CEC9]
                        text-[#0F766E]
                        focus:ring-[#0F766E]
                      "
                    />

                    <span className="text-sm text-[#64746E]">
                      Remember me
                    </span>

                  </label>


                  <span className="text-xs text-[#9AA49F]">
                    Secure login
                  </span>

                </div>


                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group flex w-full items-center
                    justify-center gap-2
                    rounded-xl
                    bg-[#0F766E]
                    py-3.5
                    text-sm font-bold text-white
                    shadow-lg shadow-[#0F766E]/15
                    transition-all
                    hover:bg-[#0B5F59]
                    hover:shadow-xl
                    hover:shadow-[#0F766E]/20
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}

                </button>

              </form>


              {/* SECURITY CARD */}

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#B7E4DD] bg-[#ECFDF5] p-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">
                  <ShieldCheck size={18} />
                </div>

                <div>

                  <p className="text-xs font-bold text-[#145C56]">
                    Your information is protected
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#36766F]">
                    Secure authentication and role-based access keep your
                    hospital data protected.
                  </p>

                </div>

              </div>

            </div>


            {/* REGISTER */}

            <p className="mt-6 text-center text-sm text-[#64746E]">

              New patient?

              <Link
                href="/register"
                className="ml-1 font-bold text-[#0F766E] hover:text-[#0B5F59]"
              >
                Create an account
              </Link>

            </p>


            {/* FOOTER */}

            <p className="mt-8 text-center text-xs leading-5 text-[#9AA49F]">
              By continuing, you agree to the hospital's terms and privacy
              policy.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}


/* =====================================================
   FEATURE COMPONENT
===================================================== */

function Feature({ icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all hover:border-[#5EEAD4]/20 hover:bg-[#0F766E]/10">

      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E]/20 text-[#5EEAD4]">
        {icon}
      </div>

      <p className="text-sm font-semibold text-[#F7F4ED]">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-[#84928C]">
        {description}
      </p>

    </div>
  );
}
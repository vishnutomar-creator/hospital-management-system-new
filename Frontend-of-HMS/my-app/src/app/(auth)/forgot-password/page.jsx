"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Hospital,
  Mail,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      /*
        Backend API will be connected later.

        Example:

        await api.post("/auth/forgot-password", {
          email,
        });
      */

      console.log("Forgot password request:", email);

      // Temporary frontend simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
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

          {/* Decorative background */}

          <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#0F766E]/20 blur-3xl" />

          <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-[#14B8A6]/10 blur-3xl" />

          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}

            <Link href="/" className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F766E] text-[#F7F4ED] shadow-lg">
                <Hospital size={25} />
              </div>

              <div>
                <h1 className="text-lg font-bold text-[#F7F4ED]">
                  MediCare
                </h1>

                <p className="text-xs text-[#A7B5AF]">
                  Hospital Management System
                </p>
              </div>

            </Link>


            {/* Main Content */}

            <div className="max-w-xl">

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#5EEAD4]/15 bg-[#0F766E]/10 px-4 py-2 text-sm text-[#99F6E4]">

                <ShieldCheck size={16} />

                Secure Account Recovery

              </div>


              <h2 className="text-4xl font-bold leading-[1.1] text-[#F7F4ED] xl:text-6xl">

                Get back to your
                <br />

                <span className="text-[#5EEAD4]">
                  healthcare account.
                </span>

              </h2>


              <p className="mt-7 max-w-lg text-base leading-7 text-[#A7B5AF] xl:text-lg">
                Don't worry if you've forgotten your password. We'll help
                you securely regain access to your MediCare account.
              </p>


              {/* Security Features */}

              <div className="mt-10 space-y-4">

                <RecoveryFeature
                  icon={<KeyRound size={18} />}
                  title="Secure Recovery"
                  description="Password recovery is handled through a protected process."
                />

                <RecoveryFeature
                  icon={<Mail size={18} />}
                  title="Email Verification"
                  description="A secure recovery link will be sent to your registered email."
                />

                <RecoveryFeature
                  icon={<ShieldCheck size={18} />}
                  title="Account Protection"
                  description="Your existing password remains protected during recovery."
                />

              </div>

            </div>


            {/* Footer */}

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

            {/* Mobile Logo */}

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


            {/* =================================================
                SUCCESS STATE
            ================================================== */}

            {submitted ? (

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
                  <CheckCircle2 size={32} />
                </div>


                <p className="mt-6 text-sm font-semibold text-[#0F766E]">
                  Check your email
                </p>


                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17201D]">
                  Reset link sent
                </h1>


                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#64746E]">
                  If an account exists for{" "}
                  <span className="font-semibold text-[#26332F]">
                    {email}
                  </span>
                  , you'll receive instructions to reset your password.
                </p>


                {/* Email Notice */}

                <div className="mt-7 rounded-2xl border border-[#B7E4DD] bg-[#ECFDF5] p-5 text-left">

                  <div className="flex gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">
                      <Mail size={19} />
                    </div>

                    <div>

                      <p className="text-sm font-bold text-[#145C56]">
                        Didn't receive the email?
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#36766F]">
                        Check your spam folder or make sure you entered the
                        email address associated with your account.
                      </p>

                    </div>

                  </div>

                </div>


                <Link
                  href="/login"
                  className="
                    mt-7 flex w-full items-center
                    justify-center gap-2 rounded-xl
                    bg-[#0F766E] py-3.5
                    text-sm font-bold text-white
                    shadow-lg shadow-[#0F766E]/15
                    transition hover:bg-[#0B5F59]
                  "
                >
                  Back to Sign In

                  <ArrowRight size={17} />

                </Link>


                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-5 text-sm font-semibold text-[#0F766E] hover:text-[#0B5F59]"
                >
                  Try another email
                </button>

              </div>

            ) : (

              /* =================================================
                 FORGOT PASSWORD FORM
              ================================================== */

              <>

                {/* Header */}

                <div className="mb-8">

                  <Link
                    href="/login"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#64746E] transition hover:text-[#0F766E]"
                  >
                    <ArrowLeft size={16} />
                    Back to login
                  </Link>


                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]">

                    <KeyRound size={25} />

                  </div>


                  <p className="mt-6 text-sm font-semibold text-[#0F766E]">
                    Account recovery
                  </p>


                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17201D] sm:text-4xl">
                    Forgot your password?
                  </h1>


                  <p className="mt-3 text-sm leading-6 text-[#64746E]">
                    Enter the email address associated with your account and
                    we'll send you a secure password reset link.
                  </p>

                </div>


                {/* Form Card */}

                <div className="rounded-3xl border border-[#DDD9CE] bg-white p-6 shadow-[0_20px_60px_rgba(23,32,29,0.08)] sm:p-8">

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >

                    {/* Email */}

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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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


                    {/* Information */}

                    <div className="rounded-2xl border border-[#E5E5DE] bg-[#FAFAF7] p-4">

                      <div className="flex gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">

                          <ShieldCheck size={18} />

                        </div>


                        <div>

                          <p className="text-xs font-bold text-[#26332F]">
                            Your account is protected
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#71817B]">
                            For your security, we'll only send recovery
                            instructions to a registered email address.
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* Submit */}

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
                        active:scale-[0.99]
                        disabled:cursor-not-allowed
                        disabled:opacity-70
                      "
                    >

                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          Sending...
                        </>
                      ) : (
                        <>
                          Send Reset Link

                          <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}

                    </button>

                  </form>

                </div>


                {/* Login */}

                <p className="mt-6 text-center text-sm text-[#64746E]">

                  Remember your password?

                  <Link
                    href="/login"
                    className="ml-1 font-bold text-[#0F766E] hover:text-[#0B5F59]"
                  >
                    Sign in
                  </Link>

                </p>


                {/* Bottom */}

                <p className="mt-8 text-center text-xs leading-5 text-[#9AA49F]">
                  If you continue to have trouble accessing your account,
                  please contact the hospital administrator.
                </p>

              </>

            )}

          </div>

        </section>

      </div>

    </main>
  );
}


/* =====================================================
   RECOVERY FEATURE
===================================================== */

function RecoveryFeature({ icon, title, description }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F766E]/20 text-[#5EEAD4]">
        {icon}
      </div>

      <div>

        <p className="text-sm font-semibold text-[#F7F4ED]">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#84928C]">
          {description}
        </p>

      </div>

    </div>
  );
}
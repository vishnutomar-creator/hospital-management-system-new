"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Hospital,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F7F4ED] text-sm font-semibold text-[#0F766E]">Loading reset options...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();

  // Token received from reset email link
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid or missing password reset link.");
      return;
    }

    setLoading(true);

    try {
      /*
        Backend API will be connected later.

        Example:

        await api.post("/auth/reset-password", {
          token,
          password,
        });
      */

      console.log("Reset password:", {
        token,
        password,
      });

      // Temporary frontend simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError("Unable to reset password. Please try again.");
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


            {/* Content */}

            <div className="max-w-xl">

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#5EEAD4]/15 bg-[#0F766E]/10 px-4 py-2 text-sm text-[#99F6E4]">

                <KeyRound size={16} />

                Secure Password Recovery

              </div>


              <h2 className="text-4xl font-bold leading-[1.1] text-[#F7F4ED] xl:text-6xl">

                Create a new
                <br />

                <span className="text-[#5EEAD4]">
                  secure password.
                </span>

              </h2>


              <p className="mt-7 max-w-lg text-base leading-7 text-[#A7B5AF] xl:text-lg">
                Choose a strong password to protect your hospital account
                and keep your healthcare information secure.
              </p>


              {/* Security Features */}

              <div className="mt-10 space-y-4">

                <SecurityFeature
                  icon={<LockKeyhole size={18} />}
                  title="Strong Password"
                  description="Use at least 8 characters for better security."
                />

                <SecurityFeature
                  icon={<ShieldCheck size={18} />}
                  title="Protected Account"
                  description="Your password helps protect sensitive healthcare data."
                />

                <SecurityFeature
                  icon={<KeyRound size={18} />}
                  title="Secure Access"
                  description="Your new password will be used for future sign-ins."
                />

              </div>

            </div>


            {/* Footer */}

            <div className="flex items-center justify-between text-xs text-[#71817B]">

              <p>© 2026 MediCare HMS</p>

              <p>Secure • Reliable • Connected</p>

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

            {success ? (

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">

                  <CheckCircle2 size={32} />

                </div>


                <p className="mt-6 text-sm font-semibold text-[#0F766E]">
                  Password updated
                </p>


                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17201D]">
                  You're all set
                </h1>


                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#64746E]">
                  Your password has been successfully changed. You can now
                  sign in using your new password.
                </p>


                {/* Success Card */}

                <div className="mt-7 rounded-2xl border border-[#B7E4DD] bg-[#ECFDF5] p-5 text-left">

                  <div className="flex gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">
                      <ShieldCheck size={19} />
                    </div>

                    <div>

                      <p className="text-sm font-bold text-[#145C56]">
                        Password changed securely
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#36766F]">
                        Your old password is no longer valid.
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
                    transition
                    hover:bg-[#0B5F59]
                  "
                >
                  Continue to Sign In

                  <ArrowRight size={17} />

                </Link>

              </div>

            ) : (

              /* =================================================
                 RESET FORM
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
                    Reset password
                  </p>


                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17201D] sm:text-4xl">
                    Create a new password
                  </h1>


                  <p className="mt-3 text-sm leading-6 text-[#64746E]">
                    Choose a strong password that you haven't used before.
                  </p>

                </div>


                {/* Form Card */}

                <div className="rounded-3xl border border-[#DDD9CE] bg-white p-6 shadow-[0_20px_60px_rgba(23,32,29,0.08)] sm:p-8">

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >

                    {/* Password */}

                    <PasswordInput
                      label="New Password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      show={showPassword}
                      setShow={setShowPassword}
                      placeholder="Enter new password"
                    />


                    {/* Confirm Password */}

                    <PasswordInput
                      label="Confirm New Password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      show={showConfirmPassword}
                      setShow={setShowConfirmPassword}
                      placeholder="Confirm new password"
                    />


                    {/* Password Requirements */}

                    <div className="rounded-2xl border border-[#E5E5DE] bg-[#FAFAF7] p-4">

                      <p className="text-xs font-bold text-[#26332F]">
                        Password requirements
                      </p>

                      <div className="mt-3 space-y-2">

                        <Requirement
                          valid={password.length >= 8}
                          text="At least 8 characters"
                        />

                        <Requirement
                          valid={/[A-Z]/.test(password)}
                          text="At least one uppercase letter"
                        />

                        <Requirement
                          valid={/[0-9]/.test(password)}
                          text="At least one number"
                        />

                      </div>

                    </div>


                    {/* Error */}

                    {error && (

                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                        <p className="text-xs font-semibold text-red-700">
                          {error}
                        </p>

                      </div>

                    )}


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

                          Updating password...
                        </>
                      ) : (
                        <>
                          Update Password

                          <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}

                    </button>


                    {/* Security Notice */}

                    <div className="flex items-start gap-3 rounded-2xl border border-[#B7E4DD] bg-[#ECFDF5] p-4">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">

                        <ShieldCheck size={18} />

                      </div>

                      <div>

                        <p className="text-xs font-bold text-[#145C56]">
                          Secure password recovery
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#36766F]">
                          Your reset link is temporary and should only be
                          used by you.
                        </p>

                      </div>

                    </div>

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

              </>

            )}

          </div>

        </section>

      </div>

    </main>
  );
}


/* =====================================================
   PASSWORD INPUT
===================================================== */

function PasswordInput({
  label,
  name,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-[#26332F]"
      >
        {label}
      </label>

      <div className="relative">

        <LockKeyhole
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#87938E]"
        />

        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
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
          onClick={() => setShow((prev) => !prev)}
          className="
            absolute right-3.5 top-1/2
            -translate-y-1/2
            rounded-lg p-1.5
            text-[#87938E]
            hover:bg-[#F1F3EF]
            hover:text-[#17201D]
          "
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>

    </div>
  );
}


/* =====================================================
   PASSWORD REQUIREMENT
===================================================== */

function Requirement({ valid, text }) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          valid
            ? "bg-[#0F766E] text-white"
            : "border border-[#C9CEC9]"
        }`}
      >
        {valid && (
          <CheckCircle2 size={11} />
        )}
      </span>

      <span
        className={`text-xs ${
          valid
            ? "text-[#0F766E]"
            : "text-[#87938E]"
        }`}
      >
        {text}
      </span>

    </div>
  );
}


/* =====================================================
   SECURITY FEATURE
===================================================== */

function SecurityFeature({ icon, title, description }) {
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
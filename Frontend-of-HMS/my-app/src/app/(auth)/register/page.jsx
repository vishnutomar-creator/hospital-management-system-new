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
  Phone,
  ShieldCheck,
  UserRound,
  CalendarDays,
  MapPin,
  HeartPulse,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    address: "",
    emergencyContact: "",
    password: "",
    confirmPassword: "",
    terms: false,
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
    setErrorMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim() || formData.email;
      await register({
        name,
        email: formData.email,
        password: formData.password,
      });

      router.push("/login");
    } catch (err) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F4ED]">

      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <section className="relative hidden overflow-hidden bg-[#17201D] lg:flex">

          {/* Decorative background */}

          <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#0F766E]/20 blur-3xl" />

          <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-[#14B8A6]/10 blur-3xl" />

          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-12 xl:p-16">

            {/* LOGO */}

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


            {/* CONTENT */}

            <div className="max-w-lg">

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#5EEAD4]/15 bg-[#0F766E]/10 px-4 py-2 text-sm text-[#99F6E4]">

                <HeartPulse size={16} />

                Patient Registration

              </div>


              <h2 className="text-4xl font-bold leading-[1.1] text-[#F7F4ED] xl:text-6xl">

                Your health.
                <br />

                <span className="text-[#5EEAD4]">
                  Your records.
                </span>
              </h2>


              <p className="mt-7 max-w-lg text-base leading-7 text-[#A7B5AF] xl:text-lg">
                Create your patient account and manage appointments,
                medical records, prescriptions and healthcare information
                from one secure platform.
              </p>


              {/* FEATURES */}

              <div className="mt-10 space-y-4">

                <Feature
                  icon={<ShieldCheck size={18} />}
                  title="Secure Medical Records"
                  description="Your healthcare information stays protected."
                />

                <Feature
                  icon={<CalendarDays size={18} />}
                  title="Easy Appointments"
                  description="Book and manage doctor appointments easily."
                />

                <Feature
                  icon={<HeartPulse size={18} />}
                  title="Connected Healthcare"
                  description="Access your healthcare journey in one place."
                />

              </div>

            </div>


            {/* FOOTER */}

            <div className="text-xs text-[#71817B]">
              © 2026 MediCare HMS
            </div>

          </div>

        </section>


        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

          <div className="w-full max-w-2xl">

            {/* MOBILE LOGO */}

            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

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

            <div className="mb-7">

              <p className="mb-2 text-sm font-semibold text-[#0F766E]">
                Get started
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-[#17201D] sm:text-4xl">
                Create your patient account
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#64746E]">
                Enter your information below to create a secure account
                for managing your healthcare services.
              </p>

            </div>


            {/* FORM CARD */}

            <div className="rounded-3xl border border-[#DDD9CE] bg-white p-6 shadow-[0_20px_60px_rgba(23,32,29,0.08)] sm:p-8">

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* =================================================
                    PERSONAL INFORMATION
                ================================================== */}

                <FormSection
                  title="Personal Information"
                  description="Basic information used for your patient profile."
                />


                {/* NAME */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <InputField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    icon={<UserRound size={18} />}
                    required
                  />

                  <InputField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />

                </div>


                {/* EMAIL + PHONE */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    icon={<Mail size={18} />}
                    required
                  />

                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    icon={<Phone size={18} />}
                    required
                  />

                </div>


                {/* DOB + GENDER */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <InputField
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    icon={<CalendarDays size={18} />}
                    required
                  />


                  <SelectField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      "Male",
                      "Female",
                      "Other",
                      "Prefer not to say",
                    ]}
                    required
                  />

                </div>


                {/* BLOOD GROUP */}

                <SelectField
                  label="Blood Group"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  options={[
                    "A+",
                    "A-",
                    "B+",
                    "B-",
                    "AB+",
                    "AB-",
                    "O+",
                    "O-",
                  ]}
                  required
                />


                {/* =================================================
                    CONTACT INFORMATION
                ================================================== */}

                <div className="border-t border-[#ECEAE2] pt-6">

                  <FormSection
                    title="Contact Information"
                    description="Information that can be used during emergencies."
                  />

                </div>


                {/* ADDRESS */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#26332F]">
                    Address
                  </label>

                  <div className="relative">

                    <MapPin
                      size={18}
                      className="absolute left-4 top-4 text-[#87938E]"
                    />

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your complete address"
                      rows={3}
                      required
                      className="
                        w-full resize-none rounded-xl
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


                {/* EMERGENCY CONTACT */}

                <InputField
                  label="Emergency Contact"
                  name="emergencyContact"
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Emergency contact number"
                  icon={<Phone size={18} />}
                  required
                />


                {/* =================================================
                    SECURITY
                ================================================== */}

                <div className="border-t border-[#ECEAE2] pt-6">

                  <FormSection
                    title="Account Security"
                    description="Create a strong password for your account."
                  />

                </div>


                {/* PASSWORD */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <PasswordField
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    show={showPassword}
                    setShow={setShowPassword}
                    placeholder="Create password"
                  />

                  <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    show={showConfirmPassword}
                    setShow={setShowConfirmPassword}
                    placeholder="Confirm password"
                  />

                </div>


                {/* TERMS */}

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5E5DE] bg-[#FAFAF7] p-4">

                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    required
                    className="mt-0.5 h-4 w-4 rounded border-[#C9CEC9] text-[#0F766E] focus:ring-[#0F766E]"
                  />

                  <span className="text-xs leading-5 text-[#64746E]">

                    I agree to the hospital's{" "}

                    <span className="font-semibold text-[#0F766E]">
                      Terms of Service
                    </span>

                    {" "}and{" "}

                    <span className="font-semibold text-[#0F766E]">
                      Privacy Policy
                    </span>
                    .

                  </span>

                </label>


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
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Patient Account

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}

                </button>


                {/* SECURITY NOTICE */}

                <div className="flex items-start gap-3 rounded-2xl border border-[#B7E4DD] bg-[#ECFDF5] p-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">

                    <ShieldCheck size={18} />

                  </div>

                  <div>

                    <p className="text-xs font-bold text-[#145C56]">
                      Your information is protected
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#36766F]">
                      Your personal and medical information will only be
                      accessible to authorized hospital personnel.
                    </p>

                  </div>

                </div>

              </form>

            </div>


            {/* LOGIN */}

            <p className="mt-6 text-center text-sm text-[#64746E]">

              Already have an account?

              <Link
                href="/login"
                className="ml-1 font-bold text-[#0F766E] hover:text-[#0B5F59]"
              >
                Sign in
              </Link>

            </p>

          </div>

        </section>

      </div>

    </main>
  );
}


/* =====================================================
   FORM SECTION
===================================================== */

function FormSection({ title, description }) {
  return (
    <div className="mb-5">

      <h2 className="text-base font-bold text-[#17201D]">
        {title}
      </h2>

      <p className="mt-1 text-xs text-[#87938E]">
        {description}
      </p>

    </div>
  );
}


/* =====================================================
   INPUT
===================================================== */

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  required = false,
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

        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#87938E]">
            {icon}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full rounded-xl
            border border-[#DCDDD8]
            bg-[#FAFAF7]
            py-3.5
            ${icon ? "pl-11" : "pl-4"}
            pr-4
            text-sm text-[#17201D]
            outline-none transition-all
            placeholder:text-[#9AA49F]
            focus:border-[#0F766E]
            focus:bg-white
            focus:ring-4
            focus:ring-[#0F766E]/10
          `}
        />

      </div>

    </div>
  );
}


/* =====================================================
   SELECT
===================================================== */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-[#26332F]"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full rounded-xl
          border border-[#DCDDD8]
          bg-[#FAFAF7]
          px-4 py-3.5
          text-sm text-[#17201D]
          outline-none transition-all
          focus:border-[#0F766E]
          focus:bg-white
          focus:ring-4
          focus:ring-[#0F766E]/10
        "
      >

        <option value="">
          Select {label.toLowerCase()}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}


/* =====================================================
   PASSWORD
===================================================== */

function PasswordField({
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
   FEATURE
===================================================== */

function Feature({ icon, title, description }) {
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
"use client";

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  HeartPulse,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { useState } from "react";

const initialTheaters = [
  {
    id: "OT-001",
    name: "Operation Theater 01",
    type: "Major Surgery",
    floor: "2nd Floor",
    department: "General Surgery",
    surgeon: "Dr. Rajiv Sharma",
    surgery: "Appendectomy",
    patient: "Aarav Mehta",
    schedule: "09:00 AM - 11:30 AM",
    status: "In Use",
    equipment: "Fully Equipped",
    capacity: 8,
    lastMaintenance: "10 Aug 2026",
  },
  {
    id: "OT-002",
    name: "Operation Theater 02",
    type: "Cardiac Surgery",
    floor: "2nd Floor",
    department: "Cardiology",
    surgeon: "Dr. Amit Verma",
    surgery: "CABG",
    patient: "Rohan Kapoor",
    schedule: "12:00 PM - 04:00 PM",
    status: "Scheduled",
    equipment: "Fully Equipped",
    capacity: 10,
    lastMaintenance: "05 Aug 2026",
  },
  {
    id: "OT-003",
    name: "Operation Theater 03",
    type: "Orthopedic Surgery",
    floor: "3rd Floor",
    department: "Orthopedics",
    surgeon: "Dr. Neha Singh",
    surgery: "Knee Replacement",
    patient: "Priya Sharma",
    schedule: "10:30 AM - 01:30 PM",
    status: "Scheduled",
    equipment: "Fully Equipped",
    capacity: 8,
    lastMaintenance: "02 Aug 2026",
  },
  {
    id: "OT-004",
    name: "Operation Theater 04",
    type: "Minor Surgery",
    floor: "3rd Floor",
    department: "General Surgery",
    surgeon: "Dr. Karan Patel",
    surgery: "Hernia Repair",
    patient: "Vikram Joshi",
    schedule: "02:00 PM - 03:30 PM",
    status: "Available",
    equipment: "Fully Equipped",
    capacity: 6,
    lastMaintenance: "08 Aug 2026",
  },
  {
    id: "OT-005",
    name: "Operation Theater 05",
    type: "Neurosurgery",
    floor: "4th Floor",
    department: "Neurology",
    surgeon: "Dr. Priya Gupta",
    surgery: "Brain Tumor Removal",
    patient: "Ananya Verma",
    schedule: "08:00 AM - 02:00 PM",
    status: "Maintenance",
    equipment: "Under Maintenance",
    capacity: 10,
    lastMaintenance: "12 Aug 2026",
  },
  {
    id: "OT-006",
    name: "Operation Theater 06",
    type: "Emergency",
    floor: "Ground Floor",
    department: "Emergency",
    surgeon: "Dr. Rahul Mehta",
    surgery: "Emergency Surgery",
    patient: "Emergency Case",
    schedule: "On Demand",
    status: "Available",
    equipment: "Fully Equipped",
    capacity: 8,
    lastMaintenance: "01 Aug 2026",
  },
];

export default function OperationTheaterPage() {
  const [theaters, setTheaters] = useState(initialTheaters);

  const [selectedTheater, setSelectedTheater] = useState(null);

  const [showAdd, setShowAdd] = useState(false);

  const [editing, setEditing] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "",
    floor: "",
    department: "",
    surgeon: "",
    surgery: "",
    patient: "",
    schedule: "",
    status: "Available",
    equipment: "Fully Equipped",
    capacity: "8",
    lastMaintenance: "",
  });

  const filteredTheaters = theaters.filter((theater) => {
    const text = `
      ${theater.name}
      ${theater.id}
      ${theater.department}
      ${theater.surgeon}
      ${theater.surgery}
      ${theater.status}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const openAdd = () => {
    setForm({
      name: "",
      type: "",
      floor: "",
      department: "",
      surgeon: "",
      surgery: "",
      patient: "",
      schedule: "",
      status: "Available",
      equipment: "Fully Equipped",
      capacity: "8",
      lastMaintenance: "",
    });

    setEditing(false);
    setSelectedTheater(null);
    setShowAdd(true);
  };

  const openEdit = (theater) => {
    setForm({
      name: theater.name,
      type: theater.type,
      floor: theater.floor,
      department: theater.department,
      surgeon: theater.surgeon,
      surgery: theater.surgery,
      patient: theater.patient,
      schedule: theater.schedule,
      status: theater.status,
      equipment: theater.equipment,
      capacity: String(theater.capacity),
      lastMaintenance: theater.lastMaintenance,
    });

    setSelectedTheater(theater);
    setEditing(true);
    setShowAdd(true);
  };

  const openView = (theater) => {
    setSelectedTheater(theater);
    setShowAdd(false);
  };

  const closeAll = () => {
    setSelectedTheater(null);
    setShowAdd(false);
    setEditing(false);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editing && selectedTheater) {
      setTheaters((prev) =>
        prev.map((theater) =>
          theater.id === selectedTheater.id
            ? {
                ...theater,
                ...form,
                capacity: Number(form.capacity),
              }
            : theater
        )
      );

      closeAll();
      return;
    }

    const newTheater = {
      ...form,
      id: `OT-${String(theaters.length + 1).padStart(3, "0")}`,
      capacity: Number(form.capacity),
    };

    setTheaters((prev) => [...prev, newTheater]);

    closeAll();
  };

  const deleteTheater = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this operation theater?"
    );

    if (!confirmDelete) return;

    setTheaters((prev) =>
      prev.filter((theater) => theater.id !== id)
    );

    setSelectedTheater(null);
  };

  const total = theaters.length;

  const available = theaters.filter(
    (t) => t.status === "Available"
  ).length;

  const inUse = theaters.filter(
    (t) => t.status === "In Use"
  ).length;

  const scheduled = theaters.filter(
    (t) => t.status === "Scheduled"
  ).length;

  const maintenance = theaters.filter(
    (t) => t.status === "Maintenance"
  ).length;

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>

          <div className="flex items-center gap-2 text-xs text-[#87938E]">

            <span>Hospital</span>

            <ChevronRight size={13} />

            <span className="text-[#0F766E]">
              Operation Theater
            </span>

          </div>

          <h1 className="mt-2 text-2xl font-bold text-[#17201D] sm:text-3xl dark:text-white">
            Operation Theater
          </h1>

          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage operation theaters, surgeries, schedules and availability.
          </p>

        </div>

        <button
          onClick={openAdd}
          className="flex w-fit items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]"
        >
          <Plus size={17} />
          Add Theater
        </button>

      </div>


      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="Total Theaters"
          value={total}
          subtitle="Operating rooms"
          icon={<HeartPulse size={20} />}
          bg="bg-[#E7F5F2]"
          color="text-[#0F766E]"
        />

        <StatCard
          title="Available"
          value={available}
          subtitle="Ready for surgery"
          icon={<CheckCircle2 size={20} />}
          bg="bg-[#ECFDF5]"
          color="text-[#0F766E]"
        />

        <StatCard
          title="In Use"
          value={inUse}
          subtitle="Currently active"
          icon={<Activity size={20} />}
          bg="bg-[#FFF3E8]"
          color="text-[#C87924]"
        />

        <StatCard
          title="Scheduled"
          value={scheduled}
          subtitle="Upcoming surgeries"
          icon={<CalendarDays size={20} />}
          bg="bg-[#EEF2FF]"
          color="text-[#5367B8]"
        />

        <StatCard
          title="Maintenance"
          value={maintenance}
          subtitle="Unavailable"
          icon={<AlertCircle size={20} />}
          bg="bg-[#FFF1F1]"
          color="text-[#C84B4B]"
        />

      </div>


      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="mt-6 rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

        <div className="relative max-w-[420px]">

          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA49F]"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search theater, surgeon, surgery..."
            className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2.5 pl-11 pr-4 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
          />

        </div>

      </div>


      {/* =====================================================
          THEATER LIST
      ====================================================== */}

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {filteredTheaters.map((theater) => (

          <TheaterCard
            key={theater.id}
            theater={theater}
            onView={() => openView(theater)}
            onEdit={() => openEdit(theater)}
            onDelete={() => deleteTheater(theater.id)}
          />

        ))}

      </div>


      {/* EMPTY */}

      {filteredTheaters.length === 0 && (

        <div className="mt-6 rounded-2xl border border-[#E3E0D7] bg-white p-12 text-center dark:border-white/10 dark:bg-[#18211E]">

          <Search
            size={30}
            className="mx-auto text-[#A1AAA6]"
          />

          <p className="mt-3 text-sm font-bold text-[#17201D] dark:text-white">
            No theaters found
          </p>

          <p className="mt-1 text-xs text-[#87938E]">
            Try searching with a different keyword.
          </p>

        </div>

      )}


      {/* =====================================================
          VIEW MODAL
      ====================================================== */}

      {selectedTheater && !showAdd && (

        <Modal
          title="Operation Theater Details"
          onClose={closeAll}
        >

          <div className="space-y-5">

            {/* Theater Header */}

            <div className="flex items-center gap-4 rounded-2xl bg-[#FAFAF7] p-4 dark:bg-[#202B27]">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
                <HeartPulse size={22} />
              </div>

              <div>

                <h2 className="text-base font-bold text-[#17201D] dark:text-white">
                  {selectedTheater.name}
                </h2>

                <p className="mt-1 text-[10px] text-[#87938E]">
                  {selectedTheater.id} • {selectedTheater.floor}
                </p>

              </div>

              <div className="ml-auto">
                <StatusBadge
                  status={selectedTheater.status}
                />
              </div>

            </div>


            {/* Surgery */}

            <div className="rounded-2xl border border-[#E3E0D7] p-4 dark:border-white/10">

              <h3 className="text-xs font-bold text-[#17201D] dark:text-white">
                Current / Scheduled Surgery
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                <Detail
                  label="Surgery"
                  value={selectedTheater.surgery}
                  icon={<Stethoscope size={14} />}
                />

                <Detail
                  label="Patient"
                  value={selectedTheater.patient}
                  icon={<UserRound size={14} />}
                />

                <Detail
                  label="Surgeon"
                  value={selectedTheater.surgeon}
                  icon={<UserRound size={14} />}
                />

                <Detail
                  label="Schedule"
                  value={selectedTheater.schedule}
                  icon={<Clock3 size={14} />}
                />

              </div>

            </div>


            {/* Information */}

            <div className="grid gap-3 sm:grid-cols-3">

              <InfoBox
                label="Department"
                value={selectedTheater.department}
              />

              <InfoBox
                label="Theater Type"
                value={selectedTheater.type}
              />

              <InfoBox
                label="Capacity"
                value={`${selectedTheater.capacity} Staff`}
              />

            </div>


            {/* Equipment */}

            <div className="rounded-xl bg-[#E7F5F2] p-4">

              <div className="flex items-center gap-3">

                <ShieldCheck
                  size={18}
                  className="text-[#0F766E]"
                />

                <div>

                  <p className="text-xs font-bold text-[#17201D] dark:text-white">
                    Equipment Status
                  </p>

                  <p className="mt-1 text-[10px] text-[#0F766E]">
                    {selectedTheater.equipment}
                  </p>

                </div>

              </div>

            </div>


            {/* Maintenance */}

            <div className="flex items-center justify-between rounded-xl border border-[#E3E0D7] p-4 dark:border-white/10">

              <div className="flex items-center gap-3">

                <CalendarDays
                  size={17}
                  className="text-[#0F766E]"
                />

                <span className="text-xs text-[#87938E]">
                  Last Maintenance
                </span>

              </div>

              <span className="text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">
                {selectedTheater.lastMaintenance}
              </span>

            </div>


            {/* Actions */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                onClick={() =>
                  deleteTheater(selectedTheater.id)
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={15} />
                Delete
              </button>

              <button
                onClick={() =>
                  openEdit(selectedTheater)
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0B625C]"
              >
                <Edit3 size={15} />
                Edit Theater
              </button>

            </div>

          </div>

        </Modal>

      )}


      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showAdd && (

        <Modal
          title={
            editing
              ? "Edit Operation Theater"
              : "Add Operation Theater"
          }
          onClose={closeAll}
        >

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div className="grid gap-4 sm:grid-cols-2">

              <Input
                label="Theater Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Operation Theater 01"
                required
              />

              <Select
                label="Theater Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                options={[
                  "Major Surgery",
                  "Minor Surgery",
                  "Cardiac Surgery",
                  "Orthopedic Surgery",
                  "Neurosurgery",
                  "Emergency",
                  "General Surgery",
                ]}
                required
              />

              <Select
                label="Floor"
                name="floor"
                value={form.floor}
                onChange={handleChange}
                options={[
                  "Ground Floor",
                  "1st Floor",
                  "2nd Floor",
                  "3rd Floor",
                  "4th Floor",
                  "5th Floor",
                ]}
                required
              />

              <Select
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                options={[
                  "General Surgery",
                  "Cardiology",
                  "Orthopedics",
                  "Neurology",
                  "Emergency",
                  "Gynecology",
                  "ENT",
                  "Urology",
                ]}
                required
              />

              <Input
                label="Assigned Surgeon"
                name="surgeon"
                value={form.surgeon}
                onChange={handleChange}
                placeholder="Dr. Name"
                required
              />

              <Input
                label="Surgery"
                name="surgery"
                value={form.surgery}
                onChange={handleChange}
                placeholder="Surgery name"
              />

              <Input
                label="Patient"
                name="patient"
                value={form.patient}
                onChange={handleChange}
                placeholder="Patient name"
              />

              <Input
                label="Schedule"
                name="schedule"
                value={form.schedule}
                onChange={handleChange}
                placeholder="09:00 AM - 11:30 AM"
              />

              <Select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={[
                  "Available",
                  "In Use",
                  "Scheduled",
                  "Maintenance",
                ]}
              />

              <Select
                label="Equipment"
                name="equipment"
                value={form.equipment}
                onChange={handleChange}
                options={[
                  "Fully Equipped",
                  "Partially Equipped",
                  "Under Maintenance",
                ]}
              />

              <Input
                label="Capacity"
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                placeholder="8"
              />

              <Input
                label="Last Maintenance"
                name="lastMaintenance"
                value={form.lastMaintenance}
                onChange={handleChange}
                placeholder="12 Aug 2026"
              />

            </div>


            {/* Form Actions */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#EEECE5] pt-5 sm:flex-row sm:justify-end dark:border-white/10">

              <button
                type="button"
                onClick={closeAll}
                className="flex items-center justify-center rounded-xl border border-[#DDD9CE] px-5 py-2.5 text-xs font-bold text-[#52615B] hover:bg-[#F4F3EE] dark:border-white/10 dark:text-[#AAB6B0]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0B625C]"
              >
                <CheckCircle2 size={15} />

                {editing
                  ? "Save Changes"
                  : "Create Theater"}
              </button>

            </div>

          </form>

        </Modal>

      )}

    </div>
  );
}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  bg,
  color,
}) {
  return (
    <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#18211E]">

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs font-medium text-[#87938E]">
        {title}
      </p>

      <div className="mt-1 flex items-end justify-between">

        <p className="text-2xl font-bold text-[#17201D] dark:text-white">
          {value}
        </p>

        <span className="text-[9px] font-semibold text-[#87938E]">
          {subtitle}
        </span>

      </div>

    </div>
  );
}


/* ============================================================
   THEATER CARD
============================================================ */

function TheaterCard({
  theater,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="group rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#18211E]">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
            <HeartPulse size={20} />
          </div>

          <div>

            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              {theater.name}
            </h2>

            <p className="mt-0.5 text-[9px] text-[#A1AAA6]">
              {theater.id} • {theater.floor}
            </p>

          </div>

        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#87938E] hover:bg-[#E7F5F2] hover:text-[#0F766E]">
          <MoreHorizontal size={17} />
        </button>

      </div>


      {/* Tags */}

      <div className="mt-4 flex flex-wrap gap-2">

        <span className="rounded-full bg-[#E7F5F2] px-2.5 py-1 text-[9px] font-semibold text-[#0F766E]">
          {theater.department}
        </span>

        <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[9px] font-semibold text-[#5367B8]">
          {theater.type}
        </span>

      </div>


      {/* Surgery */}

      <div className="mt-5 rounded-xl bg-[#FAFAF7] p-4 dark:bg-[#202B27]">

        <div className="flex items-center gap-2">

          <Stethoscope
            size={15}
            className="text-[#0F766E]"
          />

          <span className="text-[9px] text-[#87938E]">
            Surgery
          </span>

        </div>

        <p className="mt-1 text-xs font-bold text-[#17201D] dark:text-white">
          {theater.surgery || "No surgery scheduled"}
        </p>

        <div className="mt-3 flex items-center gap-2">

          <UserRound
            size={13}
            className="text-[#87938E]"
          />

          <span className="text-[10px] text-[#52615B] dark:text-[#AAB6B0]">
            {theater.surgeon}
          </span>

        </div>

      </div>


      {/* Schedule */}

      <div className="mt-4 flex items-center gap-2">

        <Clock3
          size={14}
          className="text-[#0F766E]"
        />

        <span className="text-[10px] text-[#52615B] dark:text-[#AAB6B0]">
          {theater.schedule}
        </span>

      </div>


      {/* Status */}

      <div className="mt-4 flex items-center justify-between">

        <StatusBadge status={theater.status} />

        <span className="text-[9px] text-[#87938E]">
          Capacity: {theater.capacity}
        </span>

      </div>


      {/* Actions */}

      <div className="mt-5 flex gap-2 border-t border-[#EEECE5] pt-4 dark:border-white/10">

        <button
          onClick={onView}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#E7F5F2] py-2.5 text-[10px] font-bold text-[#0F766E] transition hover:bg-[#D9EFEB]"
        >
          View
          <ChevronRight size={13} />
        </button>

        <button
          onClick={onEdit}
          className="flex h-9 w-10 items-center justify-center rounded-xl border border-[#E3E0D7] text-[#52615B] hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
        >
          <Edit3 size={14} />
        </button>

        <button
          onClick={onDelete}
          className="flex h-9 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 hover:bg-red-50"
        >
          <Trash2 size={14} />
        </button>

      </div>

    </div>
  );
}


/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({ status }) {

  const styles = {
    Available: "bg-[#ECFDF5] text-[#0F766E]",
    "In Use": "bg-[#FFF3E8] text-[#C87924]",
    Scheduled: "bg-[#EEF2FF] text-[#5367B8]",
    Maintenance: "bg-[#FFF1F1] text-[#C84B4B]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}


/* ============================================================
   MODAL
============================================================ */

function Modal({
  title,
  onClose,
  children,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17201D]/40 p-4 backdrop-blur-sm">

      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E3E0D7] bg-white shadow-2xl dark:border-white/10 dark:bg-[#18211E]">

        {/* Modal Header */}

        <div className="flex items-center justify-between border-b border-[#EEECE5] px-5 py-4 dark:border-white/10">

          <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#87938E] hover:bg-[#F1F3EF] hover:text-[#0F766E]"
          >
            <X size={17} />
          </button>

        </div>

        {/* Modal Content */}

        <div className="max-h-[calc(92vh-70px)] overflow-y-auto p-5 sm:p-6">
          {children}
        </div>

      </div>

    </div>
  );
}


/* ============================================================
   INPUT
============================================================ */

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">

        {label}

        {required && (
          <span className="ml-1 text-[#D95C4F]">
            *
          </span>
        )}

      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-3 text-xs text-[#17201D] outline-none placeholder:text-[#A1AAA6] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
      />

    </div>
  );
}


/* ============================================================
   SELECT
============================================================ */

function Select({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">

        {label}

        {required && (
          <span className="ml-1 text-[#D95C4F]">
            *
          </span>
        )}

      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-3 text-xs text-[#52615B] outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
      >

        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}


/* ============================================================
   DETAIL
============================================================ */

function Detail({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7F5F2] text-[#0F766E]">
        {icon}
      </div>

      <div>

        <p className="text-[9px] text-[#9AA49F]">
          {label}
        </p>

        <p className="mt-0.5 text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">
          {value || "Not assigned"}
        </p>

      </div>

    </div>
  );
}


/* ============================================================
   INFO BOX
============================================================ */

function InfoBox({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-[#FAFAF7] p-3 dark:bg-[#202B27]">

      <p className="text-[9px] text-[#9AA49F]">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-[#17201D] dark:text-white">
        {value}
      </p>

    </div>
  );
}
"use client";

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  FileText,
  HeartPulse,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserRound,
  Users,
  X,
  ClipboardCheck,
} from "lucide-react";

import { useMemo, useState } from "react";

const initialSurgeries = [
  {
    id: "SUR-001",
    patient: "Aarav Mehta",
    patientId: "PAT-1024",
    age: 42,
    gender: "Male",
    surgery: "Appendectomy",
    category: "General Surgery",
    surgeon: "Dr. Rajiv Sharma",
    anesthetist: "Dr. Priya Kapoor",
    theater: "Operation Theater 01",
    date: "13 Aug 2026",
    time: "09:00 AM",
    duration: "2h 30m",
    priority: "Routine",
    status: "Scheduled",
    anesthesia: "General Anesthesia",
    diagnosis: "Acute Appendicitis",
    admissionType: "Inpatient",
    preOp: "Completed",
    postOp: "Pending",
    notes: "Patient stable and ready for surgery.",
  },
  {
    id: "SUR-002",
    patient: "Rohan Kapoor",
    patientId: "PAT-1088",
    age: 58,
    gender: "Male",
    surgery: "CABG",
    category: "Cardiac Surgery",
    surgeon: "Dr. Amit Verma",
    anesthetist: "Dr. Neha Gupta",
    theater: "Operation Theater 02",
    date: "13 Aug 2026",
    time: "12:00 PM",
    duration: "4h",
    priority: "High",
    status: "Scheduled",
    anesthesia: "General Anesthesia",
    diagnosis: "Coronary Artery Disease",
    admissionType: "Inpatient",
    preOp: "Completed",
    postOp: "Pending",
    notes: "Cardiac monitoring required.",
  },
  {
    id: "SUR-003",
    patient: "Priya Sharma",
    patientId: "PAT-1142",
    age: 51,
    gender: "Female",
    surgery: "Knee Replacement",
    category: "Orthopedic Surgery",
    surgeon: "Dr. Neha Singh",
    anesthetist: "Dr. Rahul Jain",
    theater: "Operation Theater 03",
    date: "13 Aug 2026",
    time: "10:30 AM",
    duration: "3h",
    priority: "Routine",
    status: "In Progress",
    anesthesia: "Spinal Anesthesia",
    diagnosis: "Severe Osteoarthritis",
    admissionType: "Inpatient",
    preOp: "Completed",
    postOp: "Pending",
    notes: "Surgery currently in progress.",
  },
  {
    id: "SUR-004",
    patient: "Vikram Joshi",
    patientId: "PAT-1190",
    age: 37,
    gender: "Male",
    surgery: "Hernia Repair",
    category: "General Surgery",
    surgeon: "Dr. Karan Patel",
    anesthetist: "Dr. Meera Shah",
    theater: "Operation Theater 04",
    date: "12 Aug 2026",
    time: "02:00 PM",
    duration: "1h 30m",
    priority: "Routine",
    status: "Completed",
    anesthesia: "General Anesthesia",
    diagnosis: "Inguinal Hernia",
    admissionType: "Inpatient",
    preOp: "Completed",
    postOp: "Completed",
    notes: "Procedure completed successfully.",
  },
  {
    id: "SUR-005",
    patient: "Ananya Verma",
    patientId: "PAT-1211",
    age: 46,
    gender: "Female",
    surgery: "Brain Tumor Removal",
    category: "Neurosurgery",
    surgeon: "Dr. Priya Gupta",
    anesthetist: "Dr. Arjun Malhotra",
    theater: "Operation Theater 05",
    date: "14 Aug 2026",
    time: "08:00 AM",
    duration: "6h",
    priority: "High",
    status: "Scheduled",
    anesthesia: "General Anesthesia",
    diagnosis: "Benign Brain Tumor",
    admissionType: "Inpatient",
    preOp: "Pending",
    postOp: "Pending",
    notes: "Pre-operative assessment pending.",
  },
  {
    id: "SUR-006",
    patient: "Meera Singh",
    patientId: "PAT-1260",
    age: 29,
    gender: "Female",
    surgery: "Gallbladder Removal",
    category: "General Surgery",
    surgeon: "Dr. Rahul Mehta",
    anesthetist: "Dr. Kavita Rao",
    theater: "Operation Theater 06",
    date: "11 Aug 2026",
    time: "11:00 AM",
    duration: "2h",
    priority: "Routine",
    status: "Cancelled",
    anesthesia: "General Anesthesia",
    diagnosis: "Gallstones",
    admissionType: "Inpatient",
    preOp: "Completed",
    postOp: "Not Required",
    notes: "Cancelled due to abnormal pre-operative reports.",
  },
];

export default function SurgeriesPage() {
  const [surgeries, setSurgeries] = useState(initialSurgeries);

  const [selectedSurgery, setSelectedSurgery] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [editing, setEditing] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [priorityFilter, setPriorityFilter] = useState("All");

  const [form, setForm] = useState({
    patient: "",
    patientId: "",
    age: "",
    gender: "",
    surgery: "",
    category: "",
    surgeon: "",
    anesthetist: "",
    theater: "",
    date: "",
    time: "",
    duration: "",
    priority: "Routine",
    status: "Scheduled",
    anesthesia: "",
    diagnosis: "",
    admissionType: "Inpatient",
    preOp: "Pending",
    postOp: "Pending",
    notes: "",
  });

  const filteredSurgeries = useMemo(() => {
    return surgeries.filter((surgery) => {
      const text = `
        ${surgery.patient}
        ${surgery.patientId}
        ${surgery.surgery}
        ${surgery.category}
        ${surgery.surgeon}
        ${surgery.theater}
        ${surgery.id}
      `.toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "All" ||
        surgery.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        surgery.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    surgeries,
    search,
    statusFilter,
    priorityFilter,
  ]);

  const stats = {
    total: surgeries.length,

    scheduled: surgeries.filter(
      (s) => s.status === "Scheduled"
    ).length,

    progress: surgeries.filter(
      (s) => s.status === "In Progress"
    ).length,

    completed: surgeries.filter(
      (s) => s.status === "Completed"
    ).length,

    cancelled: surgeries.filter(
      (s) => s.status === "Cancelled"
    ).length,
  };

  const openAdd = () => {
    setForm({
      patient: "",
      patientId: "",
      age: "",
      gender: "",
      surgery: "",
      category: "",
      surgeon: "",
      anesthetist: "",
      theater: "",
      date: "",
      time: "",
      duration: "",
      priority: "Routine",
      status: "Scheduled",
      anesthesia: "",
      diagnosis: "",
      admissionType: "Inpatient",
      preOp: "Pending",
      postOp: "Pending",
      notes: "",
    });

    setEditing(false);
    setSelectedSurgery(null);
    setShowForm(true);
  };

  const openEdit = (surgery) => {
    setForm({
      patient: surgery.patient,
      patientId: surgery.patientId,
      age: String(surgery.age),
      gender: surgery.gender,
      surgery: surgery.surgery,
      category: surgery.category,
      surgeon: surgery.surgeon,
      anesthetist: surgery.anesthetist,
      theater: surgery.theater,
      date: surgery.date,
      time: surgery.time,
      duration: surgery.duration,
      priority: surgery.priority,
      status: surgery.status,
      anesthesia: surgery.anesthesia,
      diagnosis: surgery.diagnosis,
      admissionType: surgery.admissionType,
      preOp: surgery.preOp,
      postOp: surgery.postOp,
      notes: surgery.notes,
    });

    setSelectedSurgery(surgery);
    setEditing(true);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editing && selectedSurgery) {
      setSurgeries((prev) =>
        prev.map((surgery) =>
          surgery.id === selectedSurgery.id
            ? {
                ...surgery,
                ...form,
                age: Number(form.age),
              }
            : surgery
        )
      );
    } else {
      const newSurgery = {
        ...form,
        id: `SUR-${String(
          surgeries.length + 1
        ).padStart(3, "0")}`,
        age: Number(form.age),
      };

      setSurgeries((prev) => [
        ...prev,
        newSurgery,
      ]);
    }

    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(false);
    setSelectedSurgery(null);
  };

  const deleteSurgery = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this surgery record?"
    );

    if (!confirmed) return;

    setSurgeries((prev) =>
      prev.filter((surgery) => surgery.id !== id)
    );

    setSelectedSurgery(null);
  };

  const cancelSurgery = (id) => {
    setSurgeries((prev) =>
      prev.map((surgery) =>
        surgery.id === id
          ? {
              ...surgery,
              status: "Cancelled",
            }
          : surgery
      )
    );

    setSelectedSurgery(null);
  };

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
              Surgeries
            </span>

          </div>

          <h1 className="mt-2 text-2xl font-bold text-[#17201D] sm:text-3xl dark:text-white">
            Surgeries
          </h1>

          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage surgical procedures, schedules, surgeons and
            patient operations.
          </p>

        </div>

        <button
          onClick={openAdd}
          className="flex w-fit items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B625C]"
        >
          <Plus size={17} />
          Schedule Surgery
        </button>

      </div>


      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="Total Surgeries"
          value={stats.total}
          subtitle="All records"
          icon={<HeartPulse size={20} />}
          bg="bg-[#E7F5F2]"
          color="text-[#0F766E]"
        />

        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          subtitle="Upcoming"
          icon={<CalendarDays size={20} />}
          bg="bg-[#EEF2FF]"
          color="text-[#5367B8]"
        />

        <StatCard
          title="In Progress"
          value={stats.progress}
          subtitle="Currently active"
          icon={<Activity size={20} />}
          bg="bg-[#FFF3E8]"
          color="text-[#C87924]"
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle="Successfully done"
          icon={<CheckCircle2 size={20} />}
          bg="bg-[#ECFDF5]"
          color="text-[#0F766E]"
        />

        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          subtitle="Cancelled cases"
          icon={<AlertCircle size={20} />}
          bg="bg-[#FFF1F1]"
          color="text-[#C84B4B]"
        />

      </div>


      {/* =====================================================
          FILTER BAR
      ====================================================== */}

      <div className="mt-6 rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex flex-col gap-3 xl:flex-row">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA49F]"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search patient, surgery, surgeon..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2.5 pl-11 pr-4 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
            />

          </div>


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
          >

            <option value="All">
              All Status
            </option>

            <option value="Scheduled">
              Scheduled
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>


          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
          >

            <option value="All">
              All Priority
            </option>

            <option value="Routine">
              Routine
            </option>

            <option value="High">
              High Priority
            </option>

            <option value="Emergency">
              Emergency
            </option>

          </select>

        </div>

      </div>


      {/* =====================================================
          SURGERY LIST
      ====================================================== */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#E3E0D7] bg-white shadow-sm dark:border-white/10 dark:bg-[#18211E]">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead>

              <tr className="border-b border-[#EEECE5] bg-[#FAFAF7] dark:border-white/10 dark:bg-[#202B27]">

                <Th>Surgery</Th>
                <Th>Patient</Th>
                <Th>Surgeon</Th>
                <Th>OT / Schedule</Th>
                <Th>Priority</Th>
                <Th>Status</Th>
                <Th>Actions</Th>

              </tr>

            </thead>

            <tbody>

              {filteredSurgeries.map((surgery) => (

                <tr
                  key={surgery.id}
                  className="border-b border-[#F0EEE8] transition hover:bg-[#FCFBF8] dark:border-white/5 dark:hover:bg-[#202B27]"
                >

                  {/* Surgery */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
                        <HeartPulse size={18} />
                      </div>

                      <div>

                        <p className="text-xs font-bold text-[#17201D] dark:text-white">
                          {surgery.surgery}
                        </p>

                        <p className="mt-1 text-[9px] text-[#87938E]">
                          {surgery.id}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* Patient */}

                  <td className="px-5 py-4">

                    <p className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
                      {surgery.patient}
                    </p>

                    <p className="mt-1 text-[9px] text-[#87938E]">
                      {surgery.patientId} • {surgery.age} yrs
                    </p>

                  </td>


                  {/* Surgeon */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <Stethoscope
                        size={14}
                        className="text-[#0F766E]"
                      />

                      <span className="text-xs text-[#52615B] dark:text-[#AAB6B0]">
                        {surgery.surgeon}
                      </span>

                    </div>

                  </td>


                  {/* OT */}

                  <td className="px-5 py-4">

                    <p className="text-[10px] font-semibold text-[#52615B] dark:text-[#AAB6B0]">
                      {surgery.theater}
                    </p>

                    <div className="mt-1 flex items-center gap-2">

                      <CalendarDays
                        size={12}
                        className="text-[#87938E]"
                      />

                      <span className="text-[9px] text-[#87938E]">
                        {surgery.date} • {surgery.time}
                      </span>

                    </div>

                  </td>


                  {/* Priority */}

                  <td className="px-5 py-4">

                    <PriorityBadge
                      priority={surgery.priority}
                    />

                  </td>


                  {/* Status */}

                  <td className="px-5 py-4">

                    <StatusBadge
                      status={surgery.status}
                    />

                  </td>


                  {/* Actions */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-1">

                      <button
                        onClick={() =>
                          setSelectedSurgery(surgery)
                        }
                        title="View"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64746E] hover:bg-[#E7F5F2] hover:text-[#0F766E]"
                      >
                        <ChevronRight size={15} />
                      </button>

                      <button
                        onClick={() =>
                          openEdit(surgery)
                        }
                        title="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64746E] hover:bg-[#E7F5F2] hover:text-[#0F766E]"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() =>
                          deleteSurgery(surgery.id)
                        }
                        title="Delete"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {filteredSurgeries.length === 0 && (

          <div className="p-12 text-center">

            <Search
              size={30}
              className="mx-auto text-[#A1AAA6]"
            />

            <p className="mt-3 text-sm font-bold text-[#17201D] dark:text-white">
              No surgeries found
            </p>

            <p className="mt-1 text-xs text-[#87938E]">
              Try changing your search or filters.
            </p>

          </div>

        )}

      </div>


      {/* =====================================================
          VIEW MODAL
      ====================================================== */}

      {selectedSurgery && !showForm && (

        <Modal
          title="Surgery Details"
          onClose={() =>
            setSelectedSurgery(null)
          }
        >

          <div className="space-y-5">

            {/* Header */}

            <div className="flex flex-col gap-3 rounded-2xl bg-[#FAFAF7] p-4 sm:flex-row sm:items-center dark:bg-[#202B27]">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
                <HeartPulse size={22} />
              </div>

              <div>

                <h2 className="text-base font-bold text-[#17201D] dark:text-white">
                  {selectedSurgery.surgery}
                </h2>

                <p className="mt-1 text-[10px] text-[#87938E]">
                  {selectedSurgery.id} •{" "}
                  {selectedSurgery.category}
                </p>

              </div>

              <div className="sm:ml-auto">

                <StatusBadge
                  status={selectedSurgery.status}
                />

              </div>

            </div>


            {/* Patient */}

            <div className="rounded-2xl border border-[#E3E0D7] p-5 dark:border-white/10">

              <h3 className="text-xs font-bold text-[#17201D] dark:text-white">
                Patient Information
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">

                <Detail
                  label="Patient"
                  value={selectedSurgery.patient}
                  icon={<UserRound size={14} />}
                />

                <Detail
                  label="Patient ID"
                  value={selectedSurgery.patientId}
                  icon={<ClipboardCheck size={14} />}
                />

                <Detail
                  label="Age / Gender"
                  value={`${selectedSurgery.age} yrs / ${selectedSurgery.gender}`}
                  icon={<Users size={14} />}
                />

              </div>

            </div>


            {/* Surgery Details */}

            <div className="rounded-2xl border border-[#E3E0D7] p-5 dark:border-white/10">

              <h3 className="text-xs font-bold text-[#17201D] dark:text-white">
                Surgical Information
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                <Detail
                  label="Surgeon"
                  value={selectedSurgery.surgeon}
                  icon={<Stethoscope size={14} />}
                />

                <Detail
                  label="Anesthetist"
                  value={selectedSurgery.anesthetist}
                  icon={<UserRound size={14} />}
                />

                <Detail
                  label="Operation Theater"
                  value={selectedSurgery.theater}
                  icon={<HeartPulse size={14} />}
                />

                <Detail
                  label="Anesthesia"
                  value={selectedSurgery.anesthesia}
                  icon={<Activity size={14} />}
                />

                <Detail
                  label="Date & Time"
                  value={`${selectedSurgery.date} • ${selectedSurgery.time}`}
                  icon={<CalendarDays size={14} />}
                />

                <Detail
                  label="Expected Duration"
                  value={selectedSurgery.duration}
                  icon={<Clock3 size={14} />}
                />

              </div>

            </div>


            {/* Pre/Post Op */}

            <div className="grid gap-3 sm:grid-cols-2">

              <ProcessBox
                title="Pre-Operative Assessment"
                value={selectedSurgery.preOp}
              />

              <ProcessBox
                title="Post-Operative Status"
                value={selectedSurgery.postOp}
              />

            </div>


            {/* Diagnosis */}

            <div className="rounded-xl bg-[#E7F5F2] p-4">

              <p className="text-[9px] font-bold uppercase tracking-wide text-[#0F766E]">
                Diagnosis
              </p>

              <p className="mt-1 text-xs font-semibold text-[#17201D] dark:text-white">
                {selectedSurgery.diagnosis}
              </p>

            </div>


            {/* Notes */}

            <div>

              <p className="text-xs font-bold text-[#17201D] dark:text-white">
                Clinical Notes
              </p>

              <p className="mt-2 rounded-xl bg-[#FAFAF7] p-4 text-xs leading-5 text-[#7B8882] dark:bg-[#202B27] dark:text-[#AAB6B0]">
                {selectedSurgery.notes}
              </p>

            </div>


            {/* Actions */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#EEECE5] pt-5 sm:flex-row sm:justify-end dark:border-white/10">

              {selectedSurgery.status !== "Completed" &&
                selectedSurgery.status !== "Cancelled" && (

                  <button
                    onClick={() =>
                      cancelSurgery(
                        selectedSurgery.id
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50"
                  >
                    <AlertCircle size={15} />
                    Cancel Surgery
                  </button>

                )}

              <button
                onClick={() =>
                  openEdit(selectedSurgery)
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0B625C]"
              >
                <Edit3 size={15} />
                Edit Surgery
              </button>

            </div>

          </div>

        </Modal>

      )}


      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showForm && (

        <Modal
          title={
            editing
              ? "Edit Surgery"
              : "Schedule New Surgery"
          }
          onClose={closeForm}
          wide
        >

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Patient */}

            <FormSection
              icon={<UserRound size={17} />}
              title="Patient Information"
            >

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <Input
                  label="Patient Name"
                  name="patient"
                  value={form.patient}
                  onChange={handleChange}
                  placeholder="Patient name"
                  required
                />

                <Input
                  label="Patient ID"
                  name="patientId"
                  value={form.patientId}
                  onChange={handleChange}
                  placeholder="PAT-0000"
                  required
                />

                <Input
                  label="Age"
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                />

                <Select
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  options={[
                    "Male",
                    "Female",
                    "Other",
                  ]}
                  required
                />

              </div>

            </FormSection>


            {/* Surgery */}

            <FormSection
              icon={<HeartPulse size={17} />}
              title="Surgery Information"
            >

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <Input
                  label="Surgery Name"
                  name="surgery"
                  value={form.surgery}
                  onChange={handleChange}
                  placeholder="e.g. Appendectomy"
                  required
                />

                <Select
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  options={[
                    "General Surgery",
                    "Cardiac Surgery",
                    "Orthopedic Surgery",
                    "Neurosurgery",
                    "Gynecological Surgery",
                    "Urology",
                    "ENT",
                    "Plastic Surgery",
                  ]}
                  required
                />

                <Input
                  label="Diagnosis"
                  name="diagnosis"
                  value={form.diagnosis}
                  onChange={handleChange}
                  placeholder="Patient diagnosis"
                  required
                />

                <Select
                  label="Surgeon"
                  name="surgeon"
                  value={form.surgeon}
                  onChange={handleChange}
                  options={[
                    "Dr. Rajiv Sharma",
                    "Dr. Amit Verma",
                    "Dr. Neha Singh",
                    "Dr. Karan Patel",
                    "Dr. Priya Gupta",
                    "Dr. Rahul Mehta",
                  ]}
                  required
                />

                <Select
                  label="Anesthetist"
                  name="anesthetist"
                  value={form.anesthetist}
                  onChange={handleChange}
                  options={[
                    "Dr. Priya Kapoor",
                    "Dr. Neha Gupta",
                    "Dr. Rahul Jain",
                    "Dr. Meera Shah",
                    "Dr. Arjun Malhotra",
                    "Dr. Kavita Rao",
                  ]}
                  required
                />

                <Select
                  label="Anesthesia"
                  name="anesthesia"
                  value={form.anesthesia}
                  onChange={handleChange}
                  options={[
                    "General Anesthesia",
                    "Spinal Anesthesia",
                    "Local Anesthesia",
                    "Regional Anesthesia",
                    "Sedation",
                  ]}
                  required
                />

              </div>

            </FormSection>


            {/* Schedule */}

            <FormSection
              icon={<CalendarDays size={17} />}
              title="Operation Schedule"
            >

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <Select
                  label="Operation Theater"
                  name="theater"
                  value={form.theater}
                  onChange={handleChange}
                  options={[
                    "Operation Theater 01",
                    "Operation Theater 02",
                    "Operation Theater 03",
                    "Operation Theater 04",
                    "Operation Theater 05",
                    "Operation Theater 06",
                  ]}
                  required
                />

                <Input
                  label="Date"
                  name="date"
                  type="text"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="13 Aug 2026"
                  required
                />

                <Input
                  label="Time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  placeholder="09:00 AM"
                  required
                />

                <Input
                  label="Expected Duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="2h 30m"
                  required
                />

              </div>

            </FormSection>


            {/* Status */}

            <FormSection
              icon={<ClipboardCheck size={17} />}
              title="Surgery Status"
            >

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <Select
                  label="Priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  options={[
                    "Routine",
                    "High",
                    "Emergency",
                  ]}
                />

                <Select
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={[
                    "Scheduled",
                    "In Progress",
                    "Completed",
                    "Cancelled",
                  ]}
                />

                <Select
                  label="Admission Type"
                  name="admissionType"
                  value={form.admissionType}
                  onChange={handleChange}
                  options={[
                    "Inpatient",
                    "Outpatient",
                    "Emergency",
                  ]}
                />

                <Select
                  label="Pre-Op Status"
                  name="preOp"
                  value={form.preOp}
                  onChange={handleChange}
                  options={[
                    "Pending",
                    "In Progress",
                    "Completed",
                  ]}
                />

              </div>

            </FormSection>


            {/* Notes */}

            <FormSection
              icon={<FileText size={17} />}
              title="Clinical Notes"
            >

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Enter surgery notes, special instructions..."
                className="w-full resize-none rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-3 text-xs text-[#17201D] outline-none placeholder:text-[#A1AAA6] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
              />

            </FormSection>


            {/* Buttons */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#EEECE5] pt-5 sm:flex-row sm:justify-end dark:border-white/10">

              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-[#DDD9CE] px-6 py-3 text-xs font-bold text-[#52615B] hover:bg-[#F4F3EE] dark:border-white/10 dark:text-[#AAB6B0]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-6 py-3 text-xs font-bold text-white hover:bg-[#0B625C]"
              >
                <CheckCircle2 size={15} />

                {editing
                  ? "Save Changes"
                  : "Schedule Surgery"}

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

      <p className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] text-[#87938E]">
        {subtitle}
      </p>

    </div>
  );
}


/* ============================================================
   TABLE HEADER
============================================================ */

function Th({ children }) {
  return (
    <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wide text-[#87938E]">
      {children}
    </th>
  );
}


/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({ status }) {
  const styles = {
    Scheduled: "bg-[#EEF2FF] text-[#5367B8]",
    "In Progress": "bg-[#FFF3E8] text-[#C87924]",
    Completed: "bg-[#ECFDF5] text-[#0F766E]",
    Cancelled: "bg-[#FFF1F1] text-[#C84B4B]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}


/* ============================================================
   PRIORITY BADGE
============================================================ */

function PriorityBadge({ priority }) {
  const styles = {
    Routine: "bg-[#F1F3EF] text-[#66736D]",
    High: "bg-[#FFF3E8] text-[#C87924]",
    Emergency: "bg-[#FFF1F1] text-[#C84B4B]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[priority]
      }`}
    >
      {priority}
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
  wide = false,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17201D]/40 p-4 backdrop-blur-sm">

      <div
        className={`max-h-[94vh] w-full overflow-hidden rounded-2xl border border-[#E3E0D7] bg-white shadow-2xl dark:border-white/10 dark:bg-[#18211E] ${
          wide ? "max-w-5xl" : "max-w-3xl"
        }`}
      >

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

        <div className="max-h-[calc(94vh-65px)] overflow-y-auto p-5 sm:p-6">
          {children}
        </div>

      </div>

    </div>
  );
}


/* ============================================================
   FORM SECTION
============================================================ */

function FormSection({
  icon,
  title,
  children,
}) {
  return (
    <section className="rounded-2xl border border-[#E3E0D7] bg-white p-5 dark:border-white/10 dark:bg-[#18211E]">

      <div className="mb-5 flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
          {icon}
        </div>

        <h3 className="text-sm font-bold text-[#17201D] dark:text-white">
          {title}
        </h3>

      </div>

      {children}

    </section>
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

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E7F5F2] text-[#0F766E]">
        {icon}
      </div>

      <div>

        <p className="text-[9px] text-[#9AA49F]">
          {label}
        </p>

        <p className="mt-0.5 text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">
          {value || "Not available"}
        </p>

      </div>

    </div>
  );
}


/* ============================================================
   PROCESS BOX
============================================================ */

function ProcessBox({
  title,
  value,
}) {
  const completed = value === "Completed";

  return (
    <div className="rounded-xl border border-[#E3E0D7] p-4 dark:border-white/10">

      <div className="flex items-center gap-2">

        {completed ? (
          <CheckCircle2
            size={16}
            className="text-[#0F766E]"
          />
        ) : (
          <Clock3
            size={16}
            className="text-[#C87924]"
          />
        )}

        <p className="text-xs font-bold text-[#17201D] dark:text-white">
          {title}
        </p>

      </div>

      <p
        className={`mt-2 text-[10px] font-semibold ${
          completed
            ? "text-[#0F766E]"
            : "text-[#C87924]"
        }`}
      >
        {value}
      </p>

    </div>
  );
}
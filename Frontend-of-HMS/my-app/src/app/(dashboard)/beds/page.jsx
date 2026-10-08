"use client";

import {
  Activity,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  Filter,
  HeartPulse,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  Wrench,
  X,
} from "lucide-react";

import { useMemo, useState, useEffect } from "react";
import { getBedsFromStorage, saveBedsToStorage } from "../../utils/bedStore";
import { bedAPI } from "../../services/api";

export default function BedsPage() {
  const [beds, setBeds] = useState([]);

  // Load from backend API and sync with shared storage
  const loadBeds = async () => {
    try {
      const res = await bedAPI.getBeds();
      const raw = res?.data || (Array.isArray(res) ? res : []);
      if (raw.length > 0) {
        const mapped = raw.map((b, idx) => ({
          id: b._id || `BED-${String(idx + 1).padStart(3, "0")}`,
          bedNumber: b.bedNumber,
          ward: b.wardId?.wardName || b.ward || "General Medicine Ward",
          wardId: b.wardId?._id || b.wardId || "WRD-007",
          floor: b.wardId?.floor || b.floor || "1st Floor",
          type: b.bedType || b.type || "General",
          status: b.status === "UnderMaintenance" ? "Maintenance" : b.status,
          patient: b.currentPatientId?.name || b.currentPatientId?.patientName || b.patient || null,
          patientId: b.currentPatientId?.patientId || b.patientId || null,
          admissionId: b.admissionId?._id || b.admissionId || null,
          assignedDoctor: b.assignedDoctor || null,
          lastCleaned: b.lastCleaned || "Today",
          equipment: b.equipment || "Standard",
        }));
        setBeds(mapped);
        saveBedsToStorage(mapped);
        return;
      }
    } catch (_) {}
    setBeds(getBedsFromStorage());
  };

  useEffect(() => {
    loadBeds();
    const handler = () => setBeds(getBedsFromStorage());
    window.addEventListener("hms_beds_updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("hms_beds_updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // Helper: update state AND persist to shared store
  const persistBeds = (updater) => {
    setBeds((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveBedsToStorage(next);
      return next;
    });
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [wardFilter, setWardFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [selectedBed, setSelectedBed] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    bedNumber: "",
    ward: "",
    floor: "",
    type: "General",
    status: "Available",
    equipment: "Standard",
    lastCleaned: "",
  });

  const filteredBeds = useMemo(() => {
    return beds.filter((bed) => {
      const searchable = `
        ${bed.bedNumber}
        ${bed.id}
        ${bed.ward}
        ${bed.patient || ""}
        ${bed.patientId || ""}
        ${bed.assignedDoctor || ""}
        ${bed.status}
      `.toLowerCase();

      const matchesSearch = searchable.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "All" ||
        bed.status === statusFilter;

      const matchesWard =
        wardFilter === "All" ||
        bed.ward === wardFilter;

      const matchesType =
        typeFilter === "All" ||
        bed.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesWard &&
        matchesType
      );
    });
  }, [
    beds,
    search,
    statusFilter,
    wardFilter,
    typeFilter,
  ]);

  const stats = {
    total: beds.length,

    available: beds.filter(
      (bed) => bed.status === "Available"
    ).length,

    occupied: beds.filter(
      (bed) => bed.status === "Occupied"
    ).length,

    reserved: beds.filter(
      (bed) => bed.status === "Reserved"
    ).length,

    maintenance: beds.filter(
      (bed) =>
        bed.status === "Maintenance" ||
        bed.status === "Cleaning"
    ).length,
  };

  const openAdd = () => {
    setForm({
      bedNumber: "",
      ward: "",
      floor: "",
      type: "General",
      status: "Available",
      equipment: "Standard",
      lastCleaned: "",
    });

    setEditing(false);
    setSelectedBed(null);
    setShowForm(true);
  };

  const openEdit = (bed) => {
    setForm({
      bedNumber: bed.bedNumber,
      ward: bed.ward,
      floor: bed.floor,
      type: bed.type,
      status: bed.status,
      equipment: bed.equipment,
      lastCleaned: bed.lastCleaned,
    });

    setSelectedBed(bed);
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

    if (editing && selectedBed) {
      persistBeds((prev) =>
        prev.map((bed) =>
          bed.id === selectedBed.id ? { ...bed, ...form } : bed
        )
      );
    } else {
      const newBed = {
        ...form,
        id: `BED-${String(beds.length + 1).padStart(3, "0")}`,
        wardId: `WRD-${String(beds.length + 1).padStart(3, "0")}`,
        patient: null, patientId: null, admissionId: null, assignedDoctor: null,
      };
      persistBeds((prev) => [...prev, newBed]);
    }
    closeForm();
  };

  const deleteBed = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this bed?");
    if (!confirmed) return;
    persistBeds((prev) => prev.filter((bed) => bed.id !== id));
    setSelectedBed(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(false);
    setSelectedBed(null);
  };

  const wardOptions = [
    ...new Set(beds.map((bed) => bed.ward)),
  ];

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
              Beds
            </span>

          </div>

          <h1 className="mt-2 text-2xl font-bold text-[#17201D] sm:text-3xl dark:text-white">
            Bed Management
          </h1>

          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage bed availability, occupancy, reservations and maintenance.
          </p>

        </div>

        <button
          onClick={openAdd}
          className="flex w-fit items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]"
        >
          <Plus size={17} />
          Add Bed
        </button>

      </div>


      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="Total Beds"
          value={stats.total}
          subtitle="Registered beds"
          icon={<BedDouble size={20} />}
          bg="bg-[#E7F5F2]"
          color="text-[#0F766E]"
        />

        <StatCard
          title="Available"
          value={stats.available}
          subtitle="Ready for admission"
          icon={<CheckCircle2 size={20} />}
          bg="bg-[#ECFDF5]"
          color="text-[#0F766E]"
        />

        <StatCard
          title="Occupied"
          value={stats.occupied}
          subtitle="Currently occupied"
          icon={<Users size={20} />}
          bg="bg-[#FFF3E8]"
          color="text-[#C87924]"
        />

        <StatCard
          title="Reserved"
          value={stats.reserved}
          subtitle="Reserved beds"
          icon={<CalendarDays size={20} />}
          bg="bg-[#EEF2FF]"
          color="text-[#5367B8]"
        />

        <StatCard
          title="Maintenance"
          value={stats.maintenance}
          subtitle="Unavailable"
          icon={<Wrench size={20} />}
          bg="bg-[#FFF1F1]"
          color="text-[#C84B4B]"
        />

      </div>


      {/* =====================================================
          SEARCH + FILTER
      ====================================================== */}

      <div className="mt-6 rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex flex-col gap-3 xl:flex-row">

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
              placeholder="Search bed, ward, patient..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2.5 pl-11 pr-4 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
            />

          </div>

          <select
            value={wardFilter}
            onChange={(e) =>
              setWardFilter(e.target.value)
            }
            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
          >

            <option value="All">
              All Wards
            </option>

            {wardOptions.map((ward) => (
              <option
                key={ward}
                value={ward}
              >
                {ward}
              </option>
            ))}

          </select>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
          >

            <option value="All">
              All Types
            </option>

            <option value="General">
              General
            </option>

            <option value="Private">
              Private
            </option>

            <option value="ICU">
              ICU
            </option>

            <option value="Pediatric">
              Pediatric
            </option>

            <option value="Emergency">
              Emergency
            </option>

          </select>

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

            <option value="Available">
              Available
            </option>

            <option value="Occupied">
              Occupied
            </option>

            <option value="Reserved">
              Reserved
            </option>

            <option value="Cleaning">
              Cleaning
            </option>

            <option value="Maintenance">
              Maintenance
            </option>

          </select>

        </div>

      </div>


      {/* =====================================================
          BED GRID
      ====================================================== */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {filteredBeds.map((bed) => (

          <BedCard
            key={bed.id}
            bed={bed}
            onView={() => setSelectedBed(bed)}
            onEdit={() => openEdit(bed)}
          />

        ))}

      </div>


      {/* EMPTY STATE */}

      {filteredBeds.length === 0 && (

        <div className="mt-6 rounded-2xl border border-[#E3E0D7] bg-white p-12 text-center dark:border-white/10 dark:bg-[#18211E]">

          <BedDouble
            size={32}
            className="mx-auto text-[#A1AAA6]"
          />

          <p className="mt-3 text-sm font-bold text-[#17201D] dark:text-white">
            No beds found
          </p>

          <p className="mt-1 text-xs text-[#87938E]">
            Try changing your search or filters.
          </p>

        </div>

      )}


      {/* =====================================================
          VIEW BED MODAL
      ====================================================== */}

      {selectedBed && !showForm && (

        <Modal
          title="Bed Details"
          onClose={() =>
            setSelectedBed(null)
          }
        >

          <div className="space-y-5">

            <div className="flex items-center gap-4 rounded-2xl bg-[#FAFAF7] p-4 dark:bg-[#202B27]">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
                <BedDouble size={23} />
              </div>

              <div>

                <h2 className="text-base font-bold text-[#17201D] dark:text-white">
                  {selectedBed.bedNumber}
                </h2>

                <p className="mt-1 text-[10px] text-[#87938E]">
                  {selectedBed.id} • {selectedBed.type}
                </p>

              </div>

              <div className="ml-auto">
                <StatusBadge
                  status={selectedBed.status}
                />
              </div>

            </div>


            {/* Location */}

            <div className="rounded-2xl border border-[#E3E0D7] p-5 dark:border-white/10">

              <h3 className="text-xs font-bold text-[#17201D] dark:text-white">
                Bed Location
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">

                <Detail
                  label="Ward"
                  value={selectedBed.ward}
                  icon={<Building2 size={14} />}
                />

                <Detail
                  label="Floor"
                  value={selectedBed.floor}
                  icon={<Building2 size={14} />}
                />

                <Detail
                  label="Bed Type"
                  value={selectedBed.type}
                  icon={<BedDouble size={14} />}
                />

              </div>

            </div>


            {/* Patient */}

            {selectedBed.patient ? (

              <div className="rounded-2xl border border-[#E3E0D7] p-5 dark:border-white/10">

                <h3 className="text-xs font-bold text-[#17201D] dark:text-white">
                  Current Patient
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  <Detail
                    label="Patient"
                    value={selectedBed.patient}
                    icon={<UserRound size={14} />}
                  />

                  <Detail
                    label="Patient ID"
                    value={selectedBed.patientId}
                    icon={<Users size={14} />}
                  />

                  <Detail
                    label="Admission ID"
                    value={selectedBed.admissionId}
                    icon={<Activity size={14} />}
                  />

                  <Detail
                    label="Assigned Doctor"
                    value={selectedBed.assignedDoctor}
                    icon={<HeartPulse size={14} />}
                  />

                </div>

              </div>

            ) : (

              <div className="rounded-xl bg-[#ECFDF5] p-4">

                <div className="flex items-center gap-3">

                  <CheckCircle2
                    size={19}
                    className="text-[#0F766E]"
                  />

                  <div>

                    <p className="text-xs font-bold text-[#17201D] dark:text-white">
                      Bed Available
                    </p>

                    <p className="mt-1 text-[10px] text-[#0F766E]">
                      This bed is ready for a new IPD admission.
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* Equipment */}

            <div className="flex items-center justify-between rounded-xl border border-[#E3E0D7] p-4 dark:border-white/10">

              <div className="flex items-center gap-3">

                <ShieldCheck
                  size={17}
                  className="text-[#0F766E]"
                />

                <span className="text-xs text-[#87938E]">
                  Equipment
                </span>

              </div>

              <span className="text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">
                {selectedBed.equipment}
              </span>

            </div>


            {/* Cleaning */}

            <div className="flex items-center justify-between rounded-xl border border-[#E3E0D7] p-4 dark:border-white/10">

              <div className="flex items-center gap-3">

                <Clock3
                  size={17}
                  className="text-[#0F766E]"
                />

                <span className="text-xs text-[#87938E]">
                  Last Cleaned
                </span>

              </div>

              <span className="text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">
                {selectedBed.lastCleaned}
              </span>

            </div>


            {/* Actions */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#EEECE5] pt-5 sm:flex-row sm:justify-end dark:border-white/10">

              <button
                onClick={() =>
                  deleteBed(selectedBed.id)
                }
                className="rounded-xl border border-red-200 px-5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                Delete Bed
              </button>

              <button
                onClick={() =>
                  openEdit(selectedBed)
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0B625C]"
              >
                <Edit3 size={15} />
                Edit Bed
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
              ? "Edit Bed"
              : "Add New Bed"
          }
          onClose={closeForm}
        >

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div className="grid gap-4 sm:grid-cols-2">

              <Input
                label="Bed Number"
                name="bedNumber"
                value={form.bedNumber}
                onChange={handleChange}
                placeholder="e.g. CARD-203"
                required
              />

              <Select
                label="Ward"
                name="ward"
                value={form.ward}
                onChange={handleChange}
                options={[
                  "Cardiology Ward A",
                  "Neurology Ward B",
                  "Orthopedic Ward A",
                  "Pediatric Ward",
                  "ICU",
                  "Emergency Unit",
                  "General Medicine Ward",
                  "Private Care Ward",
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
                label="Bed Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                options={[
                  "General",
                  "Private",
                  "ICU",
                  "Pediatric",
                  "Emergency",
                ]}
                required
              />

              <Select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={[
                  "Available",
                  "Occupied",
                  "Reserved",
                  "Cleaning",
                  "Maintenance",
                ]}
              />

              <Select
                label="Equipment"
                name="equipment"
                value={form.equipment}
                onChange={handleChange}
                options={[
                  "Standard",
                  "Fully Equipped",
                  "Cardiac Monitor",
                  "Ventilator Available",
                  "Pediatric Equipment",
                  "Emergency Equipped",
                  "Bed Repair Required",
                ]}
              />

              <Input
                label="Last Cleaned"
                name="lastCleaned"
                value={form.lastCleaned}
                onChange={handleChange}
                placeholder="13 Aug 2026"
              />

            </div>


            <div className="rounded-xl bg-[#E7F5F2] p-4">

              <div className="flex gap-3">

                <ShieldCheck
                  size={18}
                  className="shrink-0 text-[#0F766E]"
                />

                <div>

                  <p className="text-xs font-bold text-[#17201D] dark:text-white">
                    Bed Assignment
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#0F766E]">
                    Patient assignment should normally happen through
                    the IPD admission workflow rather than manually
                    assigning a patient here.
                  </p>

                </div>

              </div>

            </div>


            <div className="flex flex-col-reverse gap-3 border-t border-[#EEECE5] pt-5 sm:flex-row sm:justify-end dark:border-white/10">

              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-[#DDD9CE] px-5 py-2.5 text-xs font-bold text-[#52615B] hover:bg-[#F4F3EE] dark:border-white/10 dark:text-[#AAB6B0]"
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
                  : "Create Bed"}

              </button>

            </div>

          </form>

        </Modal>

      )}

    </div>
  );
}


/* ============================================================
   BED CARD
============================================================ */

function BedCard({
  bed,
  onView,
  onEdit,
}) {
  const occupied = bed.status === "Occupied";

  return (
    <div className="group rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#18211E]">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              occupied
                ? "bg-[#FFF3E8] text-[#C87924]"
                : "bg-[#E7F5F2] text-[#0F766E]"
            }`}
          >
            <BedDouble size={20} />
          </div>

          <div>

            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              {bed.bedNumber}
            </h2>

            <p className="mt-0.5 text-[9px] text-[#A1AAA6]">
              {bed.id}
            </p>

          </div>

        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#87938E] hover:bg-[#E7F5F2] hover:text-[#0F766E]">
          <MoreHorizontal size={17} />
        </button>

      </div>


      {/* Ward */}

      <div className="mt-4 flex flex-wrap gap-2">

        <span className="rounded-full bg-[#E7F5F2] px-2.5 py-1 text-[9px] font-semibold text-[#0F766E]">
          {bed.ward}
        </span>

        <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[9px] font-semibold text-[#5367B8]">
          {bed.type}
        </span>

      </div>


      {/* Patient */}

      <div className="mt-5 rounded-xl bg-[#FAFAF7] p-4 dark:bg-[#202B27]">

        {bed.patient ? (

          <>

            <div className="flex items-center gap-2">

              <UserRound
                size={14}
                className="text-[#0F766E]"
              />

              <span className="text-[9px] text-[#87938E]">
                Current Patient
              </span>

            </div>

            <p className="mt-1 text-xs font-bold text-[#17201D] dark:text-white">
              {bed.patient}
            </p>

            <p className="mt-1 text-[9px] text-[#87938E]">
              {bed.patientId}
            </p>

          </>

        ) : (

          <>

            <div className="flex items-center gap-2">

              <CheckCircle2
                size={14}
                className="text-[#0F766E]"
              />

              <span className="text-[9px] font-semibold text-[#0F766E]">
                No Patient Assigned
              </span>

            </div>

            <p className="mt-2 text-[10px] text-[#87938E]">
              Ready for IPD admission
            </p>

          </>

        )}

      </div>


      {/* Footer */}

      <div className="mt-4 flex items-center justify-between">

        <StatusBadge
          status={bed.status}
        />

        <span className="text-[9px] text-[#87938E]">
          {bed.floor}
        </span>

      </div>


      {/* Actions */}

      <div className="mt-4 flex gap-2 border-t border-[#EEECE5] pt-4 dark:border-white/10">

        <button
          onClick={onView}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#E7F5F2] py-2.5 text-[10px] font-bold text-[#0F766E] hover:bg-[#D9EFEB]"
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
    Occupied: "bg-[#FFF3E8] text-[#C87924]",
    Reserved: "bg-[#EEF2FF] text-[#5367B8]",
    Cleaning: "bg-[#FFF7E6] text-[#A87516]",
    Maintenance: "bg-[#FFF1F1] text-[#C84B4B]",
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

        <div className="max-h-[calc(92vh-65px)] overflow-y-auto p-5 sm:p-6">
          {children}
        </div>

      </div>

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
   INPUT
============================================================ */

function Input({
  label,
  name,
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

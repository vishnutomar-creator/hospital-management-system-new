"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Activity,
  BedDouble,
  Building2,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  Stethoscope,
  Users,
  Trash2,
  Eye,
} from "lucide-react";
import { departmentAPI } from "../../services/api";

export default function DepartmentsPage() {
  const [deptList, setDeptList] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentAPI.getDepartments();
      if (res.success && Array.isArray(res.data)) {
        const formatted = res.data.map((d, index) => ({
          id: d.departmentId || d._id || `DEP-00${index + 1}`,
          name: d.name || d.departmentName || "Department",
          description: d.description || "Hospital care and consultation",
          location: d.location || "Main Block",
          head: d.head || d.headDoctor || "Dr. Department Head",
          doctors: d.doctorsCount || 12,
          nurses: d.nursesCount || 20,
          beds: d.bedsCount || 30,
          availableBeds: d.availableBeds || 10,
          patients: d.patientsCount || 40,
          status: d.isActive !== false ? "Active" : "Inactive",
          phone: d.phone || "+91 751 245 1000",
          email: d.email || `${(d.name || "dept").toLowerCase().replace(/\s+/g, "")}@medicare.com`,
          color: "bg-[#E7F5F2] text-[#0F766E]",
        }));
        setDeptList(formatted);
      } else {
        setDeptList([]);
      }
    } catch (err) {
      console.warn("Department API load notice:", err.message);
      setDeptList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      await departmentAPI.deleteDepartment(id);
    } catch (err) {
      console.warn("Delete department notice:", err.message);
    } finally {
      setDeptList((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const filteredDepts = deptList.filter((d) => {
    const matchesQuery = `${d.name} ${d.id} ${d.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = selectedStatus === "All Status" || d.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#87938E]">
            <span>Hospital</span>
            <ChevronRight size={13} />
            <span className="text-[#0F766E]">Departments</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-[#17201D] sm:text-3xl dark:text-white">
            Departments
          </h1>

          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage hospital departments, staff, beds and resources.
          </p>
        </div>

        <Link
          href="/departments/add"
          className="flex w-fit items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]"
        >
          <Plus size={17} />
          Add Department
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Departments" value={deptList.length} subtitle="Registered" icon={<Building2 size={20} />} iconBg="bg-[#E7F5F2]" iconColor="text-[#0F766E]" />
        <StatCard title="Active Departments" value={deptList.filter((d) => d.status === "Active").length} subtitle="Operational" icon={<Stethoscope size={20} />} iconBg="bg-[#EEF2FF]" iconColor="text-[#5367B8]" />
        <StatCard title="Total Capacity Beds" value={deptList.reduce((acc, d) => acc + (Number(d.beds) || 0), 0)} subtitle="Hospital capacity" icon={<BedDouble size={20} />} iconBg="bg-[#FFF3E8]" iconColor="text-[#C87924]" />
        <StatCard title="Available Beds" value={deptList.reduce((acc, d) => acc + (Number(d.availableBeds) || 0), 0)} subtitle="Ready for admission" icon={<Users size={20} />} iconBg="bg-[#F2ECFA]" iconColor="text-[#7954A6]" />
      </div>

      {/* Search / Filter */}
      <div className="mt-6 rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-[360px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA49F]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search department by name or ID..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2.5 pl-10 pr-4 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs font-medium text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Department Cards */}
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredDepts.map((department) => (
          <DepartmentCard key={department.id} department={department} onDelete={handleDelete} />
        ))}

        {filteredDepts.length === 0 && (
          <div className="col-span-full rounded-2xl border border-[#E3E0D7] bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-[#18211E]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]">
              <Building2 size={24} />
            </div>
            <p className="mt-3 text-sm font-bold text-[#17201D] dark:text-white">
              {loading ? "Loading departments..." : "No departments found"}
            </p>
            <p className="mt-1 text-xs text-[#87938E]">
              {loading ? "Fetching department data..." : "Add your first hospital department to manage beds and staff."}
            </p>
            {!loading && (
              <Link
                href="/departments/add"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0B625C]"
              >
                <Plus size={15} /> Add Department
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-[#E3E0D7] bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center dark:border-white/10 dark:bg-[#18211E]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
            <Activity size={17} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#17201D] dark:text-white">Department Operations</p>
            <p className="mt-0.5 text-[10px] text-[#87938E]">Hospital departments management active.</p>
          </div>
        </div>
        <span className="rounded-full bg-[#ECFDF5] px-3 py-1.5 text-[9px] font-bold text-[#0F766E]">
          All Systems Operational
        </span>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, iconBg, iconColor }) {
  return (
    <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#18211E]">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
      <p className="mt-5 text-xs font-medium text-[#87938E]">{title}</p>
      <div className="mt-1 flex items-end justify-between">
        <p className="text-2xl font-bold text-[#17201D] dark:text-white">{value}</p>
        <span className="mb-1 text-[9px] font-semibold text-[#87938E]">{subtitle}</span>
      </div>
    </div>
  );
}

function DepartmentCard({ department, onDelete }) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="group relative rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#18211E]">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${department.color || "bg-[#E7F5F2] text-[#0F766E]"}`}>
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">{department.name}</h2>
            <p className="mt-0.5 text-[9px] font-medium text-[#A1AAA6]">{department.id}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#87938E] hover:bg-[#F1F3EF] hover:text-[#0F766E]"
          >
            <MoreHorizontal size={17} />
          </button>

          {openMenu && (
            <div className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
              <Link
                href={`/departments/${department.id}`}
                className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0]"
              >
                <Eye size={14} /> View Details
              </Link>
              <button
                onClick={() => {
                  setOpenMenu(false);
                  onDelete(department.id);
                }}
                className="flex w-full items-center gap-2 border-t border-[#EEECE5] px-3 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-white/10 dark:text-red-400"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 min-h-[32px] text-[10px] leading-4 text-[#87938E]">{department.description}</p>

      {/* Location */}
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#FAFAF7] px-3 py-2.5 dark:bg-[#202B27]">
        <Building2 size={14} className="text-[#0F766E]" />
        <span className="text-[10px] font-medium text-[#52615B] dark:text-[#AAB6B0]">{department.location}</span>
      </div>

      {/* Head Doctor */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7F5F2] text-[#0F766E]">
          <UserRound size={15} />
        </div>
        <div>
          <p className="text-[9px] text-[#9AA49F]">Department Head</p>
          <p className="mt-0.5 text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">{department.head}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <MiniStat icon={<Stethoscope size={13} />} label="Doctors" value={department.doctors} />
        <MiniStat icon={<Users size={13} />} label="Nurses" value={department.nurses} />
        <MiniStat icon={<BedDouble size={13} />} label="Beds" value={department.beds} />
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-[#EEECE5] pt-4 dark:border-white/10">
        <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[9px] font-bold text-[#0F766E]">
          {department.status}
        </span>

        <Link
          href={`/departments/${department.id}`}
          className="flex items-center gap-1 text-[10px] font-bold text-[#0F766E] transition hover:gap-2"
        >
          View <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-[#EEECE5] bg-[#FAFAF7] px-2 py-3 text-center dark:border-white/10 dark:bg-[#202B27]">
      <div className="flex justify-center text-[#0F766E]">{icon}</div>
      <p className="mt-1.5 text-sm font-bold text-[#17201D] dark:text-white">{value}</p>
      <p className="text-[8px] text-[#9AA49F]">{label}</p>
    </div>
  );
}
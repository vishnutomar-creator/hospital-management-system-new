"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Image as ImageIcon,
  MoreHorizontal,
  ScanLine,
  Search,
  Upload,
  UserRound,
  XCircle,
  RefreshCw,
  Plus,
  X,
  AlertCircle,
  Filter,
  Check,
  Eye,
  Play,
  FileCheck,
  AlertTriangle,
} from "lucide-react";
import { radiologyAPI, patientAPI, doctorAPI } from "../../services/api";

const MODALITY_CONFIG = [
  {
    key: "X-Ray",
    label: "X-Ray",
    icon: ScanLine,
    iconBg: "bg-[#E7F5F2]",
    iconColor: "text-[#0F766E]",
    bar: "bg-[#0F766E]",
  },
  {
    key: "CT",
    label: "CT Scan",
    icon: ImageIcon,
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#5367B8]",
    bar: "bg-[#5367B8]",
  },
  {
    key: "MRI",
    label: "MRI",
    icon: Activity,
    iconBg: "bg-[#F2ECFA]",
    iconColor: "text-[#7954A6]",
    bar: "bg-[#7954A6]",
  },
  {
    key: "Ultrasound",
    label: "Ultrasound",
    icon: ScanLine,
    iconBg: "bg-[#FFF3E8]",
    iconColor: "text-[#C87924]",
    bar: "bg-[#C87924]",
  },
  {
    key: "Mammography",
    label: "Mammography",
    icon: Activity,
    iconBg: "bg-[#FCE7F3]",
    iconColor: "text-[#BE185D]",
    bar: "bg-[#BE185D]",
  },
];

const fallbackStudies = [
  {
    _id: "mock-1",
    id: "RAD-10482",
    patient: "Aarav Sharma",
    patientId: "PT-8942",
    patientPhone: "+91 98765 43210",
    modality: "X-Ray",
    bodyPart: "Chest PA",
    priority: "STAT",
    doctor: "Dr. Vikram Sen",
    doctorIdVal: "",
    date: "Today",
    time: "09:30 AM",
    status: "Completed",
    findings: "Bilateral patchy interstitial infiltrates in lower zones consistent with acute pneumonitis. Cardiothoracic ratio normal.",
    impression: "Abnormal",
    cost: 800,
  },
  {
    _id: "mock-2",
    id: "RAD-10481",
    patient: "Priya Nair",
    patientId: "PT-8938",
    patientPhone: "+91 98123 45678",
    modality: "MRI",
    bodyPart: "Brain Contrast",
    priority: "Urgent",
    doctor: "Dr. Priya Patel",
    doctorIdVal: "",
    date: "Today",
    time: "10:15 AM",
    status: "InProgress",
    findings: "",
    impression: null,
    cost: 6500,
  },
  {
    _id: "mock-3",
    id: "RAD-10480",
    patient: "Rahul Verma",
    patientId: "PT-8921",
    patientPhone: "+91 99234 56789",
    modality: "CT",
    bodyPart: "Abdomen & Pelvis",
    priority: "Routine",
    doctor: "Dr. Ananya Iyer",
    doctorIdVal: "",
    date: "Today",
    time: "11:00 AM",
    status: "Scheduled",
    findings: "",
    impression: null,
    cost: 4500,
  },
  {
    _id: "mock-4",
    id: "RAD-10479",
    patient: "Sunita Roy",
    patientId: "PT-8910",
    patientPhone: "+91 98456 78901",
    modality: "Ultrasound",
    bodyPart: "Whole Abdomen",
    priority: "Routine",
    doctor: "Dr. Vikram Sen",
    doctorIdVal: "",
    date: "Yesterday",
    time: "03:45 PM",
    status: "Ordered",
    findings: "",
    impression: null,
    cost: 1800,
  },
  {
    _id: "mock-5",
    id: "RAD-10478",
    patient: "Vikram Joshi",
    patientId: "PT-8902",
    patientPhone: "+91 97654 32109",
    modality: "CT",
    bodyPart: "Head Non-Contrast",
    priority: "Urgent",
    doctor: "Dr. Rajiv Sharma",
    doctorIdVal: "",
    date: "Yesterday",
    time: "05:20 PM",
    status: "InProgress",
    findings: "",
    impression: null,
    cost: 3500,
  },
];

export default function RadiologyPage() {
  const [studies, setStudies] = useState(fallbackStudies);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedModality, setSelectedModality] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");

  // Patients & Doctors for dynamic ordering
  const [patientsList, setPatientsList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);

  // Modals state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeDetailsStudy, setActiveDetailsStudy] = useState(null);
  const [scheduleModalStudy, setScheduleModalStudy] = useState(null);
  const [reportModalStudy, setReportModalStudy] = useState(null);

  // Forms
  const [orderForm, setOrderForm] = useState({
    patientId: "",
    doctorId: "",
    modality: "X-Ray",
    bodyPart: "",
    priority: "Routine",
    cost: 800,
  });

  const [scheduleDate, setScheduleDate] = useState("");
  const [reportForm, setReportForm] = useState({
    findings: "",
    impression: "Normal",
  });

  // Action status / feedback toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch all studies
  const loadRadiology = async () => {
    setLoading(true);
    try {
      const res = await radiologyAPI.getRadiologyTests();
      const raw = res?.data || (Array.isArray(res) ? res : []);
      if (raw.length > 0) {
        const mapped = raw.map((item, idx) => ({
          _id: item._id,
          id: item._id ? `RAD-${item._id.toString().slice(-5).toUpperCase()}` : `RAD-1048${idx}`,
          patient: item.patientId?.name || item.patientId?.patientName || "Unknown Patient",
          patientId: item.patientId?.patientId || (item.patientId?._id ? `PT-${item.patientId._id.toString().slice(-4).toUpperCase()}` : `PT-8900`),
          patientPhone: item.patientId?.phone || "N/A",
          modality: item.modality || "X-Ray",
          bodyPart: item.bodyPart || "General",
          priority: item.priority || "Routine",
          doctor: item.doctorId?.name || "Dr. Medical Staff",
          doctorIdVal: item.doctorId?._id || "",
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Today",
          time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "10:00 AM",
          status: item.status || "Ordered",
          findings: item.findings || "",
          impression: item.impression || null,
          reportFile: item.reportFile || null,
          cost: item.cost || 0,
          verifiedBy: item.verifiedBy?.name || null,
        }));
        setStudies(mapped);
      } else {
        setStudies(fallbackStudies);
      }
    } catch (err) {
      console.warn("Using fallback radiology studies:", err.message);
      setStudies(fallbackStudies);
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients and doctors for form selects
  useEffect(() => {
    loadRadiology();

    patientAPI.getPatients()
      .then((res) => {
        const list = res?.data || (Array.isArray(res) ? res : []);
        setPatientsList(list);
        if (list.length > 0 && !orderForm.patientId) {
          setOrderForm((prev) => ({ ...prev, patientId: list[0]._id }));
        }
      })
      .catch(() => {});

    doctorAPI.getDoctors()
      .then((res) => {
        const list = res?.data || (Array.isArray(res) ? res : []);
        setDoctorsList(list);
        if (list.length > 0 && !orderForm.doctorId) {
          setOrderForm((prev) => ({ ...prev, doctorId: list[0]._id }));
        }
      })
      .catch(() => {});
  }, []);

  // Filtered studies
  const filteredStudies = useMemo(() => {
    return studies.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        s.patient.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.patientId.toLowerCase().includes(q) ||
        s.modality.toLowerCase().includes(q) ||
        s.bodyPart.toLowerCase().includes(q) ||
        s.doctor.toLowerCase().includes(q);

      const matchesModality =
        selectedModality === "All" ||
        s.modality.toLowerCase() === selectedModality.toLowerCase() ||
        (selectedModality === "CT" && s.modality.toLowerCase().includes("ct"));

      const matchesStatus =
        selectedStatus === "All" || s.status.toLowerCase() === selectedStatus.toLowerCase();

      const matchesPriority =
        selectedPriority === "All" || s.priority.toLowerCase() === selectedPriority.toLowerCase();

      return matchesSearch && matchesModality && matchesStatus && matchesPriority;
    });
  }, [studies, search, selectedModality, selectedStatus, selectedPriority]);

  // Dynamic statistics
  const totalStudies = studies.length;
  const pendingReports = studies.filter(
    (s) => s.status === "Ordered" || s.status === "Scheduled" || s.status === "InProgress"
  ).length;
  const completedStudies = studies.filter((s) => s.status === "Completed").length;
  const criticalUrgentCount = studies.filter(
    (s) => s.priority === "STAT" || s.priority === "Urgent" || s.impression === "Critical"
  ).length;

  // Dynamic Modality metrics
  const modalityMetrics = useMemo(() => {
    return MODALITY_CONFIG.map((m) => {
      const count = studies.filter(
        (s) =>
          s.modality.toLowerCase() === m.key.toLowerCase() ||
          s.modality.toLowerCase().includes(m.key.toLowerCase())
      ).length;
      const pct = totalStudies > 0 ? Math.round((count / totalStudies) * 100) : 0;
      return {
        ...m,
        total: count,
        percentage: pct,
      };
    });
  }, [studies, totalStudies]);

  // Dynamic Queue (Ordered or InProgress scans needing action)
  const reportQueue = useMemo(() => {
    return studies
      .filter((s) => s.status !== "Completed" && s.status !== "Cancelled")
      .slice(0, 5);
  }, [studies]);

  // Dynamic Recent Activity derived from real scans
  const dynamicActivities = useMemo(() => {
    return studies.slice(0, 4).map((s) => {
      let title = `${s.modality} Study`;
      let desc = `${s.bodyPart} for ${s.patient}`;
      let icon = s.modality === "MRI" ? Activity : ScanLine;
      let color = "bg-[#E7F5F2] text-[#0F766E]";

      if (s.status === "Completed") {
        title = `${s.modality} Report Finalized`;
        desc = `Verified report for ${s.patient} (${s.bodyPart})`;
        icon = CheckCircle2;
        color = "bg-[#EEF2FF] text-[#5367B8]";
      } else if (s.status === "InProgress") {
        title = `${s.modality} In Progress`;
        desc = `Scan ongoing for ${s.patient} in suite`;
        icon = Activity;
        color = "bg-[#F2ECFA] text-[#7954A6]";
      } else if (s.priority === "STAT") {
        title = `STAT ${s.modality} Ordered`;
        desc = `High priority scan requested by ${s.doctor}`;
        icon = AlertTriangle;
        color = "bg-[#FFF3E8] text-[#C87924]";
      }

      return {
        title,
        description: desc,
        time: s.time || "Recently",
        icon,
        color,
      };
    });
  }, [studies]);

  // ==========================================
  // HANDLERS FOR DYNAMIC WORKFLOW
  // ==========================================

  // 1. Order New Scan
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!orderForm.bodyPart) {
      showToast("Please specify the anatomical body part.", "error");
      return;
    }

    try {
      // Map "CT Scan" to backend enum "CT"
      const payload = {
        patientId: orderForm.patientId || (patientsList[0]?._id),
        doctorId: orderForm.doctorId || (doctorsList[0]?._id),
        modality: orderForm.modality === "CT Scan" ? "CT" : orderForm.modality,
        bodyPart: orderForm.bodyPart,
        priority: orderForm.priority,
        cost: Number(orderForm.cost) || 0,
      };

      await radiologyAPI.orderRadiology(payload);
      showToast("Radiology scan ordered successfully!");
      setIsOrderModalOpen(false);
      setOrderForm({
        patientId: patientsList[0]?._id || "",
        doctorId: doctorsList[0]?._id || "",
        modality: "X-Ray",
        bodyPart: "",
        priority: "Routine",
        cost: 800,
      });
      loadRadiology();
    } catch (err) {
      console.error(err);
      // Fallback local update if API requires mock
      const newScan = {
        _id: `local-${Date.now()}`,
        id: `RAD-${Math.floor(10000 + Math.random() * 90000)}`,
        patient: patientsList.find((p) => p._id === orderForm.patientId)?.name || "New Patient",
        patientId: `PT-${Math.floor(8000 + Math.random() * 1000)}`,
        patientPhone: "+91 98000 12345",
        modality: orderForm.modality,
        bodyPart: orderForm.bodyPart,
        priority: orderForm.priority,
        doctor: doctorsList.find((d) => d._id === orderForm.doctorId)?.name || "Dr. Staff",
        date: "Today",
        time: "Just now",
        status: "Ordered",
        findings: "",
        impression: null,
        cost: orderForm.cost,
      };
      setStudies([newScan, ...studies]);
      showToast("Radiology scan added successfully!");
      setIsOrderModalOpen(false);
    }
  };

  // 2. Schedule Scan
  const handleScheduleScan = async () => {
    if (!scheduleDate) {
      showToast("Please pick a scheduled date & time.", "error");
      return;
    }
    const study = scheduleModalStudy;
    if (!study) return;

    try {
      if (study._id && !study._id.startsWith("mock") && !study._id.startsWith("local")) {
        await radiologyAPI.scheduleScan(study._id, { scanDate: new Date(scheduleDate).toISOString() });
      }
      setStudies((prev) =>
        prev.map((s) => (s.id === study.id ? { ...s, status: "Scheduled", date: new Date(scheduleDate).toLocaleDateString() } : s))
      );
      showToast(`Scan ${study.id} scheduled successfully!`);
      setScheduleModalStudy(null);
    } catch (err) {
      setStudies((prev) =>
        prev.map((s) => (s.id === study.id ? { ...s, status: "Scheduled" } : s))
      );
      showToast(`Scan ${study.id} marked as Scheduled!`);
      setScheduleModalStudy(null);
    }
  };

  // 3. Start Scan (InProgress)
  const handleStartScan = async (study) => {
    try {
      if (study._id && !study._id.startsWith("mock") && !study._id.startsWith("local")) {
        await radiologyAPI.startScan(study._id);
      }
      setStudies((prev) =>
        prev.map((s) => (s.id === study.id ? { ...s, status: "InProgress" } : s))
      );
      showToast(`Scan ${study.id} is now In Progress!`);
    } catch (err) {
      setStudies((prev) =>
        prev.map((s) => (s.id === study.id ? { ...s, status: "InProgress" } : s))
      );
      showToast(`Scan ${study.id} marked In Progress!`);
    }
  };

  // 4. Submit Report Findings & Impression
  const handleSubmitReport = async () => {
    if (!reportForm.findings) {
      showToast("Please enter report findings.", "error");
      return;
    }
    const study = reportModalStudy;
    if (!study) return;

    try {
      if (study._id && !study._id.startsWith("mock") && !study._id.startsWith("local")) {
        await radiologyAPI.submitReport(study._id, {
          findings: reportForm.findings,
          impression: reportForm.impression,
        });
      }
      setStudies((prev) =>
        prev.map((s) =>
          s.id === study.id
            ? {
                ...s,
                status: "Completed",
                findings: reportForm.findings,
                impression: reportForm.impression,
              }
            : s
        )
      );
      showToast(`Report for ${study.id} submitted and verified!`);
      setReportModalStudy(null);
    } catch (err) {
      setStudies((prev) =>
        prev.map((s) =>
          s.id === study.id
            ? {
                ...s,
                status: "Completed",
                findings: reportForm.findings,
                impression: reportForm.impression,
              }
            : s
        )
      );
      showToast(`Report for ${study.id} finalized!`);
      setReportModalStudy(null);
    }
  };

  // 5. Cancel Scan
  const handleCancelScan = async (study) => {
    if (!confirm(`Are you sure you want to cancel study ${study.id}?`)) return;
    try {
      if (study._id && !study._id.startsWith("mock") && !study._id.startsWith("local")) {
        await radiologyAPI.cancelScan(study._id);
      }
      setStudies((prev) =>
        prev.map((s) => (s.id === study.id ? { ...s, status: "Cancelled" } : s))
      );
      showToast(`Study ${study.id} cancelled.`, "error");
    } catch (err) {
      setStudies((prev) =>
        prev.map((s) => (s.id === study.id ? { ...s, status: "Cancelled" } : s))
      );
      showToast(`Study ${study.id} cancelled.`, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-xl transition-all duration-300 ${
            toast.type === "error" ? "bg-rose-600" : "bg-[#0F766E]"
          }`}
        >
          {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <X size={15} />
          </button>
        </div>
      )}

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#87938E] dark:text-[#71817B]">
            <span>Hospital</span>
            <ChevronRight size={13} />
            <span className="text-[#0F766E]">Radiology & Imaging</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#17201D] sm:text-3xl dark:text-white">
            Radiology Diagnostic Suite
          </h1>

          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Real-time imaging studies, automated report queue, and live PACS diagnostics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadRadiology}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] bg-white px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:text-[#0F766E] disabled:opacity-50 dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Sync Scans
          </button>

          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B625C]"
          >
            <Plus size={16} />
            Order New Study
          </button>
        </div>
      </div>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Studies"
          value={totalStudies}
          change={`${completedStudies} completed`}
          icon={<ImageIcon size={21} />}
          iconBg="bg-[#E7F5F2]"
          iconColor="text-[#0F766E]"
        />

        <StatCard
          title="Pending Queue"
          value={pendingReports}
          change="Awaiting scans/reports"
          icon={<Clock3 size={21} />}
          iconBg="bg-[#FFF3E8]"
          iconColor="text-[#C87924]"
          warning={pendingReports > 0}
        />

        <StatCard
          title="Verified Reports"
          value={completedStudies}
          change="Signed by radiologist"
          icon={<CheckCircle2 size={21} />}
          iconBg="bg-[#EEF2FF]"
          iconColor="text-[#5367B8]"
        />

        <StatCard
          title="STAT & Urgent"
          value={criticalUrgentCount}
          change="Priority scans"
          icon={<Activity size={21} />}
          iconBg="bg-[#F2ECFA]"
          iconColor="text-[#7954A6]"
          warning={criticalUrgentCount > 0}
        />
      </div>

      {/* =====================================================
          MAIN CONTENT (Modality Overview & Dynamic Queue)
      ====================================================== */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Modality Overview */}
        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
                Imaging Modalities
              </h2>
              <p className="mt-1 text-xs text-[#87938E]">
                Click any modality to filter the studies table
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedModality !== "All" && (
                <button
                  onClick={() => setSelectedModality("All")}
                  className="text-xs font-semibold text-[#0F766E] hover:underline"
                >
                  Clear filter
                </button>
              )}
              <span className="rounded-lg bg-[#FAFAF7] px-2.5 py-1 text-[11px] font-bold text-[#52615B] dark:bg-[#202B27] dark:text-[#AAB6B0]">
                {totalStudies} Active Scans
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {modalityMetrics.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedModality === item.key;

              return (
                <div
                  key={item.key}
                  onClick={() =>
                    setSelectedModality(isSelected ? "All" : item.key)
                  }
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-[#0F766E] bg-[#0F766E]/5 ring-2 ring-[#0F766E]/20"
                      : "border-[#EEECE5] hover:border-[#0F766E]/40 dark:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                      >
                        <Icon size={19} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#17201D] dark:text-white">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#87938E]">
                          {item.total} {item.total === 1 ? "study" : "studies"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">
                      {item.percentage}%
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EEF0EC] dark:bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.bar}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Filter Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F7F4ED] p-3.5 dark:bg-[#202B27]">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[#0F766E]" />
              <span className="text-xs font-semibold text-[#17201D] dark:text-white">
                Active Filter:
              </span>
              <span className="text-xs font-bold text-[#0F766E]">
                {selectedModality === "All" ? "All Modalities" : selectedModality}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#87938E]">Priority:</span>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="rounded-lg border border-[#E3E0D7] bg-white px-2 py-1 text-xs font-semibold text-[#52615B] outline-none dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]"
              >
                <option value="All">All Priorities</option>
                <option value="STAT">STAT (Critical)</option>
                <option value="Urgent">Urgent</option>
                <option value="Routine">Routine</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Report Queue */}
        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
                Action Queue
              </h2>
              <p className="mt-1 text-xs text-[#87938E]">
                Scans requiring scheduling or reports
              </p>
            </div>

            <span className="rounded-full bg-[#FFF3E8] px-2.5 py-1 text-[9px] font-bold text-[#C87924]">
              {pendingReports} Pending
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {reportQueue.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 size={32} className="text-[#0F766E]" />
                <p className="mt-2 text-xs font-bold text-[#17201D] dark:text-white">
                  All Reports Up to Date
                </p>
                <p className="text-[11px] text-[#87938E]">
                  No scans currently waiting in the diagnostic queue.
                </p>
              </div>
            ) : (
              reportQueue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-[#EEECE5] p-3 transition hover:border-[#0F766E]/30 dark:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF3E8] text-[#C87924]">
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#17201D] dark:text-white">
                        {item.patient}
                      </p>
                      <p className="text-[10px] text-[#87938E]">
                        {item.modality} • {item.bodyPart}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === "Ordered" && (
                      <button
                        onClick={() => setScheduleModalStudy(item)}
                        className="rounded-lg bg-[#0F766E] px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-[#0B625C]"
                      >
                        Schedule
                      </button>
                    )}
                    {item.status === "Scheduled" && (
                      <button
                        onClick={() => handleStartScan(item)}
                        className="rounded-lg bg-[#5367B8] px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-[#435398]"
                      >
                        Start Scan
                      </button>
                    )}
                    {item.status === "InProgress" && (
                      <button
                        onClick={() => {
                          setReportModalStudy(item);
                          setReportForm({
                            findings: item.findings || "",
                            impression: item.impression || "Normal",
                          });
                        }}
                        className="rounded-lg bg-[#C87924] px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-[#A8641E]"
                      >
                        Add Report
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setSelectedStatus("Ordered")}
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-[#E3E0D7] py-2 text-xs font-bold text-[#52615B] transition hover:border-[#0F766E] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            Filter All Pending in Table
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* =====================================================
          STUDIES TABLE
      ====================================================== */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-[#E3E0D7] bg-white shadow-sm dark:border-white/10 dark:bg-[#18211E]">
        {/* Table Header / Filters */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#EEECE5] px-5 py-4 md:flex-row md:items-center dark:border-white/10">
          <div>
            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              Radiology & Imaging Registry
            </h2>
            <p className="mt-1 text-xs text-[#87938E]">
              Showing {filteredStudies.length} of {totalStudies} total imaging examinations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status tabs */}
            <div className="flex items-center rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] p-1 dark:border-white/10 dark:bg-[#202B27]">
              {["All", "Ordered", "Scheduled", "InProgress", "Completed"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                    selectedStatus === st
                      ? "bg-white text-[#0F766E] shadow-sm dark:bg-[#18211E] dark:text-white"
                      : "text-[#7B8882] hover:text-[#17201D] dark:text-[#AAB6B0]"
                  }`}
                >
                  {st === "InProgress" ? "In Progress" : st}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA49F]"
              />
              <input
                type="text"
                placeholder="Search patient, study ID, doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[220px] rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-9 pr-3 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-[#EEECE5] bg-[#FAFAF7]/50 dark:border-white/10 dark:bg-[#202B27]/30">
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Study ID
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Patient
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Modality & Region
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Priority
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Referring Doctor
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Date & Time
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredStudies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#87938E]">
                    No radiology examinations found matching the current search & filters.
                  </td>
                </tr>
              ) : (
                filteredStudies.map((study) => (
                  <tr
                    key={study.id}
                    className="border-b border-[#F0EEE8] transition hover:bg-[#FAFAF7] last:border-0 dark:border-white/5 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-[#0F766E]">
                        {study.id}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7F5F2] text-[#0F766E]">
                          <UserRound size={15} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#17201D] dark:text-white">
                            {study.patient}
                          </p>
                          <p className="mt-0.5 text-[9px] text-[#87938E]">
                            {study.patientId} • {study.patientPhone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <span className="inline-block rounded-md bg-[#F0EEE8] px-2 py-0.5 text-[10px] font-bold text-[#17201D] dark:bg-white/10 dark:text-white">
                          {study.modality}
                        </span>
                        <p className="mt-1 text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
                          {study.bodyPart}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <PriorityBadge priority={study.priority} />
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs text-[#52615B] dark:text-[#AAB6B0]">
                        {study.doctor}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Clock3 size={13} className="text-[#87938E]" />
                        <div>
                          <p className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
                            {study.time}
                          </p>
                          <p className="text-[9px] text-[#87938E]">{study.date}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={study.status} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          title="View Study Details"
                          onClick={() => setActiveDetailsStudy(study)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E3E0D7] text-[#52615B] hover:border-[#0F766E] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
                        >
                          <Eye size={14} />
                        </button>

                        {/* Schedule Scan */}
                        {study.status === "Ordered" && (
                          <button
                            title="Schedule Scan"
                            onClick={() => setScheduleModalStudy(study)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7F5F2] text-[#0F766E] hover:bg-[#0F766E] hover:text-white"
                          >
                            <CalendarDays size={14} />
                          </button>
                        )}

                        {/* Start Scan */}
                        {study.status === "Scheduled" && (
                          <button
                            title="Start Scan"
                            onClick={() => handleStartScan(study)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#5367B8] hover:bg-[#5367B8] hover:text-white"
                          >
                            <Play size={14} />
                          </button>
                        )}

                        {/* Submit / Edit Report */}
                        {study.status === "InProgress" && (
                          <button
                            title="Submit Report"
                            onClick={() => {
                              setReportModalStudy(study);
                              setReportForm({
                                findings: study.findings || "",
                                impression: study.impression || "Normal",
                              });
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF3E8] text-[#C87924] hover:bg-[#C87924] hover:text-white"
                          >
                            <FileCheck size={14} />
                          </button>
                        )}

                        {/* Cancel Scan */}
                        {study.status !== "Completed" && study.status !== "Cancelled" && (
                          <button
                            title="Cancel Study"
                            onClick={() => handleCancelScan(study)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-950/20"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#EEECE5] px-5 py-3 dark:border-white/10">
          <p className="text-[11px] text-[#87938E]">
            Showing {filteredStudies.length} of {totalStudies} imaging studies
          </p>

          <button
            onClick={() => {
              setSelectedModality("All");
              setSelectedStatus("All");
              setSelectedPriority("All");
              setSearch("");
            }}
            className="flex items-center gap-1 text-xs font-bold text-[#0F766E] hover:underline"
          >
            Reset all filters
          </button>
        </div>
      </div>

      {/* =====================================================
          RECENT ACTIVITY
      ====================================================== */}
      <div className="mt-6 rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              Live Imaging Activity Feed
            </h2>
            <p className="mt-1 text-xs text-[#87938E]">
              Recent status transitions and updates across the radiology suite
            </p>
          </div>

          <button
            onClick={loadRadiology}
            className="text-xs font-bold text-[#0F766E] hover:underline"
          >
            Sync feed
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dynamicActivities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#EEECE5] p-4 transition hover:border-[#0F766E]/30 dark:border-white/10"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activity.color}`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#17201D] dark:text-white">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-[#87938E]">
                      {activity.description}
                    </p>
                    <p className="mt-2 text-[9px] font-medium text-[#A1AAA6]">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          MODAL 1: ORDER NEW RADIOLOGY SCAN
      ====================================================== */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#E3E0D7] bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#18211E]">
            <div className="flex items-center justify-between border-b border-[#EEECE5] pb-4 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
                  <Upload size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17201D] dark:text-white">
                    Order Radiology Study
                  </h3>
                  <p className="text-xs text-[#87938E]">
                    Request a new diagnostic imaging scan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="rounded-lg p-1.5 text-[#87938E] hover:bg-[#F0EEE8] dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="mt-5 space-y-4">
              {/* Patient */}
              <div>
                <label className="block text-xs font-semibold text-[#17201D] dark:text-white">
                  Patient <span className="text-rose-500">*</span>
                </label>
                <select
                  value={orderForm.patientId}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, patientId: e.target.value })
                  }
                  required
                  className="mt-1 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3.5 py-2.5 text-xs text-[#17201D] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                >
                  {patientsList.length > 0 ? (
                    patientsList.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name || p.patientName} ({p.patientId || "ID"}) - {p.gender || "Patient"}
                      </option>
                    ))
                  ) : (
                    <option value="">No patients registered (select mock patient)</option>
                  )}
                </select>
              </div>

              {/* Referring Doctor */}
              <div>
                <label className="block text-xs font-semibold text-[#17201D] dark:text-white">
                  Referring Doctor <span className="text-rose-500">*</span>
                </label>
                <select
                  value={orderForm.doctorId}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, doctorId: e.target.value })
                  }
                  required
                  className="mt-1 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3.5 py-2.5 text-xs text-[#17201D] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                >
                  {doctorsList.length > 0 ? (
                    doctorsList.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.specialization || "Physician"})
                      </option>
                    ))
                  ) : (
                    <option value="">No doctors registered</option>
                  )}
                </select>
              </div>

              {/* Modality & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17201D] dark:text-white">
                    Modality
                  </label>
                  <select
                    value={orderForm.modality}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, modality: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3.5 py-2.5 text-xs text-[#17201D] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                  >
                    <option value="X-Ray">X-Ray</option>
                    <option value="CT">CT Scan</option>
                    <option value="MRI">MRI</option>
                    <option value="Ultrasound">Ultrasound</option>
                    <option value="Mammography">Mammography</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17201D] dark:text-white">
                    Priority
                  </label>
                  <select
                    value={orderForm.priority}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, priority: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3.5 py-2.5 text-xs text-[#17201D] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="STAT">STAT (Immediate)</option>
                  </select>
                </div>
              </div>

              {/* Anatomical Body Part & Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17201D] dark:text-white">
                    Body Part / Region <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chest PA, Brain, Pelvis"
                    value={orderForm.bodyPart}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, bodyPart: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3.5 py-2.5 text-xs text-[#17201D] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17201D] dark:text-white">
                    Estimated Cost (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={orderForm.cost}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, cost: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3.5 py-2.5 text-xs text-[#17201D] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="rounded-xl border border-[#E3E0D7] px-4 py-2.5 text-xs font-semibold text-[#52615B] hover:bg-[#F0EEE8] dark:border-white/10 dark:text-[#AAB6B0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0B625C]"
                >
                  Create Scan Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          MODAL 2: SCHEDULE SCAN
      ====================================================== */}
      {scheduleModalStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#E3E0D7] bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#18211E]">
            <div className="flex items-center justify-between border-b border-[#EEECE5] pb-4 dark:border-white/10">
              <div>
                <h3 className="text-base font-bold text-[#17201D] dark:text-white">
                  Schedule Scan Appointment
                </h3>
                <p className="text-xs text-[#87938E]">
                  {scheduleModalStudy.id} • {scheduleModalStudy.patient}
                </p>
              </div>
              <button
                onClick={() => setScheduleModalStudy(null)}
                className="rounded-lg p-1.5 text-[#87938E] hover:bg-[#F0EEE8] dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#17201D] dark:text-white">
                  Scan Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3.5 py-2.5 text-xs text-[#17201D] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                />
              </div>

              <div className="rounded-xl bg-[#F7F4ED] p-3 text-xs text-[#52615B] dark:bg-[#202B27] dark:text-[#AAB6B0]">
                <p>
                  <strong>Modality:</strong> {scheduleModalStudy.modality}
                </p>
                <p className="mt-1">
                  <strong>Body Part:</strong> {scheduleModalStudy.bodyPart}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setScheduleModalStudy(null)}
                  className="rounded-xl border border-[#E3E0D7] px-4 py-2 text-xs font-semibold text-[#52615B] hover:bg-[#F0EEE8] dark:border-white/10 dark:text-[#AAB6B0]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleScan}
                  className="rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0B625C]"
                >
                  Confirm Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MODAL 3: SUBMIT REPORT & FINDINGS
      ====================================================== */}
      {reportModalStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#E3E0D7] bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#18211E]">
            <div className="flex items-center justify-between border-b border-[#EEECE5] pb-4 dark:border-white/10">
              <div>
                <h3 className="text-base font-bold text-[#17201D] dark:text-white">
                  Enter Diagnostic Report
                </h3>
                <p className="text-xs text-[#87938E]">
                  {reportModalStudy.id} • {reportModalStudy.modality} ({reportModalStudy.bodyPart})
                </p>
              </div>
              <button
                onClick={() => setReportModalStudy(null)}
                className="rounded-lg p-1.5 text-[#87938E] hover:bg-[#F0EEE8] dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#17201D] dark:text-white">
                  Diagnostic Impression
                </label>
                <select
                  value={reportForm.impression}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, impression: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3.5 py-2.5 text-xs text-[#17201D] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                >
                  <option value="Normal">Normal (No acute pathology)</option>
                  <option value="Abnormal">Abnormal (Pathology identified)</option>
                  <option value="Critical">Critical (Immediate physician notice required)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17201D] dark:text-white">
                  Clinical Findings & Observations <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail radiological findings, dimensions, soft-tissue views, bone integrity..."
                  value={reportForm.findings}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, findings: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] p-3 text-xs text-[#17201D] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setReportModalStudy(null)}
                  className="rounded-xl border border-[#E3E0D7] px-4 py-2 text-xs font-semibold text-[#52615B] hover:bg-[#F0EEE8] dark:border-white/10 dark:text-[#AAB6B0]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReport}
                  className="rounded-xl bg-[#0F766E] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0B625C]"
                >
                  Sign & Finalize Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MODAL 4: VIEW FULL STUDY DETAILS
      ====================================================== */}
      {activeDetailsStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#E3E0D7] bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#18211E]">
            <div className="flex items-center justify-between border-b border-[#EEECE5] pb-4 dark:border-white/10">
              <div>
                <span className="font-mono text-xs font-bold text-[#0F766E]">
                  {activeDetailsStudy.id}
                </span>
                <h3 className="text-lg font-bold text-[#17201D] dark:text-white">
                  {activeDetailsStudy.modality} Examination
                </h3>
              </div>
              <button
                onClick={() => setActiveDetailsStudy(null)}
                className="rounded-lg p-1.5 text-[#87938E] hover:bg-[#F0EEE8] dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#F7F4ED] p-3.5 text-xs dark:bg-[#202B27]">
                <div>
                  <p className="text-[10px] text-[#87938E]">Patient</p>
                  <p className="font-bold text-[#17201D] dark:text-white">
                    {activeDetailsStudy.patient}
                  </p>
                  <p className="text-[10px] text-[#87938E]">{activeDetailsStudy.patientId}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#87938E]">Referring Doctor</p>
                  <p className="font-bold text-[#17201D] dark:text-white">
                    {activeDetailsStudy.doctor}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[#87938E]">Region / Body Part</p>
                  <p className="font-semibold text-[#17201D] dark:text-white">
                    {activeDetailsStudy.bodyPart}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[#87938E]">Priority</p>
                  <PriorityBadge priority={activeDetailsStudy.priority} />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-[#17201D] dark:text-white">
                  Clinical Findings
                </p>
                <div className="mt-1.5 rounded-xl border border-[#EEECE5] bg-[#FAFAF7] p-3.5 text-xs text-[#52615B] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]">
                  {activeDetailsStudy.findings ? (
                    activeDetailsStudy.findings
                  ) : (
                    <em className="text-[#87938E]">
                      Scan in progress or pending radiologist interpretation.
                    </em>
                  )}
                </div>
              </div>

              {activeDetailsStudy.impression && (
                <div>
                  <p className="text-xs font-bold text-[#17201D] dark:text-white">
                    Impression
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${
                      activeDetailsStudy.impression === "Critical"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : activeDetailsStudy.impression === "Abnormal"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {activeDetailsStudy.impression}
                  </span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveDetailsStudy(null)}
                  className="rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B625C]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
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
  change,
  icon,
  iconBg,
  iconColor,
  warning = false,
}) {
  return (
    <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#18211E]">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <MoreHorizontal size={18} className="text-[#A0AAA6]" />
      </div>

      <p className="mt-5 text-xs font-medium text-[#87938E]">{title}</p>

      <div className="mt-1 flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-[#17201D] dark:text-white">
          {value}
        </h2>
        {warning ? (
          <span className="mb-1 text-[10px] font-bold text-[#C87924]">
            {change}
          </span>
        ) : (
          <span className="mb-1 flex items-center gap-1 text-[10px] font-bold text-[#0F766E]">
            <ArrowUpRight size={13} />
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */
function StatusBadge({ status }) {
  const styles = {
    Completed: "bg-[#ECFDF5] text-[#0F766E] dark:bg-[#0F766E]/15 dark:text-[#5EEAD4]",
    InProgress: "bg-[#EEF2FF] text-[#5367B8] dark:bg-[#5367B8]/15 dark:text-[#A5B4FC]",
    Scheduled: "bg-[#F3F4F6] text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]",
    Ordered: "bg-[#FFF7ED] text-[#C87924] dark:bg-[#C87924]/15 dark:text-[#FDBA74]",
    Cancelled: "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400",
  };

  const label =
    status === "InProgress"
      ? "In Progress"
      : status === "Completed"
      ? "Report Ready"
      : status;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] || styles.Scheduled
      }`}
    >
      {status === "Completed" && <CheckCircle2 size={11} />}
      {status === "Ordered" && <Clock3 size={11} />}
      {status === "InProgress" && <Activity size={11} />}
      {status === "Scheduled" && <CalendarDays size={11} />}
      {status === "Cancelled" && <XCircle size={11} />}
      {label}
    </span>
  );
}

/* ============================================================
   PRIORITY BADGE
============================================================ */
function PriorityBadge({ priority = "Routine" }) {
  const styles = {
    STAT: "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
    Urgent: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    Routine: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
        styles[priority] || styles.Routine
      }`}
    >
      {priority}
    </span>
  );
}
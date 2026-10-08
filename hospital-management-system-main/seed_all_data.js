const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Models
const User = require("./models/User");
const Department = require("./models/Department");
const Doctor = require("./models/Doctor");
const Nurse = require("./models/nurses");
const Ward = require("./models/ward");
const Bed = require("./models/bed");
const Patient = require("./models/Patient");
const Admission = require("./models/admissions");
const Appointment = require("./models/Appointment");
const Queue = require("./models/queue");
const LabTest = require("./models/labtest");
const Radiology = require("./models/radiology");
const MedicalRecord = require("./models/MedicalRecord");
const Prescription = require("./models/Prescription");
const Supplier = require("./models/supplier");
const InventoryItem = require("./models/inventoryitem");
const OperationTheater = require("./models/operationtheater");
const Surgery = require("./models/surgeries");
const Billing = require("./models/Billing");
const Payment = require("./models/Payment");
const Asset = require("./models/asset");
const Notification = require("./models/Notification");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hms";

async function seed() {
  console.log("==================================================");
  console.log("🌱 STARTING COMPREHENSIVE HMS DATABASE SEEDING...");
  console.log("==================================================");

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB:", MONGO_URI);

    const defaultPassword = await bcrypt.hash("password123", 10);

    console.log("🧹 Resetting existing records for clean relational seeding...");
    try { await mongoose.connection.collection('inventoryitems').dropIndexes(); } catch (_) {}
    await Promise.all([
      Department.deleteMany({}),
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Nurse.deleteMany({}),
      Ward.deleteMany({}),
      Bed.deleteMany({}),
      Patient.deleteMany({}),
      Admission.deleteMany({}),
      Appointment.deleteMany({}),
      Queue.deleteMany({}),
      LabTest.deleteMany({}),
      Radiology.deleteMany({}),
      MedicalRecord.deleteMany({}),
      Prescription.deleteMany({}),
      Supplier.deleteMany({}),
      InventoryItem.deleteMany({}),
      OperationTheater.deleteMany({}),
      Surgery.deleteMany({}),
      Billing.deleteMany({}),
      Payment.deleteMany({}),
      Asset.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("✅ Database reset complete.");

    // ─────────────────────────────────────────────────────────────
    // 1. DEPARTMENTS
    // ─────────────────────────────────────────────────────────────
    console.log("\n📦 Seeding Departments...");
    const departmentsData = [
      { departmentId: "DEP-101", name: "Cardiology", description: "Heart, vascular, and cardiac care" },
      { departmentId: "DEP-102", name: "Neurology", description: "Brain, spine, and neurological disorders" },
      { departmentId: "DEP-103", name: "Orthopedics", description: "Bones, joints, and musculoskeletal system" },
      { departmentId: "DEP-104", name: "Pediatrics", description: "Infant, child, and adolescent healthcare" },
      { departmentId: "DEP-105", name: "Critical Care", description: "Intensive care unit (ICU) and life support" },
      { departmentId: "DEP-106", name: "Emergency", description: "24/7 Trauma and emergency medicine" },
      { departmentId: "DEP-107", name: "General Medicine", description: "Internal medicine, OPD, and chronic disease" },
      { departmentId: "DEP-108", name: "Radiology", description: "Diagnostic imaging, X-Ray, CT, MRI, and USG" },
      { departmentId: "DEP-109", name: "Laboratory", description: "Clinical pathology, biochemistry, and microbiology" },
      { departmentId: "DEP-110", name: "General Surgery", description: "Operative and minimally invasive surgical care" },
    ];

    const departmentMap = {};
    for (const d of departmentsData) {
      const doc = await Department.create({ ...d, isActive: true });
      departmentMap[d.name] = doc;
    }
    console.log(`✅ Seeded ${Object.keys(departmentMap).length} Departments`);

    // ─────────────────────────────────────────────────────────────
    // 2. USERS (Staff & Patients)
    // ─────────────────────────────────────────────────────────────
    console.log("\n👤 Seeding System Users...");
    const usersData = [
      { name: "System Admin", email: "admin@hms.com", role: "admin", phone: "+91 9876543210" },
      { name: "Dr. Rajiv Sharma", email: "doctor@hms.com", role: "doctor", phone: "+91 9811223344" },
      { name: "Dr. Priya Sharma", email: "priya.sharma@hms.com", role: "doctor", phone: "+91 9822334455" },
      { name: "Dr. Karan Patel", email: "karan.patel@hms.com", role: "doctor", phone: "+91 9833445566" },
      { name: "Dr. Rajesh Gupta", email: "rajesh.gupta@hms.com", role: "doctor", phone: "+91 9844556677" },
      { name: "Dr. Anita Roy", email: "anita.roy@hms.com", role: "doctor", phone: "+91 9855667788" },
      { name: "Dr. Vikram Sen", email: "vikram.sen@hms.com", role: "doctor", phone: "+91 9866778899" },
      { name: "Nurse Sarah Jenkins", email: "nurse@hms.com", role: "nurse", phone: "+91 9877889900" },
      { name: "Nurse David Chen", email: "david.chen@hms.com", role: "nurse", phone: "+91 9888990011" },
      { name: "Receptionist Sarah", email: "receptionist@hms.com", role: "receptionist", phone: "+91 9899001122" },
      { name: "Lab Tech Alex", email: "lab@hms.com", role: "lab_technician", phone: "+91 9800112233" },
      { name: "Pharmacist John", email: "pharmacist@hms.com", role: "pharmacist", phone: "+91 9711223344" },
      { name: "Patient Aditi Sharma", email: "patient@hms.com", role: "patient", phone: "+91 9722334455" },
      { name: "Patient Rohan Verma", email: "rohan.verma@hms.com", role: "patient", phone: "+91 9733445566" },
    ];

    const userMap = {};
    for (const u of usersData) {
      const doc = await User.create({ ...u, password: defaultPassword });
      userMap[u.email] = doc;
    }
    console.log(`✅ Seeded ${Object.keys(userMap).length} Users (Default password: password123)`);

    // ─────────────────────────────────────────────────────────────
    // 3. DOCTORS
    // ─────────────────────────────────────────────────────────────
    console.log("\n🩺 Seeding Doctors...");
    const doctorsData = [
      {
        userId: userMap["doctor@hms.com"]._id,
        doctorId: "DOC-101",
        name: "Dr. Rajiv Sharma",
        email: "doctor@hms.com",
        phone: "+91 9811223344",
        gender: "Male",
        specialization: "Senior Cardiologist",
        qualification: "MBBS, MD (Cardiology), DM",
        experience: 16,
        department: departmentMap["Cardiology"]._id,
        consultationFee: 1200,
        registrationNumber: "MCI-CARD-1001",
        availability: "Available",
      },
      {
        userId: userMap["priya.sharma@hms.com"]._id,
        doctorId: "DOC-102",
        name: "Dr. Priya Sharma",
        email: "priya.sharma@hms.com",
        phone: "+91 9822334455",
        gender: "Female",
        specialization: "Neurologist",
        qualification: "MBBS, MD, DM (Neurology)",
        experience: 12,
        department: departmentMap["Neurology"]._id,
        consultationFee: 1000,
        registrationNumber: "MCI-NEUR-1002",
        availability: "Available",
      },
      {
        userId: userMap["karan.patel@hms.com"]._id,
        doctorId: "DOC-103",
        name: "Dr. Karan Patel",
        email: "karan.patel@hms.com",
        phone: "+91 9833445566",
        gender: "Male",
        specialization: "Orthopedic Surgeon",
        qualification: "MBBS, MS (Orthopedics), MCh",
        experience: 14,
        department: departmentMap["Orthopedics"]._id,
        consultationFee: 900,
        registrationNumber: "MCI-ORTH-1003",
        availability: "Available",
      },
      {
        userId: userMap["rajesh.gupta@hms.com"]._id,
        doctorId: "DOC-104",
        name: "Dr. Rajesh Gupta",
        email: "rajesh.gupta@hms.com",
        phone: "+91 9844556677",
        gender: "Male",
        specialization: "General Physician & Internal Medicine",
        qualification: "MBBS, MD (Medicine)",
        experience: 20,
        department: departmentMap["General Medicine"]._id,
        consultationFee: 700,
        registrationNumber: "MCI-GEN-1004",
        availability: "Available",
      },
      {
        userId: userMap["anita.roy@hms.com"]._id,
        doctorId: "DOC-105",
        name: "Dr. Anita Roy",
        email: "anita.roy@hms.com",
        phone: "+91 9855667788",
        gender: "Female",
        specialization: "Consultant Pediatrician",
        qualification: "MBBS, MD (Pediatrics), DCH",
        experience: 10,
        department: departmentMap["Pediatrics"]._id,
        consultationFee: 800,
        registrationNumber: "MCI-PED-1005",
        availability: "Available",
      },
      {
        userId: userMap["vikram.sen@hms.com"]._id,
        doctorId: "DOC-106",
        name: "Dr. Vikram Sen",
        email: "vikram.sen@hms.com",
        phone: "+91 9866778899",
        gender: "Male",
        specialization: "Consultant Radiologist",
        qualification: "MBBS, MD (Radiodiagnosis)",
        experience: 11,
        department: departmentMap["Radiology"]._id,
        consultationFee: 850,
        registrationNumber: "MCI-RAD-1006",
        availability: "Available",
      },
    ];

    const doctorMap = {};
    for (const d of doctorsData) {
      const doc = await Doctor.create(d);
      doctorMap[d.doctorId] = doc;
      doctorMap[d.name] = doc;
    }
    console.log(`✅ Seeded ${doctorsData.length} Doctors`);

    // ─────────────────────────────────────────────────────────────
    // 4. NURSES
    // ─────────────────────────────────────────────────────────────
    console.log("\n👩‍⚕️ Seeding Nurses...");
    const nursesData = [
      {
        Name: "Sarah Jenkins",
        email: "nurse@hms.com",
        password: defaultPassword,
        phone: "+91 9877889900",
        gender: "Female",
        shift: "Morning",
        qualification: "B.Sc Nursing, Critical Care Certified",
        experience: 8,
        licenseNumber: "NUR-REG-2001",
        status: "Active",
      },
      {
        Name: "David Chen",
        email: "david.chen@hms.com",
        password: defaultPassword,
        phone: "+91 9888990011",
        gender: "Male",
        shift: "Evening",
        qualification: "B.Sc Nursing, BLS/ACLS",
        experience: 5,
        licenseNumber: "NUR-REG-2002",
        status: "Active",
      },
      {
        Name: "Emily Watson",
        email: "emily.watson@hms.com",
        password: defaultPassword,
        phone: "+91 9899112233",
        gender: "Female",
        shift: "Night",
        qualification: "M.Sc Nursing, Orthopedic Care",
        experience: 7,
        licenseNumber: "NUR-REG-2003",
        status: "Active",
      },
      {
        Name: "Anjali Verma",
        email: "anjali.verma@hms.com",
        password: defaultPassword,
        phone: "+91 9811335577",
        gender: "Female",
        shift: "Morning",
        qualification: "B.Sc Nursing, Cardiac Care Specialist",
        experience: 9,
        licenseNumber: "NUR-REG-2004",
        status: "Active",
      },
    ];

    const nurseMap = {};
    for (const n of nursesData) {
      const doc = await Nurse.create(n);
      nurseMap[n.Name] = doc;
    }
    console.log(`✅ Seeded ${nursesData.length} Nurses`);

    // ─────────────────────────────────────────────────────────────
    // 5. WARDS
    // ─────────────────────────────────────────────────────────────
    console.log("\n🏥 Seeding Wards...");
    const wardsData = [
      {
        wardName: "ICU",
        wardType: "ICU",
        departmentId: departmentMap["Critical Care"]._id,
        floor: "Ground Floor",
        totalBeds: 20,
        availableBeds: 12,
        dailyCharge: 3500,
        status: "Active",
        inChargeNurseId: nurseMap["Sarah Jenkins"]?._id,
      },
      {
        wardName: "General Medicine Ward",
        wardType: "General",
        departmentId: departmentMap["General Medicine"]._id,
        floor: "1st Floor",
        totalBeds: 40,
        availableBeds: 28,
        dailyCharge: 1200,
        status: "Active",
        inChargeNurseId: nurseMap["David Chen"]?._id,
      },
      {
        wardName: "Cardiology Ward A",
        wardType: "General",
        departmentId: departmentMap["Cardiology"]._id,
        floor: "2nd Floor",
        totalBeds: 30,
        availableBeds: 18,
        dailyCharge: 2000,
        status: "Active",
        inChargeNurseId: nurseMap["Anjali Verma"]?._id,
      },
      {
        wardName: "Orthopedic Ward A",
        wardType: "General",
        departmentId: departmentMap["Orthopedics"]._id,
        floor: "3rd Floor",
        totalBeds: 25,
        availableBeds: 14,
        dailyCharge: 1800,
        status: "Active",
        inChargeNurseId: nurseMap["Emily Watson"]?._id,
      },
      {
        wardName: "Private Care Ward",
        wardType: "Private",
        departmentId: departmentMap["General Medicine"]._id,
        floor: "4th Floor",
        totalBeds: 15,
        availableBeds: 8,
        dailyCharge: 5000,
        status: "Active",
      },
      {
        wardName: "Emergency Unit",
        wardType: "Emergency",
        departmentId: departmentMap["Emergency"]._id,
        floor: "Ground Floor",
        totalBeds: 20,
        availableBeds: 10,
        dailyCharge: 2500,
        status: "Active",
      },
      {
        wardName: "Pediatric Ward",
        wardType: "Pediatric",
        departmentId: departmentMap["Pediatrics"]._id,
        floor: "1st Floor",
        totalBeds: 20,
        availableBeds: 15,
        dailyCharge: 1500,
        status: "Active",
      },
      {
        wardName: "Neurology Ward B",
        wardType: "General",
        departmentId: departmentMap["Neurology"]._id,
        floor: "3rd Floor",
        totalBeds: 25,
        availableBeds: 16,
        dailyCharge: 2200,
        status: "Active",
      },
    ];

    const wardMap = {};
    for (const w of wardsData) {
      const doc = await Ward.create(w);
      wardMap[w.wardName] = doc;
    }
    console.log(`✅ Seeded ${wardsData.length} Wards`);

    // ─────────────────────────────────────────────────────────────
    // 6. PATIENTS
    // ─────────────────────────────────────────────────────────────
    console.log("\n🧑‍🤝‍🧑 Seeding Patients...");
    const patientsData = [
      {
        patientId: "HSP-2026-000101",
        name: "Aditi Sharma",
        patientName: "Aditi Sharma",
        age: 48,
        gender: "Female",
        bloodGroup: "B+",
        phone: "+91 9722334455",
        email: "aditi.sharma@example.com",
        department: "Critical Care",
        status: "Admitted",
        maritalStatus: "Married",
        address: "Flat 402, Greenfield Apts, Sector 14",
        city: "New Delhi",
        state: "Delhi",
        allergies: ["Penicillin", "NSAIDs"],
        medicalHistory: "Asthma, Hypertension",
        insuranceProvider: "Star Health Care",
        insuranceNumber: "SH-99238472",
      },
      {
        patientId: "HSP-2026-000102",
        name: "Rohan Verma",
        patientName: "Rohan Verma",
        age: 36,
        gender: "Male",
        bloodGroup: "O+",
        phone: "+91 9733445566",
        email: "rohan.verma@example.com",
        department: "General Medicine",
        status: "Admitted",
        maritalStatus: "Single",
        address: "74-B Block, Model Town",
        city: "New Delhi",
        state: "Delhi",
        allergies: ["Sulfa Drugs"],
        medicalHistory: "Recurrent Bronchitis",
        insuranceProvider: "Care Health Insurance",
        insuranceNumber: "CHI-8837194",
      },
      {
        patientId: "HSP-2026-000103",
        name: "Karan Malhotra",
        patientName: "Karan Malhotra",
        age: 54,
        gender: "Male",
        bloodGroup: "A+",
        phone: "+91 9744556677",
        email: "karan.malhotra@example.com",
        department: "Cardiology",
        status: "Admitted",
        maritalStatus: "Married",
        address: "12/A, Vasant Vihar",
        city: "New Delhi",
        state: "Delhi",
        allergies: [],
        medicalHistory: "Type-2 Diabetes, CAD",
        insuranceProvider: "Max Bupa / Niva Bupa",
        insuranceNumber: "NB-7729103",
      },
      {
        patientId: "HSP-2026-000104",
        name: "Meera Nair",
        patientName: "Meera Nair",
        age: 62,
        gender: "Female",
        bloodGroup: "AB+",
        phone: "+91 9755667788",
        email: "meera.nair@example.com",
        department: "Orthopedics",
        status: "Admitted",
        maritalStatus: "Widowed",
        address: "503, Palms Heights, Saket",
        city: "New Delhi",
        state: "Delhi",
        allergies: ["Aspirin"],
        medicalHistory: "Osteoarthritis, Osteoporosis",
        insuranceProvider: "HDFC ERGO",
        insuranceNumber: "HE-6628104",
      },
      {
        patientId: "HSP-2026-000105",
        name: "Priya Sharma",
        patientName: "Priya Sharma",
        age: 29,
        gender: "Female",
        bloodGroup: "O-",
        phone: "+91 9766778899",
        email: "priya.patient@example.com",
        department: "General Medicine",
        status: "Admitted",
        maritalStatus: "Single",
        address: "21 Civil Lines",
        city: "Gurugram",
        state: "Haryana",
        allergies: [],
        medicalHistory: "Migraine",
        insuranceProvider: "ICICI Lombard",
        insuranceNumber: "ICICI-554819",
      },
      {
        patientId: "HSP-2026-000106",
        name: "Sunil Mehta",
        patientName: "Sunil Mehta",
        age: 58,
        gender: "Male",
        bloodGroup: "B+",
        phone: "+91 9777889900",
        email: "sunil.mehta@example.com",
        department: "Neurology",
        status: "Admitted",
        maritalStatus: "Married",
        address: "C-44 Greater Kailash 1",
        city: "New Delhi",
        state: "Delhi",
        allergies: ["Codeine"],
        medicalHistory: "Mild Stroke (TIA in 2024)",
        insuranceProvider: "National Insurance",
        insuranceNumber: "NIC-4428190",
      },
      {
        patientId: "HSP-2026-000107",
        name: "Rahul Verma",
        patientName: "Rahul Verma",
        age: 32,
        gender: "Male",
        bloodGroup: "A+",
        phone: "+91 9788990011",
        email: "rahul.verma@example.com",
        department: "General Medicine",
        status: "Outpatient",
        maritalStatus: "Married",
        address: "98 South Extension",
        city: "New Delhi",
        state: "Delhi",
        allergies: [],
        medicalHistory: "Seasonal allergies",
      },
      {
        patientId: "HSP-2026-000108",
        name: "Sneha Patel",
        patientName: "Sneha Patel",
        age: 27,
        gender: "Female",
        bloodGroup: "O+",
        phone: "+91 9799001122",
        email: "sneha.patel@example.com",
        department: "Pediatrics",
        status: "Outpatient",
        maritalStatus: "Married",
        address: "14 Defence Colony",
        city: "New Delhi",
        state: "Delhi",
        allergies: [],
      },
    ];

    const patientMap = {};
    for (const p of patientsData) {
      const doc = await Patient.create(p);
      patientMap[p.patientId] = doc;
      patientMap[p.name] = doc;
    }
    console.log(`✅ Seeded ${patientsData.length} Patients`);

    // ─────────────────────────────────────────────────────────────
    // 7. BEDS
    // ─────────────────────────────────────────────────────────────
    console.log("\n🛏️ Seeding Beds...");
    const bedsData = [
      {
        bedNumber: "ICU-01",
        wardId: wardMap["ICU"]._id,
        bedType: "ICU",
        status: "Occupied",
        currentPatientId: patientMap["Aditi Sharma"]._id,
        dailyCharge: 3500,
      },
      {
        bedNumber: "ICU-02",
        wardId: wardMap["ICU"]._id,
        bedType: "ICU",
        status: "Available",
        dailyCharge: 3500,
      },
      {
        bedNumber: "GEN-101",
        wardId: wardMap["General Medicine Ward"]._id,
        bedType: "General",
        status: "Occupied",
        currentPatientId: patientMap["Rohan Verma"]._id,
        dailyCharge: 1200,
      },
      {
        bedNumber: "GEN-102",
        wardId: wardMap["General Medicine Ward"]._id,
        bedType: "General",
        status: "UnderMaintenance",
        dailyCharge: 1200,
      },
      {
        bedNumber: "GEN-103",
        wardId: wardMap["General Medicine Ward"]._id,
        bedType: "General",
        status: "Available",
        dailyCharge: 1200,
      },
      {
        bedNumber: "CARD-201",
        wardId: wardMap["Cardiology Ward A"]._id,
        bedType: "General",
        status: "Occupied",
        currentPatientId: patientMap["Karan Malhotra"]._id,
        dailyCharge: 2000,
      },
      {
        bedNumber: "CARD-202",
        wardId: wardMap["Cardiology Ward A"]._id,
        bedType: "Private",
        status: "Available",
        dailyCharge: 3000,
      },
      {
        bedNumber: "ORTH-301",
        wardId: wardMap["Orthopedic Ward A"]._id,
        bedType: "General",
        status: "Occupied",
        currentPatientId: patientMap["Meera Nair"]._id,
        dailyCharge: 1800,
      },
      {
        bedNumber: "ORTH-302",
        wardId: wardMap["Orthopedic Ward A"]._id,
        bedType: "General",
        status: "UnderMaintenance",
        dailyCharge: 1800,
      },
      {
        bedNumber: "PVT-401",
        wardId: wardMap["Private Care Ward"]._id,
        bedType: "Private",
        status: "Available",
        dailyCharge: 5000,
      },
      {
        bedNumber: "PVT-402",
        wardId: wardMap["Private Care Ward"]._id,
        bedType: "Private",
        status: "Occupied",
        currentPatientId: patientMap["Priya Sharma"]._id,
        dailyCharge: 5000,
      },
      {
        bedNumber: "PED-101",
        wardId: wardMap["Pediatric Ward"]._id,
        bedType: "General",
        status: "Available",
        dailyCharge: 1500,
      },
      {
        bedNumber: "PED-102",
        wardId: wardMap["Pediatric Ward"]._id,
        bedType: "General",
        status: "Available",
        dailyCharge: 1500,
      },
      {
        bedNumber: "NEURO-201",
        wardId: wardMap["Neurology Ward B"]._id,
        bedType: "General",
        status: "Available",
        dailyCharge: 2200,
      },
      {
        bedNumber: "NEURO-202",
        wardId: wardMap["Neurology Ward B"]._id,
        bedType: "General",
        status: "Occupied",
        currentPatientId: patientMap["Sunil Mehta"]._id,
        dailyCharge: 2200,
      },
    ];

    const bedMap = {};
    for (const b of bedsData) {
      const doc = await Bed.create(b);
      bedMap[b.bedNumber] = doc;
    }
    console.log(`✅ Seeded ${bedsData.length} Beds`);

    // ─────────────────────────────────────────────────────────────
    // 8. ADMISSIONS
    // ─────────────────────────────────────────────────────────────
    console.log("\n📋 Seeding Admissions...");
    const admissionsData = [
      {
        patientId: patientMap["Aditi Sharma"]._id,
        doctorId: doctorMap["Dr. Rajiv Sharma"]._id,
        wardId: wardMap["ICU"]._id,
        bedId: bedMap["ICU-01"]._id,
        admissionDate: new Date("2026-08-12T08:30:00Z"),
        reasonForAdmission: "Acute Respiratory Distress Syndrome (ARDS) & severe dyspnea",
        status: "Admitted",
      },
      {
        patientId: patientMap["Rohan Verma"]._id,
        doctorId: doctorMap["Dr. Rajesh Gupta"]._id,
        wardId: wardMap["General Medicine Ward"]._id,
        bedId: bedMap["GEN-101"]._id,
        admissionDate: new Date("2026-08-11T10:15:00Z"),
        reasonForAdmission: "Community Acquired Pneumonia with high grade fever",
        status: "Admitted",
      },
      {
        patientId: patientMap["Karan Malhotra"]._id,
        doctorId: doctorMap["Dr. Rajiv Sharma"]._id,
        wardId: wardMap["Cardiology Ward A"]._id,
        bedId: bedMap["CARD-201"]._id,
        admissionDate: new Date("2026-08-12T14:20:00Z"),
        reasonForAdmission: "Unstable Angina & Severe Essential Hypertension",
        status: "Admitted",
      },
      {
        patientId: patientMap["Meera Nair"]._id,
        doctorId: doctorMap["Dr. Karan Patel"]._id,
        wardId: wardMap["Orthopedic Ward A"]._id,
        bedId: bedMap["ORTH-301"]._id,
        admissionDate: new Date("2026-08-12T09:00:00Z"),
        reasonForAdmission: "Post-Op Right Femur ORIF Fixation recovery",
        status: "Admitted",
      },
      {
        patientId: patientMap["Priya Sharma"]._id,
        doctorId: doctorMap["Dr. Rajesh Gupta"]._id,
        wardId: wardMap["Private Care Ward"]._id,
        bedId: bedMap["PVT-402"]._id,
        admissionDate: new Date("2026-08-13T11:00:00Z"),
        reasonForAdmission: "Intractable Migraine & Severe Dehydration",
        status: "Admitted",
      },
      {
        patientId: patientMap["Sunil Mehta"]._id,
        doctorId: doctorMap["Dr. Priya Sharma"]._id,
        wardId: wardMap["Neurology Ward B"]._id,
        bedId: bedMap["NEURO-202"]._id,
        admissionDate: new Date("2026-08-12T16:45:00Z"),
        reasonForAdmission: "Transient Ischemic Attack (TIA) evaluation & monitoring",
        status: "Admitted",
      },
    ];

    for (const a of admissionsData) {
      await Admission.create(a);
    }
    console.log(`✅ Seeded ${admissionsData.length} Live IPD Admissions`);

    // ─────────────────────────────────────────────────────────────
    // 9. APPOINTMENTS
    // ─────────────────────────────────────────────────────────────
    console.log("\n📅 Seeding Appointments...");
    const appointmentsData = [
      {
        patientId: patientMap["Rahul Verma"]._id,
        doctorId: doctorMap["Dr. Rajesh Gupta"]._id,
        appointmentDate: new Date(),
        appointmentTime: "10:30 AM",
        reason: "Follow-up for chronic acidity and seasonal cough",
        status: "confirmed",
        notes: "Patient reported mild relief with antacids",
      },
      {
        patientId: patientMap["Sneha Patel"]._id,
        doctorId: doctorMap["Dr. Anita Roy"]._id,
        appointmentDate: new Date(),
        appointmentTime: "11:15 AM",
        reason: "Child vaccination and routine growth checkup",
        status: "confirmed",
        notes: "Bring previous immunization chart",
      },
      {
        patientId: patientMap["Aditi Sharma"]._id,
        doctorId: doctorMap["Dr. Rajiv Sharma"]._id,
        appointmentDate: new Date(Date.now() + 86400000 * 2),
        appointmentTime: "02:00 PM",
        reason: "Cardiac post-discharge evaluation",
        status: "pending",
      },
      {
        patientId: patientMap["Meera Nair"]._id,
        doctorId: doctorMap["Dr. Karan Patel"]._id,
        appointmentDate: new Date(Date.now() + 86400000 * 3),
        appointmentTime: "11:00 AM",
        reason: "Post-op suture removal and mobilization check",
        status: "confirmed",
      },
    ];

    const appointmentDocs = [];
    for (const ap of appointmentsData) {
      const doc = await Appointment.create(ap);
      appointmentDocs.push(doc);
    }
    console.log(`✅ Seeded ${appointmentDocs.length} Appointments`);

    // ─────────────────────────────────────────────────────────────
    // 10. OPD QUEUE
    // ─────────────────────────────────────────────────────────────
    console.log("\n🎫 Seeding OPD Queue...");
    const queueData = [
      {
        patientId: patientMap["Rahul Verma"]._id,
        doctorId: doctorMap["Dr. Rajesh Gupta"]._id,
        appointmentId: appointmentDocs[0]._id,
        queueNumber: 1,
        queueDate: new Date(new Date().setHours(0, 0, 0, 0)),
        status: "InConsultation",
        calledAt: new Date(),
      },
      {
        patientId: patientMap["Sneha Patel"]._id,
        doctorId: doctorMap["Dr. Anita Roy"]._id,
        appointmentId: appointmentDocs[1]._id,
        queueNumber: 1,
        queueDate: new Date(new Date().setHours(0, 0, 0, 0)),
        status: "Waiting",
      },
    ];

    for (const q of queueData) {
      await Queue.create(q);
    }
    console.log(`✅ Seeded OPD Queue tokens`);

    // ─────────────────────────────────────────────────────────────
    // 11. MEDICAL RECORDS
    // ─────────────────────────────────────────────────────────────
    console.log("\n📁 Seeding Medical Records...");
    const medicalRecordsData = [
      {
        patientId: patientMap["Aditi Sharma"]._id,
        doctorId: doctorMap["Dr. Rajiv Sharma"]._id,
        recordType: "diagnosis",
        diagnosis: "Acute Respiratory Distress Syndrome (ARDS) secondary to viral pneumonitis",
        symptoms: ["Shortness of breath", "Hypoxemia (SpO2 86%)", "Chest tightness", "Fatigue"],
        doctorNotes: "Admitted to ICU Bed ICU-01. Put on supplemental high-flow nasal cannula. Blood gases and chest X-ray ordered.",
        treatment: "Supplemental Oxygen 6L/min, IV Corticosteroids, Nebulization with Budesonide and Levosalbutamol.",
        status: "active",
      },
      {
        patientId: patientMap["Rohan Verma"]._id,
        doctorId: doctorMap["Dr. Rajesh Gupta"]._id,
        recordType: "consultation",
        diagnosis: "Right Lower Lobe Community-Acquired Pneumonia",
        symptoms: ["Productive cough with yellowish sputum", "Fever 102°F", "Pleuritic chest pain"],
        doctorNotes: "Crepitations audible over right infrascapular area. Started on empiric antibiotic coverage.",
        treatment: "IV Ceftriaxone 1g BD, Oral Azithromycin 500mg OD, Paracetamol 650mg TDS as needed for fever.",
        status: "active",
      },
      {
        patientId: patientMap["Karan Malhotra"]._id,
        doctorId: doctorMap["Dr. Rajiv Sharma"]._id,
        recordType: "diagnosis",
        diagnosis: "Unstable Angina & Stage-2 Essential Hypertension",
        symptoms: ["Retrosternal chest discomfort on exertion", "BP 168/104 mmHg", "Diaphoresis"],
        doctorNotes: "ECG shows ST segment depression in leads V4-V6. Cardiac enzymes Troponin-I sent. Continuous cardiac monitoring required.",
        treatment: "Aspirin 75mg OD, Clopidogrel 75mg OD, Atorvastatin 40mg HS, Telmisartan 40mg OD, Sublingual Sorbitrate SOS.",
        status: "active",
      },
    ];

    for (const mr of medicalRecordsData) {
      await MedicalRecord.create(mr);
    }
    console.log(`✅ Seeded ${medicalRecordsData.length} Medical Records`);

    // ─────────────────────────────────────────────────────────────
    // 12. PRESCRIPTIONS
    // ─────────────────────────────────────────────────────────────
    console.log("\n💊 Seeding Prescriptions...");
    const prescriptionsData = [
      {
        rxId: "RX-2026-1001",
        patient: "Aditi Sharma",
        patientName: "Aditi Sharma",
        patientId: patientMap["Aditi Sharma"]._id,
        doctorId: doctorMap["Dr. Rajiv Sharma"]._id,
        diagnosis: "ARDS & Severe Bronchospasm",
        medicines: [
          { name: "Levosalbutamol Inhaler", dosage: "50mcg", frequency: "two puffs as_needed", duration: "7 days", instructions: "Inhale when breathless" },
          { name: "Budesonide Respules", dosage: "0.5mg", frequency: "twice_daily", duration: "5 days", instructions: "Use with jet nebulizer" },
          { name: "Methylprednisolone", dosage: "40mg", frequency: "once_daily", duration: "5 days", instructions: "After breakfast" },
        ],
        advice: "Maintain strictly prone positioning for 4-6 hours daily. Oxygen support as monitored.",
        status: "Active",
      },
      {
        rxId: "RX-2026-1002",
        patient: "Karan Malhotra",
        patientName: "Karan Malhotra",
        patientId: patientMap["Karan Malhotra"]._id,
        doctorId: doctorMap["Dr. Rajiv Sharma"]._id,
        diagnosis: "Coronary Artery Disease & Hypertension",
        medicines: [
          { name: "Atorvastatin", dosage: "40mg", frequency: "once_daily", duration: "30 days", instructions: "Take at bedtime" },
          { name: "Telmisartan", dosage: "40mg", frequency: "once_daily", duration: "30 days", instructions: "Morning before breakfast" },
          { name: "Ecosprin (Aspirin)", dosage: "75mg", frequency: "once_daily", duration: "30 days", instructions: "After lunch" },
        ],
        advice: "Low sodium (< 2g/day) diet. Avoid heavy exertion. Check BP daily.",
        status: "Active",
      },
    ];

    for (const rx of prescriptionsData) {
      await Prescription.create(rx);
    }
    console.log(`✅ Seeded ${prescriptionsData.length} Prescriptions`);

    // ─────────────────────────────────────────────────────────────
    // 13. LAB TESTS
    // ─────────────────────────────────────────────────────────────
    console.log("\n🧪 Seeding Lab Tests...");
    const labTestsData = [
      {
        patientId: patientMap["Aditi Sharma"]._id,
        doctorId: doctorMap["Dr. Rajiv Sharma"]._id,
        testName: "Complete Blood Count (CBC)",
        testCategory: "Blood",
        priority: "Urgent",
        status: "Completed",
        resultValue: "Hb: 12.8 g/dL, TLC: 14,200 /uL (Elevated), Platelets: 2.8 Lakhs",
        normalRange: "Hb: 12-15, TLC: 4000-11000, Plt: 1.5-4.5L",
        interpretation: "Abnormal",
        cost: 450,
      },
      {
        patientId: patientMap["Karan Malhotra"]._id,
        doctorId: doctorMap["Dr. Rajiv Sharma"]._id,
        testName: "Lipid Profile & Troponin-I",
        testCategory: "Biochemistry",
        priority: "STAT",
        status: "Completed",
        resultValue: "Troponin-I: 0.02 ng/mL (Normal), Total Cholesterol: 248 mg/dL (High), LDL: 162 mg/dL",
        normalRange: "Trop-I: <0.04, Total Chol: <200, LDL: <100",
        interpretation: "Abnormal",
        cost: 1200,
      },
      {
        patientId: patientMap["Rohan Verma"]._id,
        doctorId: doctorMap["Dr. Rajesh Gupta"]._id,
        testName: "Liver Function Test (LFT)",
        testCategory: "Biochemistry",
        priority: "Routine",
        status: "InProgress",
        cost: 650,
      },
      {
        patientId: patientMap["Meera Nair"]._id,
        doctorId: doctorMap["Dr. Karan Patel"]._id,
        testName: "Kidney Function Test (KFT)",
        testCategory: "Biochemistry",
        priority: "Routine",
        status: "Completed",
        resultValue: "Blood Urea: 28 mg/dL, S. Creatinine: 0.9 mg/dL, Uric Acid: 4.8 mg/dL",
        normalRange: "Urea: 15-45, Creat: 0.6-1.2",
        interpretation: "Normal",
        cost: 550,
      },
      {
        patientId: patientMap["Priya Sharma"]._id,
        doctorId: doctorMap["Dr. Rajesh Gupta"]._id,
        testName: "Urine Routine & Microscopy",
        testCategory: "Urine",
        priority: "Routine",
        status: "SampleCollected",
        cost: 250,
      },
    ];

    for (const lt of labTestsData) {
      await LabTest.create(lt);
    }
    console.log(`✅ Seeded ${labTestsData.length} Diagnostic Lab Tests`);

    // ─────────────────────────────────────────────────────────────
    // 14. RADIOLOGY
    // ─────────────────────────────────────────────────────────────
    console.log("\n🩻 Seeding Radiology Tests...");
    const radiologyData = [
      {
        patientId: patientMap["Aditi Sharma"]._id,
        doctorId: doctorMap["Dr. Rajiv Sharma"]._id,
        modality: "X-Ray",
        bodyPart: "Chest (PA & Lateral)",
        priority: "STAT",
        status: "Completed",
        findings: "Bilateral patchy interstitial infiltrates in lower zones consistent with ARDS / acute viral pneumonitis. Cardiothoracic ratio normal.",
        impression: "Abnormal",
        cost: 800,
      },
      {
        patientId: patientMap["Sunil Mehta"]._id,
        doctorId: doctorMap["Dr. Priya Sharma"]._id,
        modality: "MRI",
        bodyPart: "Brain with DWI & MRA",
        priority: "Urgent",
        status: "Completed",
        findings: "No evidence of acute territorial infarction on diffusion weighted imaging. Age-appropriate mild cerebral atrophy with chronic microvascular ischemic changes.",
        impression: "Normal",
        cost: 6500,
      },
      {
        patientId: patientMap["Karan Malhotra"]._id,
        doctorId: doctorMap["Dr. Rajiv Sharma"]._id,
        modality: "Ultrasound",
        bodyPart: "Echocardiography (2D Echo)",
        priority: "Routine",
        status: "Completed",
        findings: "Concentric left ventricular hypertrophy. LVEF 58%. Mild diastolic dysfunction Grade-1.",
        impression: "Abnormal",
        cost: 2200,
      },
    ];

    for (const rad of radiologyData) {
      await Radiology.create(rad);
    }
    console.log(`✅ Seeded ${radiologyData.length} Radiology Scans`);

    // ─────────────────────────────────────────────────────────────
    // 15. SUPPLIERS & INVENTORY
    // ─────────────────────────────────────────────────────────────
    console.log("\n📦 Seeding Suppliers & Pharmacy Inventory...");
    const suppliersData = [
      {
        supplierName: "MedLife Pharmaceuticals Ltd.",
        contactPerson: "Rajesh Mittal",
        phone: "+91 9811002244",
        email: "sales@medlifepharma.com",
        address: "Plot 45, Okhla Industrial Area Phase 3",
        city: "New Delhi",
        state: "Delhi",
        gstin: "07AAACM1234F1Z8",
        category: "Medicine",
      },
      {
        supplierName: "Apex Medical & Surgical Supplies",
        contactPerson: "Vikas Aggarwal",
        phone: "+91 9822113355",
        email: "orders@apexmedsupplies.com",
        address: "Shop 12, Medical Market, Bhagirath Palace",
        city: "Delhi",
        state: "Delhi",
        gstin: "07AABCA5678P1Z3",
        category: "Consumables",
      },
    ];

    const supplierMap = {};
    for (const s of suppliersData) {
      const doc = await Supplier.create(s);
      supplierMap[s.supplierName] = doc;
    }

    const inventoryItemsData = [
      {
        itemId: "ITM-001",
        itemName: "Paracetamol Tablets 650mg",
        category: "Medicine",
        quantityInStock: 2400,
        reorderLevel: 500,
        unitPrice: 2.5,
        unit: "Strip",
        batchNumber: "PCM-2026-08",
        supplierId: supplierMap["MedLife Pharmaceuticals Ltd."]._id,
        status: "Active",
      },
      {
        itemId: "ITM-002",
        itemName: "Amoxicillin & Potassium Clavulanate 625mg",
        category: "Medicine",
        quantityInStock: 1200,
        reorderLevel: 300,
        unitPrice: 18.0,
        unit: "Strip",
        batchNumber: "AMX-2026-04",
        supplierId: supplierMap["MedLife Pharmaceuticals Ltd."]._id,
        status: "Active",
      },
      {
        itemId: "ITM-003",
        itemName: "Atorvastatin Tablets 20mg",
        category: "Medicine",
        quantityInStock: 950,
        reorderLevel: 250,
        unitPrice: 8.5,
        unit: "Strip",
        batchNumber: "ATV-2026-01",
        supplierId: supplierMap["MedLife Pharmaceuticals Ltd."]._id,
        status: "Active",
      },
      {
        itemId: "ITM-004",
        itemName: "Disposable Syringes with Needle 5ml",
        category: "Consumables",
        quantityInStock: 5000,
        reorderLevel: 1000,
        unitPrice: 6.0,
        unit: "Piece",
        batchNumber: "SYR-2026-11",
        supplierId: supplierMap["Apex Medical & Surgical Supplies"]._id,
        status: "Active",
      },
      {
        itemId: "ITM-005",
        itemName: "Sterile Surgical Gloves Size 7.5",
        category: "Surgical",
        quantityInStock: 1800,
        reorderLevel: 400,
        unitPrice: 25.0,
        unit: "Box",
        batchNumber: "GLV-2026-09",
        supplierId: supplierMap["Apex Medical & Surgical Supplies"]._id,
        status: "Active",
      },
      {
        itemId: "MED-101",
        itemName: "Amlodipine 5mg",
        category: "Medicine",
        quantityInStock: 800,
        reorderLevel: 100,
        unitPrice: 3.5,
        unit: "Strip",
        batchNumber: "AML-2026-01",
        supplierId: supplierMap["MedLife Pharmaceuticals Ltd."]._id,
        status: "Active",
      },
      {
        itemId: "MED-102",
        itemName: "Metformin 500mg",
        category: "Medicine",
        quantityInStock: 750,
        reorderLevel: 100,
        unitPrice: 2.1,
        unit: "Strip",
        batchNumber: "MET-2026-02",
        supplierId: supplierMap["MedLife Pharmaceuticals Ltd."]._id,
        status: "Active",
      },
      {
        itemId: "MED-103",
        itemName: "Cetirizine 10mg",
        category: "Medicine",
        quantityInStock: 600,
        reorderLevel: 80,
        unitPrice: 1.2,
        unit: "Strip",
        batchNumber: "CET-2026-03",
        supplierId: supplierMap["MedLife Pharmaceuticals Ltd."]._id,
        status: "Active",
      },
      {
        itemId: "MED-104",
        itemName: "Ibuprofen 400mg",
        category: "Medicine",
        quantityInStock: 650,
        reorderLevel: 100,
        unitPrice: 1.8,
        unit: "Strip",
        batchNumber: "IBU-2026-04",
        supplierId: supplierMap["MedLife Pharmaceuticals Ltd."]._id,
        status: "Active",
      },
      {
        itemId: "MED-105",
        itemName: "Amoxicillin 250mg",
        category: "Medicine",
        quantityInStock: 700,
        reorderLevel: 100,
        unitPrice: 4.0,
        unit: "Strip",
        batchNumber: "AMX-2026-05",
        supplierId: supplierMap["MedLife Pharmaceuticals Ltd."]._id,
        status: "Active",
      },
      {
        itemId: "MED-106",
        itemName: "Insulin Glargine",
        category: "Medicine",
        quantityInStock: 250,
        reorderLevel: 30,
        unitPrice: 320,
        unit: "Vial",
        batchNumber: "INS-2026-06",
        supplierId: supplierMap["MedLife Pharmaceuticals Ltd."]._id,
        status: "Active",
      },
    ];

    for (const item of inventoryItemsData) {
      await InventoryItem.create(item);
    }
    console.log(`✅ Seeded ${inventoryItemsData.length} Inventory & Pharmacy items`);

    // ─────────────────────────────────────────────────────────────
    // 16. OPERATION THEATERS & SURGERIES
    // ─────────────────────────────────────────────────────────────
    console.log("\n🏥 Seeding Operation Theaters & Surgeries...");
    const otData = [
      { otName: "OT-1 (Main Surgical Suite)", location: "2nd Floor, Wing A", equipmentAvailable: ["C-Arm", "Anesthesia Workstation", "Laparoscopy Tower"], status: "Available" },
      { otName: "OT-2 (Cardiac Surgery OT)", location: "2nd Floor, Wing B", equipmentAvailable: ["Heart-Lung Machine", "Intra-Aortic Balloon Pump", "Echo Machine"], status: "Occupied" },
      { otName: "OT-3 (Orthopedic & Trauma OT)", location: "3rd Floor, Wing A", equipmentAvailable: ["Orthopedic Traction Table", "High-Speed Drill System"], status: "Available" },
    ];

    const otMap = {};
    for (const ot of otData) {
      const doc = await OperationTheater.create(ot);
      otMap[ot.otName] = doc;
    }

    const surgeriesData = [
      {
        patientId: patientMap["Meera Nair"]._id,
        primarySurgeonId: doctorMap["Dr. Karan Patel"]._id,
        otId: otMap["OT-3 (Orthopedic & Trauma OT)"]._id,
        surgeryName: "Right Femur Open Reduction & Internal Fixation (ORIF)",
        surgeryDate: new Date("2026-08-12"),
        startTime: "09:30 AM",
        endTime: "11:45 AM",
        status: "Completed",
        notes: "Titanium intramedullary nail fixed successfully. Stable vitals throughout.",
      },
    ];

    for (const s of surgeriesData) {
      await Surgery.create(s);
    }
    console.log(`✅ Seeded Operation Theaters & Surgeries`);

    // ─────────────────────────────────────────────────────────────
    // 17. BILLING & PAYMENTS
    // ─────────────────────────────────────────────────────────────
    console.log("\n💰 Seeding Billing & Financial Invoices...");
    const billingsData = [
      {
        billId: "INV-2026-001",
        patient: "Aditi Sharma",
        patientName: "Aditi Sharma",
        patientId: patientMap["Aditi Sharma"]._id,
        billDate: "2026-08-13",
        doctorCharge: 2400,
        roomCharge: 7000,
        medicineCharge: 3200,
        labCharge: 1250,
        totalAmount: 13850,
        paidAmount: 10000,
        balance: 3850,
        paymentStatus: "Partial",
        items: [
          { description: "ICU Bed Charges (2 Days)", quantity: 2, unitPrice: 3500, totalPrice: 7000 },
          { description: "Consultant Physician Visits", quantity: 2, unitPrice: 1200, totalPrice: 2400 },
          { description: "Diagnostic Lab & X-Ray", quantity: 1, unitPrice: 1250, totalPrice: 1250 },
          { description: "Prescription Medications & IV Infusion", quantity: 1, unitPrice: 3200, totalPrice: 3200 },
        ],
      },
      {
        billId: "INV-2026-002",
        patient: "Rohan Verma",
        patientName: "Rohan Verma",
        patientId: patientMap["Rohan Verma"]._id,
        billDate: "2026-08-13",
        doctorCharge: 1400,
        roomCharge: 2400,
        medicineCharge: 1800,
        labCharge: 1200,
        totalAmount: 6800,
        paidAmount: 6800,
        balance: 0,
        paymentStatus: "Paid",
        items: [
          { description: "General Ward Bed Charges (2 Days)", quantity: 2, unitPrice: 1200, totalPrice: 2400 },
          { description: "Internal Medicine Consultations", quantity: 2, unitPrice: 700, totalPrice: 1400 },
          { description: "Diagnostic Blood Tests", quantity: 1, unitPrice: 1200, totalPrice: 1200 },
          { description: "IV Antibiotics & Pharmacy Dispense", quantity: 1, unitPrice: 1800, totalPrice: 1800 },
        ],
      },
    ];

    for (const b of billingsData) {
      const doc = await Billing.create(b);

      if (b.paidAmount > 0) {
        await Payment.create({
          billingId: doc._id,
          patientId: b.patientId,
          amount: b.paidAmount,
          paymentMethod: "online",
          status: "success",
          transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        });
      }
    }
    console.log(`✅ Seeded ${billingsData.length} Invoices & Payments`);

    // ─────────────────────────────────────────────────────────────
    // 18. ASSETS & MEDICAL EQUIPMENT
    // ─────────────────────────────────────────────────────────────
    console.log("\n🔬 Seeding Hospital Assets...");
    const assetsData = [
      {
        assetName: "Philips HeartStart XL+ Defibrillator",
        category: "Medical Equipment",
        purchaseDate: new Date("2024-03-15"),
        purchasePrice: 420000,
        warrantyExpiry: new Date("2027-03-15"),
        location: "Emergency Unit - Crash Cart 1",
        status: "Active",
        createdBy: userMap["admin@hms.com"]._id,
      },
      {
        assetName: "GE Carescape B650 ICU Multipara Patient Monitor",
        category: "Medical Equipment",
        purchaseDate: new Date("2023-11-20"),
        purchasePrice: 280000,
        warrantyExpiry: new Date("2026-11-20"),
        location: "ICU Bed ICU-01",
        status: "Active",
        createdBy: userMap["admin@hms.com"]._id,
      },
      {
        assetName: "Dräger Evita V300 Intensive Care Ventilator",
        category: "Medical Equipment",
        purchaseDate: new Date("2024-01-10"),
        purchasePrice: 950000,
        warrantyExpiry: new Date("2027-01-10"),
        location: "ICU Wing B",
        status: "Active",
        createdBy: userMap["admin@hms.com"]._id,
      },
      {
        assetName: "Siemens SOMATOM go.Now 32-Slice CT Scanner",
        category: "Medical Equipment",
        purchaseDate: new Date("2022-06-05"),
        purchasePrice: 14500000,
        warrantyExpiry: new Date("2027-06-05"),
        location: "Radiology Department - CT Suite 1",
        status: "Active",
        createdBy: userMap["admin@hms.com"]._id,
      },
    ];

    for (const a of assetsData) {
      await Asset.create(a);
    }
    console.log(`✅ Seeded ${assetsData.length} Hospital Capital Assets`);

    // ─────────────────────────────────────────────────────────────
    // 19. NOTIFICATIONS
    // ─────────────────────────────────────────────────────────────
    console.log("\n🔔 Seeding Notifications...");
    const notificationsData = [
      {
        userId: userMap["admin@hms.com"]._id,
        title: "Bed Allocation Alert",
        message: "Patient Aditi Sharma admitted to ICU Bed ICU-01.",
        type: "system",
        priority: "medium",
        status: "unread",
      },
      {
        userId: userMap["doctor@hms.com"]._id,
        title: "Medical Record Alert",
        message: "CBC results ready for Aditi Sharma (TLC elevated at 14,200).",
        type: "medical_record",
        priority: "high",
        status: "unread",
      },
      {
        userId: userMap["admin@hms.com"]._id,
        title: "Low Inventory Warning",
        message: "Atorvastatin 20mg is nearing reorder threshold (950 strips left).",
        type: "system",
        priority: "medium",
        status: "read",
      },
    ];

    for (const n of notificationsData) {
      await Notification.create(n);
    }
    console.log(`✅ Seeded ${notificationsData.length} Notifications`);

    console.log("\n==================================================");
    console.log("🎉 ALL HMS MODULE DATA SEEDED SUCCESSFULLY INTO MONGODB!");
    console.log("==================================================");
    console.log("\nDefault Login Accounts:");
    console.log("  • Admin:        admin@hms.com / password123");
    console.log("  • Doctor:       doctor@hms.com / password123");
    console.log("  • Nurse:        nurse@hms.com / password123");
    console.log("  • Receptionist: receptionist@hms.com / password123");
    console.log("  • Patient:      patient@hms.com / password123");
    console.log("==================================================\n");
  } catch (err) {
    console.error("❌ Error during database seeding:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seed();

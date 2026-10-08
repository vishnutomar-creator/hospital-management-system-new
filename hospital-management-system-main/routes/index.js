const express = require("express");

const router = express.Router();

// =========================
// Health Check
// =========================

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HMS API is working",
  });
});

// =========================
// Routes
// =========================

const userRoutes = require("./user.routes");
const doctorRoutes = require("./doctor.routes");
const departmentRoutes = require("./department.routes");
const patientRoutes = require("./patient.routes");
const dashboardRoutes = require("./dashboard.routes");
const authRoutes = require("./auth.routes");
const appointmentRoutes = require("./appointment.routes");
const auditRoutes = require("./audit.routes");
const notificationRoutes = require("./notification.routes");
const prescriptionRoutes = require("./prescription.routes");
const medicalRecordRoutes = require("./medicalRecord.routes");
const billingRoutes = require("./billing.routes");
const paymentRoutes = require("./payment.routes");
const supplierRoutes = require("./supplier.routes");
const surgeryroutes = require("./surgery.route");
const bedroutes = require("./bed.route");
const wardRoutes = require("./ward.route");
const nursesroute = require("./nurses.route");
const queueRoutes = require("./queue.route");
const labTestRoutes = require("./labtest.route");
const pharmacyRoutes = require("./pharmacy.route");
const financeRoutes = require("./finance.routes");
const assetRoutes = require("./asset.route");
const operationTheaterRoutes = require("./operationTheater.routes");
const inventoryRoutes = require("./inventory.routes");
const purchaseOrderRoutes = require("./purchaseorder.route");
const admissionRoutes = require("./admission.route");
const radiologyRoutes = require("./radiology.route");
const insuranceClaimRoutes = require("./insuranceclaim.route");

// =========================
// Route Mounting
// =========================

router.use("/users", userRoutes);

router.use("/doctors", doctorRoutes);

router.use("/departments", departmentRoutes);

router.use("/patients", patientRoutes);

router.use("/", dashboardRoutes);

router.use("/auth", authRoutes);

router.use("/", appointmentRoutes);

router.use("/", auditRoutes);

router.use("/", notificationRoutes);

router.use("/", prescriptionRoutes);

router.use("/", medicalRecordRoutes);

router.use("/billings", billingRoutes);

router.use("/payments", paymentRoutes);

router.use("/suppliers", supplierRoutes);

router.use("/surgeries", surgeryroutes);

router.use("/beds", bedroutes);

router.use("/wards", wardRoutes);

router.use("/admissions", admissionRoutes);

router.use("/nurses", nursesroute);

router.use("/queue", queueRoutes);

router.use("/lab-tests", labTestRoutes);

router.use("/pharmacy", pharmacyRoutes);

router.use("/finance", financeRoutes);

router.use("/assets", assetRoutes);

router.use("/operation-theater", operationTheaterRoutes);

router.use("/inventory", inventoryRoutes);

router.use("/purchase-orders", purchaseOrderRoutes);

router.use("/radiology", radiologyRoutes);

router.use("/insurance", insuranceClaimRoutes);

module.exports = router;





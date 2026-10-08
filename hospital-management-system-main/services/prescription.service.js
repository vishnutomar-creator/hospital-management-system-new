const prescriptionRepository = require(
  "../repositories/prescription.repository"
);

const notificationService = require(
  "./notification.service"
);

const createPrescription = async (
  prescriptionData
) => {
  const prescription =
    await prescriptionRepository.createPrescription(
      prescriptionData
    );

  /*
   * Patient notification
   *
   * Patient model should have userId.
   */

  return prescription;
};

const getPrescriptions = async () => {
  return await prescriptionRepository.getPrescriptions();
};

const getPrescriptionById = async (id) => {
  const prescription =
    await prescriptionRepository.getPrescriptionById(
      id
    );

  if (!prescription) {
    const error = new Error(
      "Prescription not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return prescription;
};

const getPrescriptionsByPatient = async (
  patientId
) => {
  return await prescriptionRepository.getPrescriptionsByPatient(
    patientId
  );
};

const getPrescriptionsByDoctor = async (
  doctorId
) => {
  return await prescriptionRepository.getPrescriptionsByDoctor(
    doctorId
  );
};

const updatePrescription = async (
  id,
  prescriptionData
) => {
  const prescription =
    await prescriptionRepository.updatePrescription(
      id,
      prescriptionData
    );

  if (!prescription) {
    const error = new Error(
      "Prescription not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return prescription;
};

const deletePrescription = async (id) => {
  const prescription =
    await prescriptionRepository.deletePrescription(
      id
    );

  if (!prescription) {
    const error = new Error(
      "Prescription not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return prescription;
};

const dispensePrescription = async (id, data = {}) => {
  const Prescription = require("../models/Prescription");
  const mongoose = require("mongoose");
  const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { rxId: id };

  const updateData = {
    status: "Dispensed",
    dispensedAt: new Date(),
    dispensedBy: data.dispensedBy || "Pharmacist",
  };

  const prescription = await Prescription.findOneAndUpdate(
    query,
    updateData,
    { returnDocument: "after" }
  );

  if (!prescription) {
    const error = new Error("Prescription not found");
    error.statusCode = 404;
    throw error;
  }

  // Deduct inventory stock if matching medicines exist
  try {
    const InventoryItem = require("../models/inventoryitem");
    if (Array.isArray(prescription.medicines)) {
      for (const med of prescription.medicines) {
        if (med.name) {
          const qty = Number(med.quantity) || 1;
          await InventoryItem.findOneAndUpdate(
            { itemName: { $regex: new RegExp(`^${med.name.trim()}$`, "i") } },
            { $inc: { quantityInStock: -qty } }
          );
        }
      }
    }
  } catch (invErr) {
    // Non-fatal if inventory model differs
  }

  return prescription;
};

const returnPrescription = async (id, data = {}) => {
  const Prescription = require("../models/Prescription");
  const mongoose = require("mongoose");
  const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { rxId: id };

  const updateData = {
    status: "Returned",
    returnedAt: new Date(),
    returnReason: data.reason || "Patient return",
  };

  const prescription = await Prescription.findOneAndUpdate(
    query,
    updateData,
    { returnDocument: "after" }
  );

  if (!prescription) {
    const error = new Error("Prescription not found");
    error.statusCode = 404;
    throw error;
  }

  // Restore inventory stock if returnedItems provided
  try {
    const InventoryItem = require("../models/inventoryitem");
    if (Array.isArray(data.returnedItems)) {
      for (const item of data.returnedItems) {
        if (item.medicineName && item.quantity) {
          await InventoryItem.findOneAndUpdate(
            { itemName: { $regex: new RegExp(`^${item.medicineName.trim()}$`, "i") } },
            { $inc: { quantityInStock: Number(item.quantity) } }
          );
        }
      }
    }
  } catch (invErr) {
    // Non-fatal
  }

  return prescription;
};

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  updatePrescription,
  deletePrescription,
  dispensePrescription,
  returnPrescription,
};
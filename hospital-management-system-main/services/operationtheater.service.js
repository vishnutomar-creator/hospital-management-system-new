const otRepository = require("../repositories/operationtheater.repository");
const Surgery = require("../models/surgeries");

const createOT = async (otData) => {
    const existing = await otRepository.getOTByName(otData.otName);
    if (existing) {
        throw new Error("An Operation Theater with this name already exists");
    }

    return await otRepository.createOT(otData);
};

const getOTs = async () => {
    return await otRepository.getOTs();
};

const getOTById = async (id) => {
    const ot = await otRepository.getOTById(id);
    if (!ot) {
        throw new Error("Operation Theater not found");
    }
    return ot;
};

const updateOT = async (id, otData) => {
    const ot = await otRepository.getOTById(id);
    if (!ot) {
        throw new Error("Operation Theater not found");
    }

    if (otData.otName) {
        const existing = await otRepository.getOTByName(otData.otName);
        if (existing && existing._id.toString() !== id) {
            throw new Error("An Operation Theater with this name already exists");
        }
    }

    // status changes must go through dedicated transitions
    delete otData.status;

    return await otRepository.updateOT(id, otData);
};

const setUnderMaintenance = async (id) => {
    const ot = await otRepository.getOTById(id);
    if (!ot) {
        throw new Error("Operation Theater not found");
    }

    if (ot.status === "Occupied") {
        throw new Error("Cannot set an occupied OT under maintenance — a surgery is in progress");
    }

    return await otRepository.updateOT(id, { status: "UnderMaintenance" });
};

const setAvailable = async (id) => {
    const ot = await otRepository.getOTById(id);
    if (!ot) {
        throw new Error("Operation Theater not found");
    }

    return await otRepository.updateOT(id, { status: "Available" });
};

const deleteOT = async (id) => {
    const ot = await otRepository.getOTById(id);
    if (!ot) {
        throw new Error("Operation Theater not found");
    }

    if (ot.status === "Occupied") {
        throw new Error("Cannot delete an OT that is currently occupied");
    }

    await otRepository.deleteOT(id);

    return { message: "Operation Theater deleted successfully" };
};

// Check which OTs are free on a given date (cross-referencing Surgery bookings)
const getAvailableOTsForDate = async (surgeryDate) => {
    const allOTs = await otRepository.getOTs();

    const bookedOTIds = await Surgery.find({
        surgeryDate,
        status: { $in: ["Scheduled", "InProgress"] },
    }).distinct("otId");

    const bookedIdsSet = new Set(bookedOTIds.map((id) => id.toString()));

    return allOTs.filter(
        (ot) => ot.status !== "UnderMaintenance" && !bookedIdsSet.has(ot._id.toString())
    );
};

module.exports = {
    createOT,
    getOTs,
    getOTById,
    updateOT,
    setUnderMaintenance,
    setAvailable,
    deleteOT,
    getAvailableOTsForDate,
};
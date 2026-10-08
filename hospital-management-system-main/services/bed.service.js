const bedRepository = require("../repositories/bed.repository");
const wardRepository = require("../repositories/ward.repository");

const createBed = async (bedData) => {
    const ward = await wardRepository.getWardById(bedData.wardId);
    if (!ward) {
        throw new Error("Ward not found");
    }

    const existingBedCount = await bedRepository.countBedsInWard(bedData.wardId);
    if (existingBedCount >= ward.totalBeds) {
        throw new Error("Ward bed capacity is full — cannot add more beds than declared totalBeds");
    }

    const duplicate = await bedRepository.getBedByNumberInWard(bedData.wardId, bedData.bedNumber);
    if (duplicate) {
        throw new Error("This bed number already exists in the selected ward");
    }

    return await bedRepository.createBed(bedData);
};

const getBeds = async () => {
    return await bedRepository.getBeds();
};

const getBedById = async (id) => {
    const bed = await bedRepository.getBedById(id);
    if (!bed) {
        throw new Error("Bed not found");
    }
    return bed;
};

const updateBed = async (id, bedData) => {
    const bed = await bedRepository.getBedById(id);
    if (!bed) {
        throw new Error("Bed not found");
    }

    // Status/patient/ward-availability changes must go through allocateBed/releaseBed
    delete bedData.status;
    delete bedData.currentPatientId;
    delete bedData.admissionId;
    delete bedData.wardId;

    return await bedRepository.updateBed(id, bedData);
};

// Assign a bed to a patient (called by Admissions module later, or directly)
const allocateBed = async (id, patientId, admissionId = null) => {
    const bed = await bedRepository.getBedById(id);
    if (!bed) {
        throw new Error("Bed not found");
    }

    if (bed.status !== "Available") {
        throw new Error(`Bed is not available (current status: ${bed.status})`);
    }

    const updatedBed = await bedRepository.updateBed(id, {
        status: "Occupied",
        currentPatientId: patientId,
        admissionId,
    });

    await wardRepository.decrementAvailableBeds(bed.wardId);

    return updatedBed;
};

// Free up a bed (on discharge)
const releaseBed = async (id) => {
    const bed = await bedRepository.getBedById(id);
    if (!bed) {
        throw new Error("Bed not found");
    }

    if (bed.status !== "Occupied") {
        return bed; // Already released and available
    }

    const updatedBed = await bedRepository.updateBed(id, {
        status: "Available",
        currentPatientId: null,
        admissionId: null,
    });

    await wardRepository.incrementAvailableBeds(bed.wardId);

    return updatedBed;
};

const deleteBed = async (id) => {
    const bed = await bedRepository.getBedById(id);
    if (!bed) {
        throw new Error("Bed not found");
    }

    if (bed.status === "Occupied") {
        throw new Error("Cannot delete an occupied bed");
    }

    await bedRepository.deleteBed(id);

    return { message: "Bed deleted successfully" };
};

module.exports = {
    createBed,
    getBeds,
    getBedById,
    updateBed,
    allocateBed,
    releaseBed,
    deleteBed,
};
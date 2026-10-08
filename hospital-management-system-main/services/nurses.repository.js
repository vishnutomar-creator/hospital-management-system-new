const bcrypt = require("bcryptjs");
const nurseRepository = require("../repositories/nurses.repository");

const createNurse = async (nurseData) => {
    const existingEmail = await nurseRepository.getNurseByEmail(nurseData.email);
    if (existingEmail) {
        throw new Error("Nurse with this email already exists");
    }

    if (nurseData.licenseNumber) {
        const existingLicense = await nurseRepository.getNurseByLicense(nurseData.licenseNumber);
        if (existingLicense) {
            throw new Error("Nurse with this license number already exists");
        }
    }

    nurseData.password = await bcrypt.hash(nurseData.password, 10);

    const nurse = await nurseRepository.createNurse(nurseData);

    const nurseObj = nurse.toObject();
    delete nurseObj.password;

    return nurseObj;
};

const getNurses = async () => {
    return await nurseRepository.getNurses();
};

const getNurseById = async (id) => {
    const nurse = await nurseRepository.getNurseById(id);
    if (!nurse) {
        throw new Error("Nurse not found");
    }
    return nurse;
};

const updateNurse = async (id, nurseData) => {
    const nurse = await nurseRepository.getNurseById(id);
    if (!nurse) {
        throw new Error("Nurse not found");
    }

    // Password/email changes must go through dedicated auth flows
    delete nurseData.password;
    delete nurseData.email;

    if (nurseData.licenseNumber) {
        const existing = await nurseRepository.getNurseByLicense(nurseData.licenseNumber);
        if (existing && existing._id.toString() !== id) {
            throw new Error("Nurse with this license number already exists");
        }
    }

    return await nurseRepository.updateNurse(id, nurseData);
};

const deleteNurse = async (id) => {
    const nurse = await nurseRepository.getNurseById(id);
    if (!nurse) {
        throw new Error("Nurse not found");
    }

    await nurseRepository.deleteNurse(id);

    return { message: "Nurse deactivated successfully" };
};

const getNursesByWard = async (wardId) => {
    return await nurseRepository.getNursesByWard(wardId);
};

module.exports = {
    createNurse,
    getNurses,
    getNurseById,
    updateNurse,
    deleteNurse,
    getNursesByWard,
};
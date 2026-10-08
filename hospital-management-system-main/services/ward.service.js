const wardRepository = require("../repositories/ward.repository");

const createWard = async (wardData) => {
    const existing = await wardRepository.getWardByName(wardData.wardName);

    if (existing) {
        throw new Error("Ward with this name already exists");
    }

    // availableBeds always starts equal to totalBeds on creation
    wardData.availableBeds = wardData.totalBeds;

    return await wardRepository.createWard(wardData);
};

const getWards = async () => {
    return await wardRepository.getWards();
};

const getWardById = async (id) => {
    const ward = await wardRepository.getWardById(id);

    if (!ward) {
        throw new Error("Ward not found");
    }

    return ward;
};

const updateWard = async (id, wardData) => {
    const ward = await wardRepository.getWardById(id);

    if (!ward) {
        throw new Error("Ward not found");
    }

    if (wardData.wardName) {
        const existing = await wardRepository.getWardByName(wardData.wardName);
        if (existing && existing._id.toString() !== id) {
            throw new Error("Ward with this name already exists");
        }
    }

    // Prevent manual override of availableBeds directly via update
    // (should only change via bed allocation/discharge flow)
    delete wardData.availableBeds;

    return await wardRepository.updateWard(id, wardData);
};

const deleteWard = async (id) => {
    const ward = await wardRepository.getWardById(id);

    if (!ward) {
        throw new Error("Ward not found");
    }

    await wardRepository.deleteWard(id);

    return { message: "Ward deleted successfully" };
};

module.exports = {
    createWard,
    getWards,
    getWardById,
    updateWard,
    deleteWard,
};
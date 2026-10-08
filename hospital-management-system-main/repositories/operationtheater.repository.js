const OperationTheater = require("../models/operationtheater");

const createOT = async (otData) => {
    return await OperationTheater.create(otData);
};

const getOTs = async () => {
    return await OperationTheater.find().sort({ createdAt: -1 });
};

const getOTById = async (id) => {
    return await OperationTheater.findById(id);
};

const getOTByName = async (otName) => {
    return await OperationTheater.findOne({ otName });
};

const updateOT = async (id, otData) => {
    return await OperationTheater.findByIdAndUpdate(id, otData, {
        new: true,
        runValidators: true,
    });
};

const deleteOT = async (id) => {
    return await OperationTheater.findByIdAndDelete(id);
};

module.exports = {
    createOT,
    getOTs,
    getOTById,
    getOTByName,
    updateOT,
    deleteOT,
};
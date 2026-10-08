const surgeryRepository = require("../repositories/surgery.repository");

const createSurgery = async (surgeryData) => {
  if (surgeryData.otId) {
    const clashing = await surgeryRepository.getSurgeriesByOtAndDate(
      surgeryData.otId,
      surgeryData.surgeryDate
    );

    if (clashing.length > 0) {
      throw new Error("Operation Theater is already booked on this date");
    }
  }

  return await surgeryRepository.createSurgery(surgeryData);
};

const getSurgeries = async () => {
  return await surgeryRepository.getSurgeries();
};

const getSurgeryById = async (id) => {
  const surgery = await surgeryRepository.getSurgeryById(id);

  if (!surgery) {
    throw new Error("Surgery not found");
  }

  return surgery;
};

const updateSurgery = async (id, surgeryData) => {
  const surgery = await surgeryRepository.getSurgeryById(id);

  if (!surgery) {
    throw new Error("Surgery not found");
  }

  return await surgeryRepository.updateSurgery(id, surgeryData);
};

const deleteSurgery = async (id) => {
  const surgery = await surgeryRepository.getSurgeryById(id);

  if (!surgery) {
    throw new Error("Surgery not found");
  }

  await surgeryRepository.deleteSurgery(id);

  return { message: "Surgery deleted successfully" };
};

module.exports = {
  createSurgery,
  getSurgeries,
  getSurgeryById,
  updateSurgery,
  deleteSurgery,
};
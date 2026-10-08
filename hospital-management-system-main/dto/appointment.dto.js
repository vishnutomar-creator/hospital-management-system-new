const createAppointmentDTO = (data) => {
  return {
    patientId: data.patientId,
    doctorId: data.doctorId,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    reason: data.reason,
    notes: data.notes || "",
  };
};

const updateAppointmentDTO = (data) => {
  const dto = {};

  if (data.patientId !== undefined) {
    dto.patientId = data.patientId;
  }

  if (data.doctorId !== undefined) {
    dto.doctorId = data.doctorId;
  }

  if (data.appointmentDate !== undefined) {
    dto.appointmentDate = data.appointmentDate;
  }

  if (data.appointmentTime !== undefined) {
    dto.appointmentTime = data.appointmentTime;
  }

  if (data.reason !== undefined) {
    dto.reason = data.reason;
  }

  if (data.status !== undefined) {
    dto.status = data.status;
  }

  if (data.notes !== undefined) {
    dto.notes = data.notes;
  }

  if (data.cancellationReason !== undefined) {
    dto.cancellationReason = data.cancellationReason;
  }

  return dto;
};

module.exports = {
  createAppointmentDTO,
  updateAppointmentDTO,
};
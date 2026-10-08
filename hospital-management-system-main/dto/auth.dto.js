const registerDTO = (data) => {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    password: data.password,
    role: data.role || "patient",
  };
};

const loginDTO = (data) => {
  return {
    email: data.email,
    password: data.password,
  };
};

const userResponseDTO = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

module.exports = {
  registerDTO,
  loginDTO,
  userResponseDTO,
};
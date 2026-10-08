const userDTO = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileImage: user.profileImage,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const usersDTO = (users) => {
  if (!Array.isArray(users)) return [];
  return users.map((user) => userDTO(user));
};

module.exports = {
  userDTO,
  usersDTO,
};

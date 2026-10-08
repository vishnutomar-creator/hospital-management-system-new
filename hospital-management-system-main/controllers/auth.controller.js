const authService = require("../services/auth.service");

const {
  registerDTO,
  loginDTO,
} = require("../dto/auth.dto");

// REGISTER
const register = async (req, res, next) => {
  try {
    const data = registerDTO(req.body);

    const result =
      await authService.register(data);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const data = loginDTO(req.body);

    const result =
      await authService.login(
        data.email,
        data.password
      );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ME
const getMe = async (req, res, next) => {
  try {
    const user =
      await authService.getMe(
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
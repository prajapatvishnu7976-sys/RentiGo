const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  user.password = undefined;

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message,
    token,
    data: { user },
  });
};

module.exports = { generateToken, sendTokenResponse };
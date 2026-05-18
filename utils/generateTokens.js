const jwt = require("jsonwebtoken")

const generateTokens = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  
  return { accessToken, refreshToken };
};

module.exports = generateTokens;
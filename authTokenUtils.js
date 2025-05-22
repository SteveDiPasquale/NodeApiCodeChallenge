import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
}

function verifyAccessToken(request, response, next) {
  const authHeader = request.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
    return response
      .status(401)
      .json({ error: "Unauthorized - Missing Authorization Token" });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      return response
        .status(403)
        .json({ error: "Forbidden - Invalid Authorization Token" });
    } else {
      request.user = user;
      next();
    }
  });
}

export { generateAccessToken, verifyAccessToken };

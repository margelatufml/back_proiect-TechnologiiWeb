import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: "Access token is missing." });
  }

  try {
    const secretKey = process.env.JWT_SECRET || "ByteNinjas";
    const decoded = jwt.verify(token, secretKey); // Verify token
    req.user = decoded; // Attach user info to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

export default authMiddleware;

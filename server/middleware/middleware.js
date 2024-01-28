// middleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = "1234";

// Middleware to verify the JWT token from the Authorization header
const verifyToken = (req, res, next) => {
    console.log("jatin");
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ error: "Invalid token" });
    }
    req.user = decoded; // Save the decoded token data (in this case, the userId) to the request object for use in protected routes.
    next();
  });
};

module.exports = {Jwt_secret:"1234",verifyToken};

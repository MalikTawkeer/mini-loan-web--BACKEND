// Middleware to verify roles
const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user; // Assumes user data is attached to `req.user` (e.g., from JWT verification)

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    if (user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: `Access denied: Requires ${requiredRole} role` });
    }

    next(); // Proceed if the role matches
  };
};

export default verifyRole;

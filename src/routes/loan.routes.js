import e from "express";

import authorizeUser from "../middlewares/verify.user.role.middleware.js";
import authenticateUser from "../middlewares/authenticate.user.middleware.js";

import {
  approveLoan,
  createLoan,
  getLoansByStatus,
  getUserLoans,
} from "../controllers/loan.controller.js";

const router = e.Router();

//Test OK
//GET SPECIFIC USER LOANS
router.get(
  "/applications",
  authenticateUser,
  authorizeUser("customer"),
  getUserLoans
);

// CREATE LOAN
// OK TESTED
router.post(
  "/applications",
  authenticateUser,
  authorizeUser("customer"),
  createLoan
);

// ADMIN ROUTES
// OK TESTED
router.post(
  "/admin/loans/approve/:loanId",
  authenticateUser,
  authorizeUser("admin"),
  approveLoan
);

// OK TESTED
router.get(
  "/admin/loans/status",
  authenticateUser,
  authorizeUser("admin"),
  getLoansByStatus
);

export default router;

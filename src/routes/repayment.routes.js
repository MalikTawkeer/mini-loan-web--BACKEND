import e from "express";

import authenticateJWT from "../middlewares/authenticate.user.middleware.js";
import verifyRole from "../middlewares/verify.user.role.middleware.js";

import {
  getRepaymentsForLoan,
  submitRepayment,
} from "../controllers/repayment.controller.js";

const router = e.Router();

// SUBMIT REPAYMENT
router.post(
  "/loans/repayments/:loanId/:repaymentId",
  authenticateJWT,
  verifyRole("admin"),
  submitRepayment
);

// SEE LOAN REPAYMENTS BY LOAN ID
router.get(
  "/loans/repayments/history/:loanId",
  authenticateJWT,
  verifyRole("admin"),
  getRepaymentsForLoan
);

export default router;

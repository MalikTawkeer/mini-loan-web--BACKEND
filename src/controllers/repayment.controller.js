import mongoose from "mongoose";
import LoanModel from "../models/loan.model.js";
import RepaymentModel from "../models/repayment.model.js";

const getRepaymentsForLoan = async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await LoanModel.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found!" });

    const repayments = await RepaymentModel.find({ loan_id: loanId });

    res.status(200).json({ repayments });
  } catch (error) {
    res.status(400).json({ message: "Error fetching repayments", error });
  }
};

const submitRepayment = async (req, res) => {
  const session = await mongoose.startSession();

  const { loanId, repaymentId } = req.params;
  const { amount } = req.body;

  try {
    session.startTransaction();

    // CHECK REPAMENT EXISTS
    const repayment = await RepaymentModel.findById(repaymentId).session(
      session
    );
    if (!repayment || repayment.loan_id.toString() !== loanId) {
      return res.status(404).json({ message: "Repayment not found" });
    }

    // CHECK IF ALREADY PAID
    if (repayment.state === "PAID") {
      return res.status(400).json({ message: "Repayment already paid" });
    }

    if (amount === 0)
      return res.status(400).json({ message: "Amount can't be negative." });

    if (amount < repayment.amount) {
      return res
        .status(400)
        .json({ message: "Amount is less than scheduled repayment" });
    }

    // CHANGE STATUS TO PAID
    repayment.state = "PAID";
    await repayment.save({ session });

    // CHECK IF ALL REPAYMENTS ARE PAID FOR THIS LOAN
    const unpaidRepayments = await RepaymentModel.find({
      loan_id: loanId,
      state: "PENDING",
    }).session(session);

    // IF ALL REPAYMENTS ARE PAID ,THEN ALSO CHANGE LOAN STATUS TO PAID
    if (unpaidRepayments.length === 0) {
      await LoanModel.findByIdAndUpdate(loanId, { state: "PAID" }, { session });
    }

    // COMMIT TRANSACTION
    await session.commitTransaction();

    // SUCCESS RESPONSE
    res
      .status(200)
      .json({ message: "Repayment submitted successfully", repayment });
  } catch (error) {
    console.log(error, "ERROR:: while submitting repayment");
    res.status(400).json({ message: "Error submitting repayment", error });
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

export { getRepaymentsForLoan, submitRepayment };

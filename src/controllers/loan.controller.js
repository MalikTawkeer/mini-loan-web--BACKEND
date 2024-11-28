import LoanModel from "../models/loan.model.js";
import RepaymentModel from "../models/repayment.model.js";
import mongoose from "mongoose";

// CERATE LOAD
const createLoan = async (req, res) => {
  const { amount, term } = req.body;

  try {
    const loan = await LoanModel.create({
      user_id: req.user._id,
      amount,
      term,
    });

    res.status(201).json({ message: "Loan created successfully", loan });
  } catch (error) {
    res.status(400).json({ message: "Error creating loan", error });
  }
};

// GET ALL USER LOANS
const getUserLoans = async (req, res) => {
  try {
    const loans = await LoanModel.find({ user_id: req.user.id });

    res.status(200).json({ loans });
  } catch (error) {
    res.status(400).json({ message: "Error fetching loans", error });
  }
};

// UTILITY FUNCTION TO GENERATE REPAYMENTS
const generateRepayments = async (loanId, amount, term, session) => {
  const repaymentAmount = parseFloat((amount / term).toFixed(2));
  const lastRepaymentAmount = parseFloat(
    (amount - repaymentAmount * (term - 1)).toFixed(2)
  );

  const repayments = [];

  for (let i = 0; i < term; i++) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7 * (i + 1));

    repayments.push({
      loan_id: loanId,
      due_date: dueDate,
      amount: i === term - 1 ? lastRepaymentAmount : repaymentAmount,
    });
  }

  await RepaymentModel.insertMany(repayments, { session });
};

// ADMIN CAN APPROVE A LOAN
const approveLoan = async (req, res) => {
  const session = await mongoose.startSession();

  const { loanId } = req.params;

  try {
    session.startTransaction();

    const loan = await LoanModel.findById(loanId).session(session);

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    // Check if loan is already approved
    if (loan.state === "APPROVED") {
      return res.status(400).json({ message: "Loan already approved" });
    }

    loan.state = "APPROVED"; // Change loan state to APPROVED
    await loan.save({ session });

    // Generate repayments after loan approval
    await generateRepayments(loan._id, loan.amount, loan.term, session);

    await session.commitTransaction();

    res
      .status(200)
      .json({ message: "Loan approved and repayments generated", loan });
  } catch (error) {
    res.status(400).json({ message: "Error approving loan", error });
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

// ADMIN CAN SEE LOANS BY specific status
const getLoansByStatus = async (req, res) => {
  try {
    const { status } = req.query; // Get the status from the query parameter

    // Check if the status is valid
    if (!["PENDING", "APPROVED", "PAID"].includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Valid statuses are PENDING, APPROVED, and PAID.",
      });
    }

    // Query for loans with the specified status
    const loans = await LoanModel.find({
      state: status,
    });

    if (loans.length === 0) {
      return res.status(404).json({ message: `No ${status} loans found` });
    }

    // Return the loans with the specified status
    res.status(200).json({ loans });
  } catch (error) {
    res.status(500).json({ message: "Error fetching loans", error });
  }
};

export { createLoan, getUserLoans, approveLoan, getLoansByStatus };

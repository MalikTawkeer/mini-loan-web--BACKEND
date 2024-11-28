import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },

    term: { type: Number, required: true }, // Loan term in weeks

    state: {
      type: String,
      enum: ["PENDING", "APPROVED", "PAID"],
      default: "PENDING",
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LoanModel = mongoose.model("Loan", loanSchema);

export default LoanModel;

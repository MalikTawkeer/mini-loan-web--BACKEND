import mongoose from "mongoose";

const repaymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },

    due_date: { type: Date, required: true },

    state: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" },

    loan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RepaymentModel = mongoose.model("Repayment", repaymentSchema);

export default RepaymentModel;

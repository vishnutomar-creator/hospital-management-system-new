const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    billId: {
      type: String,
      trim: true,
    },
    patient: {
      type: String,
      trim: true,
    },
    patientName: {
      type: String,
      trim: true,
    },
    billDate: {
      type: String,
      trim: true,
    },
    doctorCharge: {
      type: Number,
      default: 0,
    },
    roomCharge: {
      type: Number,
      default: 0,
    },
    medicineCharge: {
      type: Number,
      default: 0,
    },
    labCharge: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
    patientId: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: null,
    },
    appointmentId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    items: [
      {
        description: { type: String },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, default: 0 },
        totalPrice: { type: Number, default: 0 },
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "pending",
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate totalAmount before saving if not provided correctly
billingSchema.pre("save", function () {
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((acc, item) => acc + item.totalPrice, 0);
  }
});

module.exports = mongoose.model("Billing", billingSchema);

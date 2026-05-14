const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },

    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true
    },

    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    slotStartTime: String,

    slotEndTime: String,

    appointmentDate: Date,

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "cancelled"
      ],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);
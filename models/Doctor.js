const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    specialization: {
      type: String,
      required: true
    },

    experience: {
      type: Number,
      required: true
    },

    consultationFee: {
      type: Number,
      required: true
    },

    about: {
      type: String
    },

    profileImage: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
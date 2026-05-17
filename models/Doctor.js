const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },

    lname: {
      type: String,
    },

    email: {
      type: String,
    },

    phone: {
      type: String,
      required: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    consultationFee: {
      type: Number,
      required: true,
    },

    bio: {
      type: String,
    },

    qualifications: { type: String, required: true },

    clinic_name: { type: String, required: true },
    clinic_address: { type: String, required: true },

    // profileImage: {
    //   type: String,
    // },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Doctor", doctorSchema);

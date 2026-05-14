const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    startTime: String,

    endTime: String,

    isBooked: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: true
  }
);

const scheduleSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    slotDuration: {
      type: Number,
      default: 30
    },

    slots: [slotSchema]
  },
  {
    timestamps: true
  }
);

scheduleSchema.index(
  {
    doctor: 1,
    date: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
const mongoose = require("mongoose");

const Appointment = require("../models/Appointment");

const Schedule = require("../models/Schedule");
const ApiResponse = require("../utils/apiResponse");

const bookAppointment = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const { scheduleId, slotId, doctorId } = req.body;

    /*
      STEP 1:
      lock slot if available
    */

    const schedule = await Schedule.findOneAndUpdate(
      {
        _id: scheduleId,

        "slots._id": slotId,

        "slots.isBooked": false,
      },
      {
        $set: {
          "slots.$.isBooked": true,
        },
      },
      {
        new: true,
        session,
      },
    );

    if (!schedule) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Slot already booked",
      });
    }

    /*
      STEP 2:
      get booked slot details
    */

    const slot = schedule.slots.find((slot) => slot._id.toString() === slotId);

    /*
      STEP 3:
      create appointment
    */

    const appointment = await Appointment.create(
      [
        {
          patient: req.user._id,

          doctor: doctorId,

          schedule: scheduleId,

          slotId,

          slotStartTime: slot.startTime,

          slotEndTime: slot.endTime,

          appointmentDate: schedule.date,
        },
      ],
      {
        session,
      },
    );

    /*
      STEP 4:
      commit transaction
    */

    await session.commitTransaction();

    /*
      STEP 5:
      realtime update
    */

    global.io.emit("slotBooked", {
      scheduleId,
      slotId,
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, "Appointment booked successfully", { appointment: appointment[0] }),
      );
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json(
      new ApiResponse(500, "Failed to book appointment", null)
    );
  } finally {
    session.endSession();
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id,
    })
      .populate("doctor")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(
      new ApiResponse(200, "Appointments retrieved successfully", { appointments })
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, "Failed to retrieve appointments", null)
    );
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      },
    );

    res.status(200).json(
      new ApiResponse(200, "Appointment status updated successfully", { appointment })
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, "Failed to update appointment status", null)
    );
  }
};

module.exports = {
  bookAppointment, //for patients
  getMyAppointments, //for patients
  updateAppointmentStatus, //for admin
};

const mongoose = require("mongoose");

const Appointment = require("../models/Appointment");

const Schedule = require("../models/Schedule");
const ApiResponse = require("../utils/apiResponse");
const getPaginatedResults = require("../utils/getPaginatedResult");
const { VALID_STATUS_TRANSITIONS } = require("../config/common");

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

    res.status(201).json(
      new ApiResponse(201, "Appointment booked successfully", {
        appointment: appointment[0],
      }),
    );
  } catch (error) {
    await session.abortTransaction();

    res
      .status(500)
      .json(new ApiResponse(500, "Failed to book appointment", null));
  } finally {
    session.endSession();
  }
};

// const getAppointments = async (req, res) => {
//   try {
//     const { page, limit } = req.params;
//     const filters = {};

//     const appointments = await getPaginatedResults(Appointment, {
//       page,
//       limit,
//       filters,
//       populate: [
//         { path: "doctor", select: "fname lname phone" },
//         { path: "patient", select: "name phone email" },
//       ],
//     });

//     res
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           "Appointments retrieved successfully",
//           appointments,
//         ),
//       );
//   } catch (error) {
//     console.log("error fetch", error);
//     res
//       .status(500)
//       .json(new ApiResponse(500, "Failed to retrieve appointments", null));
//   }
// };

const getAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.params;

    // Admin => get all appointments
    // Patient => get only own appointments
    const filters = req.user.role === "admin" ? {} : { patient: req.user._id };

    const appointments = await getPaginatedResults(Appointment, {
      page,
      limit,
      filters,
      populate: [
        {
          path: "doctor",
          select: "fname lname specialization",
        },
        {
          path: "patient",
          select: "fname lname email phone",
        },
      ],
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Appointments retrieved successfully",
          appointments,
        ),
      );
  } catch (error) {
    console.log("Appointment fetch error:", error);

    return res
      .status(500)
      .json(new ApiResponse(500, "Failed to retrieve appointments", null));
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      throw new ApiResponse(404, "Appointment not found");
    }

    /*
      PATIENT RULES
      - Patient can ONLY cancel
      - Patient can ONLY cancel own appointment
    */
    if (req.user.role === "patient") {
      // own appointment check
      if (appointment.patient.toString() !== req.user._id.toString()) {
        throw new ApiResponse(
          403,
          "You are not allowed to update this appointment",
        );
      }

      // only cancellation allowed
      if (status !== "cancelled") {
        throw new ApiResponse(403, "Patients can only cancel appointments");
      }
    }

    /*
      STATUS VALIDATION
    */
    const currentStatus = appointment.status;

    const allowedStatuses = VALID_STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedStatuses.includes(status)) {
      throw new ApiResponse(
        400,
        `Cannot change status from ${currentStatus} to ${status}`,
      );
    }

    /*
      UPDATE STATUS
    */
    appointment.status = status;

    await appointment.save();

    /*
      RELEASE SLOT IF CANCELLED
    */
    if (status === "cancelled") {
      await Schedule.updateOne(
        {
          _id: appointment.schedule,
          "slots._id": appointment.slotId,
        },
        {
          $set: {
            "slots.$.isBooked": false,
          },
        },
      );

      /*
        REALTIME SOCKET UPDATE
      */
      global.io.emit("slotAvailable", {
        scheduleId: appointment.schedule,
        slotId: appointment.slotId,
      });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Appointment status updated successfully",
          appointment,
        ),
      );
  } catch (error) {
    console.log("Update appointment error:", error);

    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          error.message || "Failed to update appointment status",
          null,
        ),
      );
  }
};

const getAppointmentById = async (req, res) => {
  try {
    console.log("try to fetch ", req.params.id);
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json(new ApiResponse("Appointment not found", 404));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, "Appointment retrieved successfully", appointment),
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(500, "Failed to retrieve doctor appointment", null),
      );
  }
};

module.exports = {
  bookAppointment, //for patients
  getAppointments, //for patients
  // getAppointments,
  getAppointmentById,
  updateAppointmentStatus, //for admin
};

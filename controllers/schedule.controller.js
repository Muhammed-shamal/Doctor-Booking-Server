const Schedule = require("../models/Schedule");
const ApiResponse = require("../utils/apiResponse");
const generateSlots = require("../utils/generateSlots");
const getPaginatedResults = require("../utils/getPaginatedResult");

const createSchedule = async (req, res) => {
  try {
    const { doctor, date, startTime, endTime, slotDuration } = req.body;

    const existingSchedule = await Schedule.findOne({
      doctor,
      date,
    });

    if (existingSchedule) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, "Schedule already exists for this date", null),
        );
    }

    const slots = generateSlots(startTime, endTime, slotDuration);

    const schedule = await Schedule.create({
      doctor,
      date,
      slotDuration,
      slots,
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, "Schedule created successfully", { schedule }),
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, "Failed to create schedule", null));
  }
};

const getDoctorSchedules = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const filters = { doctor: req.params.doctorId };

    const schedules = await getPaginatedResults(Schedule, {
      page,
      limit,
      filters,
      sort: { date: 1 },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Doctor schedules retrieved successfully",
          schedules,
        ),
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, "Failed to retrieve doctor schedules", null));
  }
};

module.exports = {
  createSchedule,
  getDoctorSchedules,
};

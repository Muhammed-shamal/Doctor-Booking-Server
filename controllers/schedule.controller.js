const Schedule = require("../models/Schedule");
const ApiResponse = require("../utils/apiResponse");
const generateSlots = require("../utils/generateSlots");
const getPaginatedResults = require("../utils/getPaginatedResult");

const createSchedule = async (req, res) => {
  try {
    const { doctor, date, startTime, endTime } = req.body;
    console.log("schedule data is", req.body);

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

    const slotDuration = Number(req.body.slotDuration);
    const slots = generateSlots(startTime, endTime, slotDuration);

    console.log('slots is',slots);

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
      populate: [{ path: "doctor", select: "fname lname" }],
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

const getScheduleById = async (req, res) => {
  try {
    
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json(new ApiResponse("Schedule not found", 404));
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Schedule retrieved successfully", schedule));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, "Failed to retrieve doctor schedule", null));
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { date, startTime, endTime, slotDuration } = req.body;

    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Schedule not found", null));
    }

    // regenerate slots if timing changed
    let slots = schedule.slots;

    if (startTime && endTime && slotDuration) {
      slots = generateSlots(startTime, endTime, slotDuration);
    }

    schedule.date = date || schedule.date;
    schedule.slotDuration = slotDuration || schedule.slotDuration;
    schedule.slots = slots;

    await schedule.save();

    res
      .status(200)
      .json(new ApiResponse(200, "Schedule updated successfully", schedule));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, "Failed to update schedule", null));
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Schedule not found", null));
    }

    await schedule.deleteOne();

    res.status(200).json(
      new ApiResponse(200, "Schedule deleted successfully", {
        id: req.params.id,
      }),
    );
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, "Failed to delete schedule", null));
  }
};

module.exports = {
  createSchedule,
  updateSchedule,
  getDoctorSchedules,
  getScheduleById,
  deleteSchedule,
};

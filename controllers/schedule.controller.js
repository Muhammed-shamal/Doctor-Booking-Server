const Schedule = require("../models/Schedule");
const generateSlots = require("../utils/generateSlots");

const createSchedule = async (
  req,
  res
) => {
  try {
    const {
      doctor,
      date,
      startTime,
      endTime,
      slotDuration
    } = req.body;

    const existingSchedule =
      await Schedule.findOne({
        doctor,
        date
      });

    if (existingSchedule) {
      return res.status(400).json({
        message:
          "Schedule already exists for this date"
      });
    }

    const slots = generateSlots(
      startTime,
      endTime,
      slotDuration
    );

    const schedule =
      await Schedule.create({
        doctor,
        date,
        slotDuration,
        slots
      });

    res.status(201).json({
      success: true,
      schedule
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getDoctorSchedules = async (
  req,
  res
) => {
  try {
    const schedules =
      await Schedule.find({
        doctor: req.params.doctorId
      }).sort({
        date: 1
      });

    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createSchedule,
  getDoctorSchedules
};
const Doctor = require("../models/Doctor");
const Schedule = require("../models/Schedule");
const ApiResponse = require("../utils/apiResponse");
const getPaginatedResults = require("../utils/getPaginatedResult");

const getDoctors = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      specialization,
      minFee,
      maxFee,
      minExperience,
      status,
    } = req.query;

    const filters = {};

    switch (status) {
      case "active":
        filters.isActive = true;
        break;
      case "inactive":
        filters.isActive = false;
        break;
      case "all":
      default:
        break;
    }

    /*
        specialization
      */

    if (specialization) {
      filters.specialization = specialization;
    }

    /*
        fee filtering
      */

    if (minFee || maxFee) {
      filters.consultationFee = {};

      if (minFee) {
        filters.consultationFee.$gte = Number(minFee);
      }

      if (maxFee) {
        filters.consultationFee.$lte = Number(maxFee);
      }
    }

    /*
        experience filtering
      */

    if (minExperience) {
      filters.experience = {
        $gte: Number(minExperience),
      };
    }

    const doctors = await getPaginatedResults(Doctor, {
      page,
      limit,
      search,
      searchFields: ["fname", "lname", "phone", "specialization"],
      filters,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Doctors retrieved successfully", doctors));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, "Failed to retrieve doctors", null));
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Doctor not found", null));
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Doctor retrieved successfully", doctor));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, "Failed to retrieve doctor", null));
  }
};

const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, "Doctor created successfully", { doctor }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Failed to create doctor", null));
  }
};

const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!doctor) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Doctor not found", null));
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Doctor updated successfully", { doctor }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Failed to update doctor", null));
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // check schedules exist for this doctor
    const existingSchedule = await Schedule.findOne({
      doctor: doctorId,
    });

    if (existingSchedule) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "Cannot delete doctor because schedules exist",
            null,
          ),
        );
    }

    const doctor = await Doctor.findByIdAndDelete(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Doctor not found", null));
    }

    res.status(200).json(
      new ApiResponse(200, "Doctor deleted successfully", {
        id: doctorId,
      }),
    );
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Failed to delete doctor", null));
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};

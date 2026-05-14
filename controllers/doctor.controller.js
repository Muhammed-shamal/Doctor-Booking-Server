const Doctor = require("../models/Doctor");
const ApiResponse = require("../utils/apiResponse");
const getPaginatedResults = require("../utils/getPaginatedResult");

const getDoctors = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      specialization
    } = req.query;

    const filters = {
      isActive: true
    };

    if (specialization) {
      filters.specialization = specialization;
    }

    const doctors = await getPaginatedResults(
      Doctor,
      {
        page,
        limit,
        search,
        searchFields: [
          "name",
          "specialization"
        ],
        filters
      }
    );

    res.status(200).json(
      new ApiResponse(200, "Doctors retrieved successfully", { doctors })
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, "Failed to retrieve doctors", null)
    );
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(
      req.params.id
    );

    if (!doctor) {
      return res.status(404).json(
        new ApiResponse(404, "Doctor not found", null)
      );
    }

    res.status(200).json(
      new ApiResponse(200, "Doctor retrieved successfully", { doctor })
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, "Failed to retrieve doctor", null)
    );
  }
};

const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);

    res.status(201).json(new ApiResponse(201, "Doctor created successfully", { doctor }));
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, "Failed to create doctor", null)
    );
  }
};

const updateDoctor = async (req, res) => {
  try {
    const doctor =
      await Doctor.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );

    if (!doctor) {
      return res.status(404).json(
        new ApiResponse(404, "Doctor not found", null)
      );
    }

    res.status(200).json(
      new ApiResponse(200, "Doctor updated successfully", { doctor })
    );
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Failed to update doctor", null));
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctor =
      await Doctor.findByIdAndDelete(
        req.params.id
      );

    if (!doctor) {
      return res.status(404).json(
        new ApiResponse(404, "Doctor not found", null)
      );
    }

    res.status(200).json(new ApiResponse(200, "Doctor deleted successfully", null));
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, "Failed to delete doctor", null)
    );
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};
const Doctor = require("../models/Doctor");
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

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(
      req.params.id
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found"
      });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);

    res.status(201).json({
      success: true,
      doctor
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
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
      return res.status(404).json({
        message: "Doctor not found"
      });
    }

    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctor =
      await Doctor.findByIdAndDelete(
        req.params.id
      );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};
const User = require("../models/User");
const ApiResponse = require("../utils/apiResponse");
const getPaginatedResults = require("../utils/getPaginatedResult");

const getPatients = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    console.log("req quer", req.query);

    const filters = { role: "patient" };

    const patients = await getPaginatedResults(User, {
      page,
      limit,
      search,
      searchFields: ["name", "phone", "email"],
      filters,
    });

    console.log('patients are',patients)
    res
      .status(200)
      .json(new ApiResponse(200, "Patients retrieved successfully", patients));
  } catch (error) {
    console.log('error patients',error)
    res
      .status(500)
      .json(new ApiResponse(500, "Failed to retrieve patients", null));
  }
};

module.exports = { getPatients };

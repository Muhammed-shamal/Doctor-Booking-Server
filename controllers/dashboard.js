const Appointment = require("../models/Appointment");

const Doctor = require("../models/Doctor");

const User = require("../models/User");

const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const getDashboardData = asyncHandler(async (req, res) => {
  /*
        role based dashboard
      */

  if (req.user.role === "admin") {
    return getAdminDashboard(req, res);
  }

  return getPatientDashboard(req, res);
});

const getPatientDashboard = async (req, res) => {
  const patientId = req.user._id;

  /*
      KPI COUNTS
    */

  const [
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    upcomingAppointments,
  ] = await Promise.all([
    Appointment.countDocuments({
      patient: patientId,
    }),

    Appointment.countDocuments({
      patient: patientId,
      status: "completed",
    }),

    Appointment.countDocuments({
      patient: patientId,
      status: "cancelled",
    }),

    Appointment.countDocuments({
      patient: patientId,

      appointmentDate: {
        $gte: new Date(),
      },
    }),
  ]);

  /*
      RECENT APPOINTMENTS
    */

  const recentAppointments = await Appointment.find({
    patient: patientId,
  })
    .populate("doctor", "fname lname specialization profileImage")
    .sort({
      createdAt: -1,
    })
    .limit(5);

  /*
      NEXT APPOINTMENT
    */

  const nextAppointment = await Appointment.findOne({
    patient: patientId,

    appointmentDate: {
      $gte: new Date(),
    },

    status: {
      $ne: "cancelled",
    },
  })
    .populate("doctor", "fname lname specialization profileImage")
    .sort({
      appointmentDate: 1,
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Patient dashboard fetched successfully",

      {
        kpis: {
          totalAppointments,

          completedAppointments,

          cancelledAppointments,

          upcomingAppointments,
        },

        recentAppointments,

        nextAppointment,
      },
    ),
  );
};

const getAdminDashboard = async (req, res) => {
  /*
      KPI COUNTS
    */

  const [
    totalDoctors,
    totalPatients,
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    todayAppointments,
  ] = await Promise.all([
    Doctor.countDocuments(),

    User.countDocuments({
      role: "patient",
    }),

    Appointment.countDocuments(),

    Appointment.countDocuments({
      status: "completed",
    }),

    Appointment.countDocuments({
      status: "cancelled",
    }),

    Appointment.countDocuments({
      appointmentDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    }),
  ]);

  /*
      RECENT APPOINTMENTS
    */

  const recentAppointments = await Appointment.find()
    .populate("doctor", "fname lname specialization")
    .populate("patient", "name email phone")
    .sort({
      createdAt: -1,
    })
    .limit(10);

  /*
      TOP DOCTORS
    */

  const topDoctors = await Appointment.aggregate([
    {
      $group: {
        _id: "$doctor",

        totalAppointments: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        totalAppointments: -1,
      },
    },

    {
      $limit: 5,
    },

    {
      $lookup: {
        from: "doctors",

        localField: "_id",

        foreignField: "_id",

        as: "doctor",
      },
    },

    {
      $unwind: "$doctor",
    },

    {
      $project: {
        _id: "$doctor._id",

        totalAppointments: 1,

        rating: {
          $ifNull: ["$doctor.rating", 0],
        },

        doctor: {
          _id: "$doctor._id",
          fname: "$doctor.fname",
          lname: "$doctor.lname",
          specialization: "$doctor.specialization",
          consultationFee: "$doctor.consultationFee",
          experience: "$doctor.experience",
          clinic_name: "$doctor.clinic_name",
          isActive: "$doctor.isActive",
          rating: {
            $ifNull: ["$doctor.rating", 0],
          },
        },
      },
    },
  ]);

  /*
      MONTHLY APPOINTMENT TREND
    */

  const appointmentTrends = await Appointment.aggregate([
    {
      $group: {
        _id: {
          month: {
            $month: "$appointmentDate",
          },
        },

        count: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        "_id.month": 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Admin dashboard fetched successfully",

      {
        kpis: {
          totalDoctors,

          totalPatients,

          totalAppointments,

          completedAppointments,

          cancelledAppointments,

          todayAppointments,
        },

        recentAppointments,

        topDoctors,

        appointmentTrends,
      },
    ),
  );
};

module.exports = { getDashboardData };

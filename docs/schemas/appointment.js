module.exports = {
  Appointment: {
    type: "object",

    properties: {
      _id: {
        type: "string"
      },

      patient: {
        $ref: "#/components/schemas/User"
      },

      doctor: {
        $ref: "#/components/schemas/Doctor"
      },

      schedule: {
        $ref: "#/components/schemas/Schedule"
      },

      slotId: {
        type: "string"
      },

      slotStartTime: {
        type: "string"
      },

      slotEndTime: {
        type: "string"
      },

      appointmentDate: {
        type: "string",
        format: "date"
      },

      status: {
        type: "string",

        enum: [
          "pending",
          "confirmed",
          "completed",
          "cancelled"
        ]
      }
    }
  },

  AppointmentInput: {
    type: "object",

    required: [
      "doctor",
      "schedule",
      "slotId",
      "appointmentDate"
    ],

    properties: {
      doctor: {
        type: "string"
      },

      schedule: {
        type: "string"
      },

      slotId: {
        type: "string"
      },

      appointmentDate: {
        type: "string",
        format: "date"
      }
    }
  }
};
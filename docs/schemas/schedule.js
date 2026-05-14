module.exports = {
  Slot: {
    type: "object",

    properties: {
      _id: {
        type: "string"
      },

      startTime: {
        type: "string",
        example: "09:00"
      },

      endTime: {
        type: "string",
        example: "09:30"
      },

      isBooked: {
        type: "boolean"
      }
    }
  },

  Schedule: {
    type: "object",

    properties: {
      _id: {
        type: "string"
      },

      doctor: {
        $ref: "#/components/schemas/Doctor"
      },

      date: {
        type: "string",
        format: "date"
      },

      slotDuration: {
        type: "number"
      },

      slots: {
        type: "array",

        items: {
          $ref: "#/components/schemas/Slot"
        }
      }
    }
  },

  ScheduleInput: {
    type: "object",

    required: ["doctor", "date", "slots"],

    properties: {
      doctor: {
        type: "string"
      },

      date: {
        type: "string",
        format: "date"
      },

      slotDuration: {
        type: "number"
      },

      slots: {
        type: "array",

        items: {
          type: "object",

          properties: {
            startTime: {
              type: "string"
            },

            endTime: {
              type: "string"
            }
          }
        }
      }
    }
  }
};
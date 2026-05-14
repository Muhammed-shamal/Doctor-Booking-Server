module.exports = {
  Doctor: {
    type: "object",

    properties: {
      _id: {
        type: "string"
      },

      name: {
        type: "string"
      },

      specialization: {
        type: "string"
      },

      experience: {
        type: "number"
      },

      consultationFee: {
        type: "number"
      },

      about: {
        type: "string"
      },

      profileImage: {
        type: "string"
      },

      isActive: {
        type: "boolean"
      },

      createdAt: {
        type: "string",
        format: "date-time"
      },

      updatedAt: {
        type: "string",
        format: "date-time"
      }
    }
  },

  DoctorInput: {
    type: "object",

    required: [
      "name",
      "specialization",
      "experience",
      "consultationFee"
    ],

    properties: {
      name: {
        type: "string"
      },

      specialization: {
        type: "string"
      },

      experience: {
        type: "number"
      },

      consultationFee: {
        type: "number"
      },

      about: {
        type: "string"
      },

      profileImage: {
        type: "string"
      },

      isActive: {
        type: "boolean"
      }
    }
  }
};
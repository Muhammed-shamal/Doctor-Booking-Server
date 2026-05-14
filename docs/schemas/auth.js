module.exports = {
  User: {
    type: "object",

    properties: {
      _id: {
        type: "string"
      },

      name: {
        type: "string"
      },

      email: {
        type: "string"
      },

      role: {
        type: "string",
        enum: ["patient", "admin"]
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

  RegisterInput: {
    type: "object",

    required: ["name", "email", "password"],

    properties: {
      name: {
        type: "string"
      },

      email: {
        type: "string"
      },

      password: {
        type: "string"
      }
    }
  },

  LoginInput: {
    type: "object",

    required: ["email", "password"],

    properties: {
      email: {
        type: "string"
      },

      password: {
        type: "string"
      }
    }
  }
};
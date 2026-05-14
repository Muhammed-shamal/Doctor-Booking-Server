const commonOptions = {
  //mongo
  mongoUrl:
    process.env.MONGO_URI ||
    "mongodb+srv://muhammedshamalpv:DrCRfVsndhGQuhMc@sargalayam2024.ltwwx.mongodb.net/",
  mongoDBName: process.env.DB_NAME || "DoctorBooking",

  //cors
  corsOptions: {
    normal: {
      origin: [
        "http://localhost:5174",
        "http://localhost:3000",
        "http://localhost:5173",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
    socket: {
      origin: [
        "http://localhost:5174",
        "http://localhost:3000",
        "http://localhost:5173",
      ],
      methods: ["GET", "POST", "PUT", "PATCH"],
      credentials: true,
    },
  },
};

module.exports = commonOptions;

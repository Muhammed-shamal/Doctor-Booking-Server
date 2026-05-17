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

  //others
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  company: {
    name: process.env.COMPANY_NAME || "Doctor Booking",
    phone: process.env.COMPANY_PHONE || "+91 8304912033",
    address:
      process.env.COMPANY_ADDRESS ||
      "Rumas Quarters Palottupalli Po Mattanur, Kannur District, Kerala- 670702",
    website: process.env.COMPANY_WEBSITE || "http://localhost:3000",
    email: process.env.COMPANY_MAIL || "muhammedshamalpv@gmail.com",
    password: process.env.COMPANY_MAIL_PASSWORD || "",
  },

  code: process.env.CODE || "QwertyuioP",
};

module.exports = commonOptions;

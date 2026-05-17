const mongoose = require("mongoose");
const commonOptions = require("./common");

const dns = require("node:dns/promises");

dns.setServers(["1.1.1.1", "1.0.0.1"]);


const connectDB = async () => {
  try {
    await mongoose.connect(commonOptions.mongoUrl, {
      dbName: commonOptions.mongoDBName,
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB Connection Error:", error.message);

    process.exit(1);
  }
};

module.exports = connectDB;

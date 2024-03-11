const { mongoose } = require("mongoose");


const databaseConnection = async () => {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("Database connected");
      })
      .catch((err) => {
        console.log("database connection failed. Server not started");
        console.error(err);
      });
  };
  
  module.exports = {
    databaseConnection,
  };
  
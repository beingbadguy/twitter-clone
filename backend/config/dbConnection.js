import mongoose from "mongoose";

const databaseConnection = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database connection established");
    })
    .catch((error) => {
      console.log("Database connection Failed");
      console.log(error.message);
      process.exit(1);
    });
};
export default databaseConnection;

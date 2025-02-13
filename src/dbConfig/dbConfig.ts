import mongoose from "mongoose";

export async function Connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Connected to the database");
    });
    connection.on("error", (err) => {
      console.log(err, "Error in connecting to the database");
      process.exit();
    });

    return connection;
  } catch (error) {
    console.log(error, "Somthing went wrong in connecting to the database");
  }
}

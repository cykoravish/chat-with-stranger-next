import mongoose from "mongoose";

// Define a connection object to track the connection state
type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Validate MongoDB URI
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
  }

  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    // Attempt to connect to the database with improved options
    const db = await mongoose.connect(process.env.MONGO_URI);

    // Save the connection state
    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);

    // Graceful exit in case of a connection error
    process.exit(1);
  }
}

export default dbConnect;

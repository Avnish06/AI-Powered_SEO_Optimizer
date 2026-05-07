const mongoose = require("mongoose");
require("dotenv").config();

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("Connected. Dropping phone_1 index from users collection...");
    // Access the raw collection to drop the index
    const collection = mongoose.connection.collection("users");
    
    await collection.dropIndex("phone_1");
    console.log("SUCCESS: Index phone_1 dropped!");
    
  } catch (error) {
    if (error.codeName === "IndexNotFound") {
      console.log("SUCCESS: The index phone_1 does not exist (already dropped).");
    } else {
      console.error("ERROR dropping index:", error);
    }
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();

// models/database.js
const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let databaseConnection = null;

async function db() {
  try {
    if (!databaseConnection) {
      await client.connect();
      databaseConnection = client.db("tmdt");
      console.log("✅ Kết nối thành công đến MongoDB");
    }
    return databaseConnection;
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error);
    throw error;
  }
}

// Export both db and ObjectId
module.exports = { db, ObjectId };
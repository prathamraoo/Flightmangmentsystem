import mongoose from "mongoose";
const mongo_url = 'mongodb://127.0.0.1:27017/airport'
// const mongo_url = 'mongodb://localhost:27017/airport'
// install mongoes in terminal (npm install mongoose)
// connection string for connect server & database
// connection string + datbase name (path from mongodb /diploma) doesn't give space instead give  _ -

// for exception handling try catch use  try excute code ctach for error
// async is used for feature time,await async use madidre awit use madbodu
// 

const mongoConnection = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongo_url, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log("database connected successfully");
  } catch (error) {
    console.error("error in connecting database:", error.message);
  }
}
export default mongoConnection;
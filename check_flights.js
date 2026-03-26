
import mongoose from "mongoose";
import Flight from "./models/flightModel.js";

const mongo_url = 'mongodb://127.0.0.1:27017/airport';

const check = async () => {
    await mongoose.connect(mongo_url);
    const count = await Flight.countDocuments({ source: /Bangalore/i, destination: /Kolkata/i });
    console.log(`FOUND ${count} FLIGHTS FOR BANGALORE -> KOLKATA`);
    mongoose.connection.close();
}
check();

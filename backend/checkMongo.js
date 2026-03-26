import mongoose from 'mongoose';

const urls = [
  'mongodb://127.0.0.1:27017/airport',
  'mongodb://localhost:27017/airport',
  'mongodb+srv://Pratham:pratham10@cluster0.ddpiwtz.mongodb.net/airport'
];

async function test() {
  console.log("Starting Mongo Diagnostics...");
  for (const url of urls) {
    try {
      console.log(`\nTesting: ${url}`);
      // Use shorter timeout to avoid hanging indefinitely
      await mongoose.connect(url, { 
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000 
      });
      console.log(`SUCCESS! Connected to: ${url}`);
      
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log("Collections present:", collections.map(c => c.name).join(", "));
      
      const count = await mongoose.connection.db.collection('flights').countDocuments();
      console.log(`Current flight count: ${count}`);
      
      await mongoose.disconnect();
      console.log("Disconnected successfully.");
    } catch (e) {
      console.log(`FAILED ${url}: ${e.message}`);
    }
  }
  process.exit(0);
}

test().catch(err => {
  console.error("DIAGNOSTIC ERROR:", err);
  process.exit(1);
});

import mongoose from 'mongoose';

const mongo_url = 'mongodb+srv://Pratham:pratham10@cluster0.ddpiwtz.mongodb.net/airport';

async function check() {
    try {
        console.log('Connecting to:', mongo_url);
        await mongoose.connect(mongo_url, { serverSelectionTimeoutMS: 10000 });
        console.log('CONNECTED');
        
        // Check if collection exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('COLLECTIONS:', collections.map(c => c.name));

        const count = await mongoose.connection.db.collection('flights').countDocuments();
        console.log('FLIGHTS IN DB:', count);
        
        const sample = await mongoose.connection.db.collection('flights').findOne({ source: /Chennai/i });
        console.log('SAMPLE CHENNAI:', sample ? sample.airline + " " + sample.source + " -> " + sample.destination : 'NONE');
        
        await mongoose.disconnect();
    } catch (e) {
        console.error('ERROR:', e.message);
    }
}
check();

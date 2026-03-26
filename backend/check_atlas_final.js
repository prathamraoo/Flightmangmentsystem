import mongoose from 'mongoose';
import fs from 'fs';

const mongo_url = 'mongodb+srv://Pratham:pratham10@cluster0.ddpiwtz.mongodb.net/airport';

async function run() {
    let log = '';
    try {
        log += 'Connecting...\n';
        await mongoose.connect(mongo_url);
        log += 'CONNECTED\n';
        
        const count = await mongoose.connection.db.collection('flights').countDocuments();
        log += 'TOTAL FLIGHTS: ' + count + '\n';
        
        const allFlights = await mongoose.connection.db.collection('flights').find({}).toArray();
        allFlights.forEach(f => {
            log += `FLIGHT: ${f.airline} | ${f.source} -> ${f.destination} (${f.category})\n`;
        });
        
        fs.writeFileSync('db_check_results.txt', log);
        process.exit(0);
    } catch (e) {
        fs.writeFileSync('db_check_results.txt', 'ERROR: ' + e.message);
        process.exit(1);
    }
}
run();

import axios from 'axios';

async function check() {
  try {
    console.log("Checking backend at http://localhost:8000/flights...");
    const res = await axios.get("http://localhost:8000/flights", { timeout: 5000 });
    console.log("SUCCESS!");
    console.log("Success:", res.data.success);
    console.log("Flights found:", res.data.flights?.length || 0);
    if (res.data.flights?.length > 0) {
       console.log("First flight details:", JSON.stringify(res.data.flights[0], null, 2));
    }
  } catch (e) {
    console.log("FAILED to reach backend:", e.message);
  }
}

check();

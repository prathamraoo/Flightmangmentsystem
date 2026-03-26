import Flight from "../models/flightModel.js";
import mongoose from "mongoose";

// USER + ADMIN - GET FLIGHTS
export const getFlights = async (req, res) => {
  try {
    const { category, from, to, date } = req.query;
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (from) {
      query['source'] = { $regex: from, $options: 'i' };
    }
    if (to) {
      query['destination'] = { $regex: to, $options: 'i' };
    }
    const flights = await Flight.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      flights
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error fetching flights"
    });
  }
};

// ADMIN - CREATE FLIGHT
export const createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.json({
      success: true,
      flight
    });
  } catch (error) {
    console.error("Flight creation error:", error);
    res.json({
      success: false,
      message: "Flight creation failed: " + error.message
    });
  }
};

// ADMIN - UPDATE FLIGHT
export const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({
      success: true,
      flight
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Flight update failed"
    });
  }
};

// ADMIN - DELETE FLIGHT
export const deleteFlight = async (req, res) => {
  try {
    await Flight.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Flight deleted"
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Flight delete failed"
    });
  }
};

// INTERNAL - SEED DATABASE (Temporary)
export const seedInternal = async (req, res) => {
  console.log("Internal Seeding Triggered");
  const flights = [
    {
      airline: "Emirates", price: 125000, duration: "14h 20m", availableSeats: 12, category: "premium",
      image: "https://images.unsplash.com/photo-1540339832862-47452993c66e?w=1200",
      details: ["Private Suite", "Shower Spa", "Onboard Bar", "In-flight Wi-Fi"],
      source: "Dubai", destination: "New York", departureTime: "10:30 AM", arrivalTime: "04:50 PM"
    },
    {
      airline: "Singapore Airlines", price: 138000, duration: "12h 45m", availableSeats: 8, category: "premium",
      image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1200",
      details: ["Double Bed", "Chef on Board", "Kris World Entertainment", "Sliding Door Suite"],
      source: "Singapore", destination: "London", departureTime: "11:15 PM", arrivalTime: "05:40 AM"
    },
    {
      airline: "Qatar Airways", price: 115000, duration: "15h 30m", availableSeats: 24, category: "premium",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200",
      details: ["Qsuite", "Dine on Demand", "Oryx One", "White Linen Service"],
      source: "Doha", destination: "Paris", departureTime: "08:20 AM", arrivalTime: "02:15 PM"
    },
    {
      airline: "Etihad Airways", price: 155000, duration: "13h 15m", availableSeats: 4, category: "premium",
      image: "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=1200",
      details: ["The Residence", "In-flight Chef", "Acqua di Parma", "Three-room Suite"],
      source: "Abu Dhabi", destination: "Sydney", departureTime: "10:00 PM", arrivalTime: "06:15 PM"
    },
    {
      airline: "Lufthansa", price: 320000, duration: "12h 10m", availableSeats: 8, category: "premium",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1080&q=80",
      details: ["First Class Terminal", "Fine Dining", "Caviar Service"],
      source: "Frankfurt", destination: "Tokyo", departureTime: "01:20 PM", arrivalTime: "08:45 AM"
    },
    {
      airline: "Vistara", price: 42000, duration: "2h 30m", availableSeats: 32, category: "premium",
      image: "https://images.unsplash.com/photo-1542296332-2e44a0b1e3d9?w=1080&q=80",
      details: ["Flat-bed Seats", "Gourmet Meals", "Priority Boarding", "Extra Baggage"],
      source: "Delhi", destination: "Bangalore", departureTime: "09:00 AM", arrivalTime: "11:30 AM"
    },
    {
      airline: "British Airways", price: 395000, duration: "21h 30m", availableSeats: 16, category: "premium",
      image: "https://images.unsplash.com/photo-1506973035872-a4e98f018306?w=1080&q=80",
      details: ["Flat-bed", "Do & Co Catering", "Elemis Amenity Kit", "Club Lounge Access"],
      source: "London", destination: "Sydney", departureTime: "04:10 PM", arrivalTime: "07:25 PM"
    },
    {
      airline: "Air France", price: 490000, duration: "8h 25m", availableSeats: 4, category: "premium",
      image: "https://images.unsplash.com/photo-1502602898657-3e907a5ea82c?w=1080&q=80",
      details: ["Private Suite", "Haute Cuisine", "Champagne Bar", "Mattress & Duvet"],
      source: "Paris", destination: "New York", departureTime: "10:15 AM", arrivalTime: "12:40 PM"
    },
    {
      airline: "ANA All Nippon", price: 355000, duration: "10h 50m", availableSeats: 8, category: "premium",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1080&q=80",
      details: ["Enclosed Suite", "Roll-away Bed", "Japanese Cuisine", "Meditation Pillow"],
      source: "Tokyo", destination: "Los Angeles", departureTime: "09:40 PM", arrivalTime: "03:30 PM"
    },
    {
      airline: "IndiGo", price: 18500, duration: "1h 40m", availableSeats: 40, category: "premium",
      image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1080&q=80",
      details: ["Extra Legroom", "Priority Check-in", "Hot Meals", "Fast-track Security"],
      source: "Mumbai", destination: "Hyderabad", departureTime: "06:15 AM", arrivalTime: "07:55 AM"
    },
    {
      airline: "SpiceJet", price: 14000, duration: "2h 15m", availableSeats: 28, category: "premium",
      image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=1080&q=80",
      details: ["Exit Row Seats", "Hot Meals", "Extra Snacks", "Early Boarding"],
      source: "Bangalore", destination: "Kolkata", departureTime: "04:30 PM", arrivalTime: "06:45 PM"
    },
    {
      airline: "Turkish Airlines", price: 115000, duration: "6h 20m", availableSeats: 20, category: "premium",
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=1080&q=80",
      details: ["Flying Chef", "Flat-bed", "Sleeping Kit", "Business Lounge"],
      source: "Istanbul", destination: "Bangalore", departureTime: "01:20 PM", arrivalTime: "07:40 PM"
    },
    {
      airline: "Swiss International", price: 105000, duration: "10h 10m", availableSeats: 8, category: "premium",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200",
      details: ["Swiss First Lounge", "Gourmet Meals", "Zimmerli Toiletries"],
      source: "Zurich", destination: "Hong Kong", departureTime: "10:50 PM", arrivalTime: "04:30 PM"
    },
    {
      airline: "Korean Air", price: 98000, duration: "14h 40m", availableSeats: 8, category: "premium",
      image: "https://images.unsplash.com/photo-1520437358207-324028664ecb?w=1200",
      details: ["Kosmo Suite 2.0", "Precious Moment", "Luxury Bedding"],
      source: "Seoul", destination: "London", departureTime: "01:20 PM", arrivalTime: "05:30 PM"
    },
    {
      airline: "Virgin Atlantic", price: 92000, duration: "8h 30m", availableSeats: 10, category: "premium",
      image: "https://images.unsplash.com/photo-1490443946066-6b22f2cb8cc1?w=1200",
      details: ["Upper Class Wing", "The Loft", "Cocktails Board"],
      source: "London", destination: "Dubai", departureTime: "10:15 PM", arrivalTime: "08:45 AM"
    },
    {
      airline: "Air India", price: 4500, duration: "2h 30m", availableSeats: 156, category: "business",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
      details: ["Free Meals", "Extra Legroom", "Priority Boarding"],
      source: "Delhi", destination: "Mumbai", departureTime: "07:00 AM", arrivalTime: "09:30 AM"
    },
    {
      airline: "IndiGo", price: 3900, duration: "2h 15m", availableSeats: 180, category: "economy",
      image: "https://images.unsplash.com/photo-1559628238-6a3d6cf7e497?w=800&q=80",
      details: ["On-time Guarantee", "Web Check-in", "Affordable Fares"],
      source: "Mumbai", destination: "Bangalore", departureTime: "02:45 PM", arrivalTime: "05:00 PM"
    },
    {
      airline: "SpiceJet", price: 4200, duration: "2h 25m", availableSeats: 189, category: "economy",
      image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&q=80",
      details: ["SpiceMax Available", "Hot Meals", "Extra Baggage"],
      source: "Delhi", destination: "Kolkata", departureTime: "06:20 PM", arrivalTime: "08:45 PM"
    },
    {
      airline: "Vistara", price: 4700, duration: "2h 20m", availableSeats: 168, category: "business",
      image: "https://images.unsplash.com/photo-1542296332-2e44a0b1e3d9?w=800&q=80",
      details: ["Premium Service", "Complimentary Food", "Lounge Access"],
      source: "Delhi", destination: "Bangalore", departureTime: "09:00 AM", arrivalTime: "11:20 AM"
    }
  ];

  try {
    if (mongoose.connection.readyState !== 1) {
       throw new Error("Database not connected");
    }
    await Flight.deleteMany({});
    await Flight.insertMany(flights);
    res.json({ success: true, message: `Seeded ${flights.length} flights successfully.` });
  } catch (error) {
    console.error("Internal Seeding Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
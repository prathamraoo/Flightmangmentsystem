import Seat from '../models/seatModel.js';
import Flight from '../models/flightModel.js';

// Generate seats for a flight
export const generateSeatsForFlight = async (flightId, cabinClass = 'Economy') => {
  try {
    // Check if seats already exist for this flight
    const existingSeats = await Seat.find({ flightId });
    if (existingSeats.length > 0) {
      return existingSeats;
    }

    // Get flight details
    const flight = await Flight.findById(flightId);
    if (!flight) {
      throw new Error('Flight not found');
    }

    // Generate seat layout based on cabin class
    const rows = cabinClass === 'Business' ? 8 : 12;
    const seatsPerRow = cabinClass === 'Business' ? 4 : 6;
    const basePrice = flight.price || 4500;
    const multiplier = cabinClass === 'Business' ? 1.8 : cabinClass === 'First' ? 2.5 : 1;

    const seats = [];
    
    for (let row = 1; row <= rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatNumber = `${row}${String.fromCharCode(64 + seat)}`;
        const price = Math.round(basePrice * multiplier);
        
        seats.push({
          flightId,
          seatNumber,
          row,
          position: seat,
          cabinClass,
          price,
          isBooked: Math.random() < 0.2, // 20% seats already booked
        });
      }
    }

    // Insert all seats
    const createdSeats = await Seat.insertMany(seats);
    return createdSeats;
  } catch (error) {
    throw new Error(`Failed to generate seats: ${error.message}`);
  }
};

// Get seats for a flight
export const getFlightSeats = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { cabinClass = 'Economy' } = req.query;

    // Generate seats if they don't exist
    const seats = await generateSeatsForFlight(flightId, cabinClass);

    res.json({ success: true, seats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Book seats
export const bookSeats = async (req, res) => {
  try {
    const { seatIds, bookingId } = req.body;

    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Seat IDs are required' });
    }

    // Check if seats are available
    const seats = await Seat.find({ _id: { $in: seatIds } });
    
    const unavailableSeats = seats.filter(seat => seat.isBooked);
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Some seats are already booked',
        unavailableSeats: unavailableSeats.map(s => s.seatNumber)
      });
    }

    // Update seats as booked
    const updatedSeats = await Seat.updateMany(
      { _id: { $in: seatIds } },
      { 
        isBooked: true, 
        bookingId,
        updatedAt: new Date()
      }
    );

    res.json({ 
      success: true, 
      message: 'Seats booked successfully',
      bookedCount: updatedSeats.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Release seats (when booking is cancelled)
export const releaseSeats = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const result = await Seat.updateMany(
      { bookingId },
      { 
        isBooked: false, 
        bookingId: null,
        updatedAt: new Date()
      }
    );

    res.json({ 
      success: true, 
      message: 'Seats released successfully',
      releasedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get seat availability statistics
export const getSeatStats = async (req, res) => {
  try {
    const { flightId } = req.params;

    const stats = await Seat.aggregate([
      { $match: { flightId: new mongoose.Types.ObjectId(flightId) } },
      {
        $group: {
          _id: '$cabinClass',
          totalSeats: { $sum: 1 },
          bookedSeats: { $sum: { $cond: ['$isBooked', 1, 0] } },
          availableSeats: { $sum: { $cond: ['$isBooked', 0, 1] } }
        }
      }
    ]);

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

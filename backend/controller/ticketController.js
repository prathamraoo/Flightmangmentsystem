import Ticket from "../models/ticketModel.js";
import Booking from "../models/bookingModel.js";


// USER - GET TICKET
export const getTicket = async (req,res)=>{

 try{

   const booking = await Booking.findById(req.params.id);

   if(!booking){
     return res.json({
       success:false,
       message:"Booking not found"
     });
   }

   let ticket = await Ticket.findOne({
     bookingId: booking._id
   });

   if(!ticket){

     ticket = await Ticket.create({
       bookingId: booking._id,
       user: "Passenger",
       airport: booking.airport,
       flight: booking.flight,
       price: booking.price
     });

   }

   res.json({
     success:true,
     ticket
   });

 }catch(error){

   console.log(error);

   res.json({
     success:false,
     message:"Server Error"
   });

 }

};



// USER - GET ALL TICKETS FOR USER
export const getUserTickets = async (req,res)=>{

 try{

   // Find all bookings for this user
   const userBookings = await Booking.find({ userId: req.user.id });

   if(!userBookings || userBookings.length === 0){
     return res.json({
       success:true,
       tickets: []
     });
   }

   // Get booking IDs
   const bookingIds = userBookings.map(booking => booking._id);

   // Find all tickets for these bookings
   const tickets = await Ticket.find({
     bookingId: { $in: bookingIds }
   }).populate("bookingId");

   // If no tickets exist yet, create them
   if(tickets.length === 0){
     const newTickets = [];
     for(const booking of userBookings){
       const ticket = await Ticket.create({
         bookingId: booking._id,
         user: req.user.name || "Passenger",
         airport: booking.airport,
         flight: booking.flight,
         price: booking.price,
         status: "Confirmed"
       });
       newTickets.push(ticket);
     }
     return res.json({
       success:true,
       tickets: newTickets
     });
   }

   res.json({
     success:true,
     tickets
   });

 }catch(error){

   console.log(error);

   res.json({
     success:false,
     message:"Error fetching user tickets"
   });

 }

};
export const getAllTickets = async (req,res)=>{

 try{

   const tickets = await Ticket.find()
     .populate("bookingId");

   res.json({
     success:true,
     tickets
   });

 }catch(error){

   res.json({
     success:false,
     message:"Error fetching tickets"
   });

 }

};



// ADMIN - DELETE TICKET
export const deleteTicket = async (req,res)=>{

 try{

   await Ticket.findByIdAndDelete(req.params.id);

   res.json({
     success:true,
     message:"Ticket deleted"
   });

 }catch(error){

   res.json({
     success:false
   });

 }

};
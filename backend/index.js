import express from 'express'
import mongoConnection from './Db.js'
import userRoutes from "./routes/userRoutes.js"
import studentRoutes from "./routes/studentRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import cors from 'cors'
import ticketRoutes from "./routes/ticketRoutes.js";
import postRoutes from './routes/postRoutes.js'
import airportRoutes from "./routes/airportRoutes.js";
import flightRoutes from "./routes/flightRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";

//to connect backend with front end we use cors

const app = express()
app.use(express.json())
// mildware for frontend
// means bridge
mongoConnection()

app.use(cors())

const PORT = 8000

// test api(optional)
app.get("/test",(req, res)=>{
     res.send("Hi iam backend!")
})

app.use("/users",userRoutes)
app.use("/students",studentRoutes)
app.use("/auth",authRoutes)
app.use('/post',postRoutes)
app.use("/airports", airportRoutes);
app.use("/flights",flightRoutes)
app.use("/bookings", bookingRoutes);
app.use("/payments",paymentRoutes)
app.use("/tickets", ticketRoutes);
app.use("/reviews", reviewRoutes);
app.use("/seats", seatRoutes);

app.listen(PORT, ()=>{
    console.log("Hi !,Iam Backend running on "+PORT)
})

// call
// mildware 
// means bridge
// app.use path filename



// http://localhost:8000/users/addUser complete api  base path till port no ,mildware,routing path  endpoint
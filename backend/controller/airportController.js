import Airport from "../models/airportModel.js";


// GET ALL AIRPORTS (User + Admin)
export const getAirports = async (req, res) => {

  try {

    const airports = await Airport.find();

    res.json({
      success: true,
      airports
    });

  } catch (error) {

    res.json({
      success: false,
      message: "Error fetching airports"
    });

  }

};



// ADMIN - CREATE AIRPORT
export const createAirport = async (req, res) => {

  try {

    const { name, code, image } = req.body;

    const airport = await Airport.create({
      name,
      code,
      image
    });

    res.json({
      success: true,
      airport
    });

  } catch (error) {

    res.json({
      success: false,
      message: "Airport creation failed"
    });

  }

};



// ADMIN - UPDATE AIRPORT
export const updateAirport = async (req, res) => {

  try {

    const airport = await Airport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      airport
    });

  } catch (error) {

    res.json({
      success: false,
      message: "Airport update failed"
    });

  }

};



// ADMIN - DELETE AIRPORT
export const deleteAirport = async (req, res) => {

  try {

    await Airport.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Airport deleted"
    });

  } catch (error) {

    res.json({
      success: false,
      message: "Airport delete failed"
    });

  }

};
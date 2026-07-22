import Client from "../models/Client.js";


export const createClient = async (req, res) => {
  try {
    
    const client = await Client.create(req.body);

    // Send success response
    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {
    
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
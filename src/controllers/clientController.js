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


export const getClients = async (req, res) => {
  try {
    // Fetch all clients from MongoDB
    const clients = await Client.find();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};
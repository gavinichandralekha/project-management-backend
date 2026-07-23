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
    
    const clients = await Client.find();

    
    res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};


export const getClientById = async (req, res) => {
  try {
    
    const { id } = req.params;

    
    const client = await Client.findById(id);

    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    
    res.status(200).json({
      success: true,
      message: "Client fetched successfully",
      data: client,
    });
  } catch (error) {
  
    res.status(500).json({
      success: false,
      message: "Failed to fetch client",
      error: error.message,
    });
  }
};


export const updateClient = async (req, res) => {
  try {
    
    const { id } = req.params;

    
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    
    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    
    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient,
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to update client",
      error: error.message,
    });
  }
};
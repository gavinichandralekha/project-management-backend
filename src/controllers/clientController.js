import Client from "../models/Client.js";


export const createClient = async (req, res) => {
  try {
    
    const client = await Client.create(req.body);

    
    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {

  
  if (error.code === 11000) {

    const field = Object.keys(error.keyValue)[0];

    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });

  }

  
  if (error.name === "ValidationError") {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

 
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}

}


export const getClients = async (req, res) => {
  try {
    
    const search = req.query.search || "";

   
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    
    const skip = (page - 1) * limit;

    
    const searchFilter = {
      $or: [
        { companyName: { $regex: search, $options: "i" } },
        { companyCode: { $regex: search, $options: "i" } },
        { industry: { $regex: search, $options: "i" } },
        { subscriptionPlan: { $regex: search, $options: "i" } },
        { contactEmail: { $regex: search, $options: "i" } },
      ],
    };

    
    const filter = search ? searchFilter : {};

    
    const totalClients = await Client.countDocuments(filter);

    
    const clients = await Client.find(filter)
      .skip(skip)
      .limit(limit);

    
    const totalPages = Math.ceil(totalClients / limit);

    
    res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
      currentPage: page,
      totalPages,
      totalClients,
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


export const deleteClient = async (req, res) => {
  try {
    
    const { id } = req.params;

    
    const deletedClient = await Client.findByIdAndDelete(id);

    
    if (!deletedClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    
    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
      data: deletedClient,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to delete client",
      error: error.message,
    });
  }
};
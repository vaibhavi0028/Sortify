import AdminLoginModel from '../models/AdminLoginModel.js';
import ServiceModel from '../models/serviceModel.js'; // Ensure this import is correct
import SubAdminLoginModel from '../models/SubAdminLoginModel.js';
import OnProcessModel from '../models/OnProcessModel.js';

// To raise the service complaint
const userService = async (req, res) => {
    try {
      const {
        regNo, name, phoneNumber, roomNumber, hostelType, block,
        scheduleFrom, scheduleTo, serviceType, description
      } = req.body;
  
      // Validate required fields (excluding 'description' which is optional)
      if (!regNo || !name || !phoneNumber || !roomNumber || !hostelType || !block ||
          !scheduleFrom || !scheduleTo || !serviceType) {
        return res.status(400).json({ success: false, message: "All fields except 'description' are required" });
      }
  
      // Create requestId from regNo + block + hostelType
      const requestId = `${regNo}-${block}-${hostelType}`;
  
      // Create a new service request
      const newService = new ServiceModel({
        requestId, regNo, name, phoneNumber, roomNumber, hostelType, block,
        scheduleFrom, scheduleTo, serviceType, status: 'pending', description
      });
  
      // Save the service request to the database
      const savedService = await newService.save();
      res.status(201).json({ success: true, data: savedService });
    } catch (error) {
      console.error("Error in userService:", error);
      res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

// To list all service complaints
const listServices = async (req, res) => {
    try {
        const services = await ServiceModel.find();
        if (services.length === 0) {
            return res.status(404).json({ success: false, message: "No services found" });
        }
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        console.error("Error in listServices:", error);
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

// To delete a service complaint by ID
const deleteService = async (req, res) => {
    try {
        const { requestId } = req.body; // Adjusting to use requestId instead of id

        if (!requestId) {
            return res.status(400).json({ success: false, message: "requestId is required" });
        }

        const deletedService = await ServiceModel.findOneAndDelete({ requestId });
        if (!deletedService) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.status(200).json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
        console.error("Error in deleteService:", error);
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

// To add a new admin
const addAdmin = async (req, res) => {
    try {
        const admin = new AdminLoginModel(req.body);
        await admin.save();
        res.status(201).json({ message: 'Admin created successfully', admin });
    } catch (error) {
        console.error("Error in addAdmin:", error);
        res.status(400).json({ error: error.message });
    }
};

// To list all admins
const listAdmins = async (req, res) => {
    try {
        const admins = await AdminLoginModel.find();
        res.status(200).json(admins);
    } catch (error) {
        console.error("Error in listAdmins:", error);
        res.status(500).json({ error: error.message });
    }
};

// To delete an admin by ID
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.body; // Get ID from request body
        const admin = await AdminLoginModel.findByIdAndDelete(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error("Error in deleteAdmin:", error);
        res.status(500).json({ error: error.message });
    }
};

// Sub-admin functions

// To add a new sub-admin
const addSubAdmin = async (req, res) => {
    try {
        const subAdmin = new SubAdminLoginModel(req.body);
        await subAdmin.save();
        res.status(201).json({ message: 'Sub-admin created successfully', subAdmin });
    } catch (error) {
        console.error("Error in addSubAdmin:", error);
        res.status(400).json({ error: error.message });
    }
};

// To list all sub-admins
const listSubAdmins = async (req, res) => {
    try {
        const subAdmins = await SubAdminLoginModel.find();
        res.status(200).json(subAdmins);
    } catch (error) {
        console.error("Error in listSubAdmins:", error);
        res.status(500).json({ error: error.message });
    }
};

// To delete a sub-admin by ID
const deleteSubAdmin = async (req, res) => {
    try {
        const { id } = req.body; // Get ID from request body
        const subAdmin = await SubAdminLoginModel.findByIdAndDelete(id);
        if (!subAdmin) {
            return res.status(404).json({ message: 'Sub-admin not found' });
        }
        res.status(200).json({ message: 'Sub-admin deleted successfully' });
    } catch (error) {
        console.error("Error in deleteSubAdmin:", error);
        res.status(500).json({ error: error.message });
    }
};

//onPRrocess
// Add OnProcess
const addOnProcess = async (req, res) => {
    const { requestId, roomNumber, regNo, phoneNumber, status, comment } = req.body;

    const newOnProcess = new OnProcessModel({
        requestId,
        roomNumber,
        regNo,
        phoneNumber,
        servicePhoneNumber: '123456789', // Default value
        serviceId: '1234', // Default value
        status,
        comment,
    });

    try {
        const savedOnProcess = await newOnProcess.save();
        res.status(201).json(savedOnProcess);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// List OnProcesses
const listOnProcesses = async (req, res) => {
    try {
        const onProcesses = await OnProcessModel.find();
        res.status(200).json({ success: true, data: onProcesses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove OnProcess
const deleteOnProcess = async (req, res) => {
    const { requestId } = req.body;
  
    try {
      const deletedOnProcess = await OnProcessModel.findOneAndDelete({ requestId });
      if (!deletedOnProcess) {
        return res.status(404).json({ message: 'OnProcess not found' });
      }
      res.status(200).json({ message: 'OnProcess deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const completeOnProcess = async (req, res) => {
    const { id, comment } = req.body;

    try {
        // Update the OnProcess
        const updatedProcess = await OnProcessModel.findByIdAndUpdate(
            id,
            { completed: true, comment },
            { new: true }
        );

        // If no comment was added, delete the process
        if (!comment) {
            await OnProcessModel.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Process completed and deleted due to no comment' });
        }

        res.status(200).json(updatedProcess);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Export all functions
export { 
    userService, 
    listServices, 
    deleteService, 
    addAdmin, 
    listAdmins, 
    deleteAdmin, 
    addSubAdmin, 
    listSubAdmins, 
    deleteSubAdmin,
    addOnProcess, 
    listOnProcesses,
    deleteOnProcess,
    completeOnProcess
};

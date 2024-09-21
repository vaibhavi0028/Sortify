import express from "express";
import { 
    userService, 
    listServices, 
    deleteService, 
    addAdmin, 
    listAdmins, 
    deleteAdmin, 
    addSubAdmin, 
    listSubAdmins, 
    deleteSubAdmin,
    addOnProcess,      // Importing the new controller functions
    listOnProcesses,
    deleteOnProcess,
    completeOnProcess
} from '../controllers/ServiceController.js';

const serviceRouter = express.Router();

// Service complaint
serviceRouter.post("/services/raise", userService);
serviceRouter.get("/services/list", listServices);
serviceRouter.post('/services/remove', deleteService); // Changed to POST

// Admin
serviceRouter.post('/admin/create', addAdmin);
serviceRouter.get('/admin/list', listAdmins);
serviceRouter.post('/admin/remove', deleteAdmin); // Changed to POST

// Sub-admin
serviceRouter.post('/subadmins/add', addSubAdmin);
serviceRouter.get('/subadmins/list', listSubAdmins);
serviceRouter.post('/subadmins/remove', deleteSubAdmin); // Changed to POST

// OnProcess
serviceRouter.post('/onprocess/add', addOnProcess);       // Add OnProcess
serviceRouter.get('/onprocess/list', listOnProcesses);    // List OnProcesses
serviceRouter.post('/onprocess/remove', deleteOnProcess);  // Remove OnProcess
serviceRouter.post('/onprocess/complete', completeOnProcess);

export default serviceRouter;

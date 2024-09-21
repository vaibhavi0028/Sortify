// backend/models/SubAdminLoginModel.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const subAdminLoginSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true, // Ensures employee ID is unique
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensures username is unique
  },
  password: {
    type: String,
    required: true,
  },
  hostelType: {
    type: String,
    required: true, // New field for hostel type
  },
  hostel: {
    type: String,
    required: true, // New field for hostel
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  gmail: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, // Validates that the email is a Gmail address
  },
});

const SubAdminLoginModel = mongoose.model('SubAdminLogin', subAdminLoginSchema);
export default SubAdminLoginModel;

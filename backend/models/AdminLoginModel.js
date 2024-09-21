import mongoose from 'mongoose';
const { Schema } = mongoose;

const adminLoginSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  hostelType: {
    type: String,
    required: true, // New field for hostel type
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

const AdminLoginModel = mongoose.model('AdminLogin', adminLoginSchema);
export default AdminLoginModel;

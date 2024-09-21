import mongoose from 'mongoose';
// Define the schema for OnProcess
const OnProcessSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  regNo: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  servicePhoneNumber: {
    type: String,
    required: true
  },
  serviceId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    required: true
  },
  onProcess: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  comment: {
    type: String,
    default: ''
  }
});

// Create the model using the schema
const OnProcessModel = mongoose.model('OnProcess', OnProcessSchema);

export default OnProcessModel;

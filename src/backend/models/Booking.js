const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  storageId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StorageProvider',
    required: true 
  },
  providerName: { type: String, required: true },
  location: { type: String, required: true },
  bookedCapacity: { type: Number, required: true },
  ratePerKgPerDay: { type: Number, required: true },
  amenities: { type: [String], default: [] },
  contactNumber: { type: String },
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
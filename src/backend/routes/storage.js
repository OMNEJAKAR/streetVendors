const express = require("express");
const StorageProvider = require("../models/StorageProvider");
const Booking = require("../models/Booking"); // Add this line
const router = express.Router();

// GET /api/storage
router.get("/", async (req, res) => {
  try {
    const providers = await StorageProvider.find({ isActive: true });
    res.json({
      success: true,
      data: providers
    });
  } catch (err) {
    console.error("Error fetching storage:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// POST /api/book-storage
// Add this to your existing storage routes
router.post("/book-storage", async (req, res) => {
  try {
    const { storageId, bookedCapacity, contactNumber } = req.body;
    
    // Validate input
    if (!storageId || !bookedCapacity || isNaN(bookedCapacity) || bookedCapacity <= 0) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid booking data" 
      });
    }

    const provider = await StorageProvider.findById(storageId);
    if (!provider) {
      return res.status(404).json({ 
        success: false,
        message: "Storage provider not found" 
      });
    }

    if (provider.availableCapacity < bookedCapacity) {
      return res.status(400).json({ 
        success: false,
        message: `Only ${provider.availableCapacity} kg available`,
        availableCapacity: provider.availableCapacity
      });
    }

    // Update provider capacity
    provider.availableCapacity -= bookedCapacity;
    await provider.save();

    // Create and save booking
    const booking = new Booking({
      storageId: provider._id,
      providerName: provider.name,
      location: provider.location,
      bookedCapacity: Number(bookedCapacity),
      ratePerKgPerDay: provider.ratePerKgPerDay,
      amenities: provider.amenities,
      contactNumber: contactNumber || provider.contact
    });
    
    await booking.save();

    res.json({
      success: true,
      message: `Booked ${bookedCapacity} kg successfully`,
      booking: {
        id: booking._id,
        providerName: booking.providerName,
        location: booking.location,
        bookedCapacity: booking.bookedCapacity,
        ratePerKgPerDay: booking.ratePerKgPerDay,
        dailyCost: (booking.bookedCapacity * booking.ratePerKgPerDay).toFixed(2),
        bookingDate: booking.bookingDate,
        amenities: booking.amenities
      }
    });

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error during booking",
      error: err.message 
    });
  }
});

// GET /api/bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
    res.json({
      success: true,
      data: bookings.map(booking => ({
        id: booking._id,
        providerName: booking.providerName,
        location: booking.location,
        bookedCapacity: booking.bookedCapacity,
        ratePerKgPerDay: booking.ratePerKgPerDay,
        dailyCost: (booking.bookedCapacity * booking.ratePerKgPerDay).toFixed(2),
        bookingDate: booking.bookingDate,
        amenities: booking.amenities
      }))
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings"
    });
  }
});

module.exports = router;
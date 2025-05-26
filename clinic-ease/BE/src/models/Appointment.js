const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: {
    type: String, // e.g. '2025-04-25'
    required: true,
  },
  slot: {
    type: String, // e.g. 'morning-9.5'
    required: true,
  },
  seat: {
    type: Number, // 1 or 2
    required: true,
  },
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent booking same seat in the same slot and date
appointmentSchema.index({ date: 1, slot: 1, seat: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

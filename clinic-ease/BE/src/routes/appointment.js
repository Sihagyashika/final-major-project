const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const dayjs = require('dayjs');

const validSlots = generateValidSlots();

function generateValidSlots() {
  const slots = [];
  const addSlots = (start, end) => {
    for (let hour = start; hour < end; hour++) {
      for (let i = 0; i < 2; i++) {
        const minute = i * 30; // 0 or 30
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
  };
  addSlots(9, 12); // Morning
  addSlots(17, 20); // Evening
  return slots;
}


router.post('/', async (req, res) => {
  try {
    const { date, slot, seat, name } = req.body;

    if (!['today', 'tomorrow'].includes(date) || !slot || !seat) {
      return res.status(400).json({ error: 'Missing booking data.' });
    }

    const today = new Date();
    const targetDate = new Date(today);
    if (date === 'tomorrow') targetDate.setDate(today.getDate() + 1);

    const formattedDate = targetDate.toISOString().split('T')[0];

    const existing = await Appointment.findOne({ date: formattedDate, slot, seat });
    if (existing) {
      return res.status(400).json({ error: 'That seat is already booked.' });
    }

    const newAppt = new Appointment({
      date: formattedDate,
      slot,
      seat,
      name
    });

    await newAppt.save();
    return res.status(201).json({ message: 'Appointment booked successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});




// Utility to generate all possible slots
const generateSlots = () => {
  const slots = [];
  for (let h = 9; h < 12; h++) slots.push(`morning-${h}`);
  for (let h = 17; h < 20; h++) slots.push(`evening-${h}`);
  return slots;
};

router.get('/availability', async (req, res) => {
  const slots = generateSlots(); // e.g., ["morning-9.0", "morning-9.75", ...]
  const today = dayjs().startOf('day');
  const tomorrow = today.add(1, 'day');

  const appointments = await Appointment.find({
    date: { $in: [today.format('YYYY-MM-DD'), tomorrow.format('YYYY-MM-DD')] }
  });

  const result = {
    [today.format('YYYY-MM-DD')]: {},
    [tomorrow.format('YYYY-MM-DD')]: {}
  };

  for (let day of [today, tomorrow]) {
    const dateStr = day.format('YYYY-MM-DD');
    slots.forEach(slot => {
      result[dateStr][slot] = [true, true];
    });
  }

  appointments.forEach(appt => {
    if (result[appt.date] && result[appt.date][appt.slot]) {
      result[appt.date][appt.slot][appt.seat - 1] = false;
    }
  });

  res.json(result);
});


module.exports = router;

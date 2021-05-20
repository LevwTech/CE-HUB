const mongoose = require('mongoose');
const { Schema } = mongoose;

const slots = new Schema({
  day: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },

  group: {
    type: String,
    required: true,
  },

  timetable: [{
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    joinLink: {
      type: String,
    }
  }]
});

const Slot = mongoose.model('Slot', slots);
module.exports = Slot;
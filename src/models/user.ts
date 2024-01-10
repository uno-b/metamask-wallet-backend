const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  address: {
    type: String,
    trim: true,
    required: [true, 'A user must have an address'],
    unique: true,
  },
  email: { type: String, max: [50, 'An email must not be too long'] },
  phoneNumber: {
    type: Number,
    validate: {
      validator: function (val: number) {
        return val.toString().length === 8;
      },
      message: 'Number has to be 8 digits',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// Export the model
module.exports = mongoose.model('User', UserSchema);

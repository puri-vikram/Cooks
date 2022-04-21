const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const userSchema = new mongoose.Schema({
  firstname: { type: String, default: null },
  lastname: { type: String, default: null },
  email: { type: String, unique: true },
  is_admin: { type: Number, default: 0 },
  password: { type: String },
  reset_password_code: { type: String , default: null},
  token: { type: String },
  pictures: { type: String, default: null },
  about_me: { type: String, default: null },
  country: { type: String, default: null },
  state: { type: String, default: null },
  city: { type: String, default: null },
  zipcode: { type: String, default: null },
  address: { type: String, default: null },
  is_verify: { type: Boolean, default: false },
  lat: { type: String, default: null },
  lng: { type: String, default: null },
  auto_location: { type: String, default: null },
  location: {
    type: pointSchema
  },
});

userSchema.virtual('unreadCount', {
    ref: 'message',
    localField: '_id',
    foreignField: 'user_id',
    count: true
})
userSchema.virtual('lastMessage', {
    ref: 'message',
    localField: '_id',
    foreignField: 'user_id',
    //count: true
})

module.exports = mongoose.model("user", userSchema);
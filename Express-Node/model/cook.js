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

const cookSchema = new mongoose.Schema({
  firstname: { type: String, default: null },
  lastname: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  reset_password_code: { type: String , default: null},
  token: { type: String },
  hourly_rate: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  presentation: { type: Number, default: 0 },
  taste: { type: Number, default: 0 },
  punctuality: { type: Number, default: 0 },
  cleanliness: { type: Number, default: 0 }, 
  value: { type: Number, default: 0 },
  about_me: { type: String, default: null },
  country: { type: String, default: null },
  state: { type: String, default: null },
  city: { type: String, default: null },
  zipcode: { type: String, default: null },
  address: { type: String, default: null },
  pictures: { type: String, default: null },
  cover: { type: String, default: null },
  is_verify: { type: Boolean, default: false },
  lat: { type: String, default: null },
  lng: { type: String, default: null },
  profession: { type: String, default: null },
  languages: { type: Array, default: [] },
  speciality: { type: Array, default: [] },
  dietary_preference: { type: Array, default: [] },
  meal_type: { type: Array, default: [] },
  cuisine_preference: { type: Array, default: [] },
  location: {
    type: pointSchema
  },
  auto_location: { type: String, default: null },
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null },
});

cookSchema.index({ "location": "2dsphere" });

cookSchema.virtual('unreadCount', {
    ref: 'message',
    localField: '_id',
    foreignField: 'cook_id',
    count: true
})

cookSchema.virtual('lastMessage', {
    ref: 'message',
    localField: '_id',
    foreignField: 'cook_id',
    //count: true
})

cookSchema.virtual('reviewCount', { 
    ref: 'review',
    localField: '_id',
    foreignField: 'cook_id',
    count: true
})

module.exports = mongoose.model("cook", cookSchema);
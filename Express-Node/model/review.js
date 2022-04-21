const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  cook_comment: { type: String },
  rate: { type: Number },
  communication: { type: Number },
  presentation: { type: Number },
  taste: { type: Number },
  punctuality: { type: Number },
  cleanliness: { type: Number },
  value: { type: Number },
  cook_id: { type: Schema.Types.ObjectId, ref: 'Cook' },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: null },
  cook_comment_at: { type: Date, default: null },
  updated_at: { type: Date, default: null },
});

reviewSchema.virtual('user', {
    ref: 'user',
    localField: 'user_id',
    foreignField: '_id'
})

reviewSchema.virtual('cook', {
    ref: 'cook',
    localField: 'cook_id',
    foreignField: '_id'
})
module.exports = mongoose.model("review", reviewSchema);
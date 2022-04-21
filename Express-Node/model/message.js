const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
  message: { type: String, default: null },
  cook_id: { type: Schema.Types.ObjectId, ref: 'Cook' },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  is_read : { type: Boolean, default: false },
  from: { type: String, default: null },
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null },
});

messageSchema.virtual('userCount', { 
    ref: 'user',
    localField: '_id',
    foreignField: 'user_id',
    count: true
})

module.exports = mongoose.model("message", messageSchema);
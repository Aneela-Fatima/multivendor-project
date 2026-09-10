const mongoose = require("mongoose");

const coupounCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your coupoun code product name!"],
    unique: true,
  },
  value: {
    type: Number,
    required: true,
  },
  minAmount:{
    type: Number,
  },
  maxAmount:{
    type: Number,
  },
  shop:{
    type: Object,
    required: true,
  },
  selectedProduct:{
    type: String,
    
  },
  createdAt: {
    type: Date,
    dafault: Date.now(),
  },
});

module.exports = mongoose.model("CoupounCode", coupounCodeSchema);

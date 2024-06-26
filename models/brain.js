// models/brain.js

const mongoose = require('mongoose');

const brainSchema = new mongoose.Schema({
  name: String,
  isBilateral : Boolean,
  lobe: { 
    type: String, 
    enum: ['frontal', 'parietal', 'temporal', 'occipital'] 
  }
  
});

const Brain = mongoose.model("Brain", brainSchema); // create model

module.exports = Brain;

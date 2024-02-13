const mongoose = require("mongoose")
let Schema = mongoose.Schema

const service = new Schema({
  nom: {
    type: String
  },
  description: {
    type : String
  },
  prix: {
    type: Number
  },
  duree_minute: {
    type: Number
  },
  commission: {
    type: Number
  }
});

module.exports = mongoose.model("service",service,"service")
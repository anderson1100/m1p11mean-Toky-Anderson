const mongoose = require("mongoose")
let Schema = mongoose.Schema

const transaction = new Schema({
  rendez_vous_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  montant: {
    type: Number
  },
  date: {
    type: Date
  },
  status: {
    type: Boolean
  }
});

module.exports = mongoose.model("transaction",transaction,"transaction")
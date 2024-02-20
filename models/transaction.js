const mongoose = require("mongoose")
let Schema = mongoose.Schema

const transaction = new Schema({
  rendez_vous_id: {
    type: Schema.Types.ObjectId,
    ref : "rendez_vous",
    required: true
  },
  montant: {
    type: Number
  },
  num_carte_credit : {
    type : Number
  },
  nom : {
    type : String
  },
  date: {
    type: Date
  },
  status: {
    type: Boolean
  }
});

module.exports = mongoose.model("transaction",transaction,"transaction")
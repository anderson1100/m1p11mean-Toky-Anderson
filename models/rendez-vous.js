const mongoose = require("mongoose")
let Schema = mongoose.Schema

const rendezVous = new Schema({
  client_id: {
    type: Schema.Types.ObjectId,
    ref: "account",
    required: true
  },
  employe_id: {
    type: Schema.Types.ObjectId,
    ref: "account",
    required: true
  },
  service_id: {
    type: Schema.Types.ObjectId,
    ref: "service",
    required: true
  },
  date_heure: {
    type: Date
  },
  completion: {
    type: Boolean
  },
  paiement:{
    type: Boolean
  }
});


module.exports = mongoose.model("rendez_vous",rendezVous,"rendez_vous")
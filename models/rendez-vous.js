const mongoose = require("mongoose")
let Schema = mongoose.Schema

const rendezVous = new Schema({
  client_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  employe_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  service_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  date_heure: {
    type: Date
  },
  completion: {
    type: Boolean
  }
});


module.exports = mongoose.model("rendez_vous",rendezVous)
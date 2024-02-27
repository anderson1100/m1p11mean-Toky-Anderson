const mongoose = require("mongoose")
let Schema = mongoose.Schema

const categorie = new Schema({
  nom: {
    type: String
  },
  description: {
    type : String
  }
});

const service = new Schema({
  nom: {
    type: String
  },
  description: {
    type : String
  },
  image : {
    type : String
  },
  categorie: categorie,
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
  services: [service],
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
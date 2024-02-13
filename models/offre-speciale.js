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

const offre_speciale = new Schema({
  nom: {
    type: String
  },
  description: {
    type: String
  },
  liste_service: [service],
  reduction: {
    type: Number
  },
  date_debut: {
    type: Date
  },
  date_fin: {
    type: Date
  }
});

module.exports = mongoose.model("offre_speciale",offre_speciale,"offre_sepciale")
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

module.exports = mongoose.model("categorie",categorie,"categorie")
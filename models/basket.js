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

const basket = new Schema({
  client_id: {
    type: Schema.Types.ObjectId,
    ref: "account",
    required: true
  },
  services: {
    type : [service],
    default: []
  }
});


module.exports = mongoose.model("basket",basket,"basket")
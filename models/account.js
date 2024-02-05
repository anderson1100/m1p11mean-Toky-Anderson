const mongoose = require("mongoose")

const bcrypt = require("bcrypt")
let Schema = mongoose.Schema

// const role = new Schema({
//   role: {
//     type : String
//   }
// })

const account = new Schema({
    nom: {
      type: String
    },
    prenom: {
      type: String
    },
    email: {
      type: String
    },
    username: {
      type: String
    },
    password: {
      type: String
    },
    employe_fav: [],
    service_fav: [],
    heure_debut: {
      type: Date
    },
    heure_fin: {
      type: Date
    },
    role: {
      type: String
    }
});

account.pre('save', async function (next){
  try{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
    console.log(this.email, this.password)
  } catch (error){
    next(error)
  }
})

account.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}

module.exports = mongoose.model("account",account,"account")
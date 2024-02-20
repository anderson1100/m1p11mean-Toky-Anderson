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
  photo : {
    type : String
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

// account.pre('save', async function (next) {
//   try {
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(this.password, salt)
//     this.password = hashedPassword
//     next()
//     console.log(this.email, this.password)
//   } catch (error) {
//     next(error)
//   }
// })

account.methods.bcryptPassword = async function() {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    //console.log(this.email, this.password)
  } catch (error) {
    throw error
  }
}

account.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}

account.methods.isInWorkTime = function (dateToCheck, duration) {
  if (isNaN(dateToCheck)) {
    throw new Error("Invalid date format");
  }
  console.log('dateToCheck',dateToCheck);

  if (!this.heure_debut || !this.heure_fin) {
    throw new Error("Working hours are not defined");
  }
  
  const hourToCheck = dateToCheck.getHours();
  const minuteToCheck = dateToCheck.getMinutes();

  const heureDebutHour = this.heure_debut.getHours();
  const heureDebutMinute = this.heure_debut.getMinutes();
  const heureFinHour = this.heure_fin.getHours();
  const heureFinMinute = this.heure_fin.getMinutes();

  const heureDebutTotalMinutes = heureDebutHour * 60 + heureDebutMinute;
  const heureFinTotalMinutes = heureFinHour * 60 + heureFinMinute;

  const timeToCheckTotalMinutes = hourToCheck * 60 + minuteToCheck;

  return timeToCheckTotalMinutes >= heureDebutTotalMinutes &&
    timeToCheckTotalMinutes + duration <= heureFinTotalMinutes;


};

module.exports = mongoose.model("account", account, "account")
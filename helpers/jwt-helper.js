const JWT = require('jsonwebtoken')
const createError = require('http-errors')
require('dotenv').config()
const mongoose = require("mongoose")
let refreshTokenModel = require("../models/refresh-token")

module.exports = {
  signAccessToken: (user) => {
    return new Promise((resolve, reject) => {
      const payload = {
        "nom" : user.nom,
        "prenom" : user.prenom,
        "email" : user.email,
        "role" : user.role
      }
      //verify reserved jwt claims (role maybe : solution if true solution userInfo : {wawa : "fdf", role : "fjdkf"})
      const secret = process.env.ACCESS_TOKEN_SECRET
      const options = {
        expiresIn: '10s',
        issuer: 'm1p10project.com',
        audience: user.id,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
          return
        }
        resolve(token)
      })
    })
  },
  
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.REFRESH_TOKEN_SECRET
      const options = {
        expiresIn: '1d',
        issuer: 'm1p10project.com',
        audience: userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          // reject(err)
          reject(createError.InternalServerError())
        }

        let rtk = new refreshTokenModel({value : token, user_id : userId})
        rtk.save();

        resolve(token)
      })
    })
  },
  
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, payload) => {
          if (err){
            if(err.name === 'TokenExpiredError'){
              console.log("refresh token expired")
              const result = await refreshTokenModel.deleteOne({value : refreshToken})
            }
            return reject(createError.Forbidden())
          }
          console.log(payload)
          const userId = payload.aud

          const rf = await refreshTokenModel.findOne({ user_id: userId })
          if (!rf) reject(createError.InternalServerError())
          if(refreshToken === rf.value) return resolve(userId)
          console.log("not the same refreshToken");
          reject(createError.Forbidden())
        }
      )
    })
  },
}

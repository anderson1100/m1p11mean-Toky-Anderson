const createError = require('http-errors')
const account = require('../models/account')
const refreshTokenModel = require('../models/refresh-token')
const basketModel = require('../models/basket')

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../helpers/jwt-helper')

const { userCredentialsSchema } = require('../helpers/validation')
const JWT = require('jsonwebtoken')



const signup = async (req, res, next) => {

  //to do later : verify if role in list role in env

  try {
    let { userInfo, role } = req.body;
    const validationResult = await userCredentialsSchema.validateAsync(userInfo);

    let user = new account(validationResult)

    const doesExist = await account.findOne({
      $or: [
        { $and: [{ email: validationResult.email }, { role: role }] },
        { $and: [{ username: validationResult.username }, { role: role }] }
      ]
    })

    //console.log(doesExist)

    if (doesExist)
      throw createError.Conflict('email/username already been registered')

    user.role = role;

    // if ('heure_debut' in user) { //and heure_fin
    //   user.heure_debut = new Date(user.heure_debut);
    //   user.heure_fin = new Date(user.heure_fin);
    // }
    await user.bcryptPassword();
    const savedUser = await user.save()
    const accessToken = await signAccessToken(savedUser)
    const refreshToken = await signRefreshToken(savedUser.id)

    if (savedUser.role === "client") {
      let basket = new basketModel({client_id : savedUser._id});
      await basket.save();
    }

    res.status(201);
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
    res.cookie('jwtAccess', accessToken, { httpOnly: false, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
    res.json({ message: "ok" })
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

const login = async (req, res, next) => {
  console.log("calling login")
  try {
    //console.log(req.body.userInfo.login,req.body.role)
    const user = await account.findOne({
      $or: [
        { $and: [{ email: req.body.userInfo.login }, { role: req.body.role }] },
        { $and: [{ username: req.body.userInfo.login }, { role: req.body.role }] }
      ]
    })

    if (!user) throw createError.NotFound('User not registered')

    const isMatch = await user.isValidPassword(req.body.userInfo.password)

    if (!isMatch)
      throw createError.Unauthorized('Username/password not valid')

    //delete last refreshToken
    await refreshTokenModel.deleteOne({ user_id: user.id });

    const accessToken = await signAccessToken(user)
    const refreshToken = await signRefreshToken(user.id)

    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 }) //secure : true is required for chrome . Verify if it is needed for postman also (for thunder client it needs to be set to false)
    res.cookie('jwtAccess', accessToken, { httpOnly: false, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
    res.json({ message: "ok" })

  } catch (error) {
    next(error)
  }
}

const verifyToken = (role) => {
  return async (req, res, next) => {

    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(403);
    // authHeader = req.headers.authorization || req.headers.Authorization
    // if (!authHeader?.startsWith("Bearer ")) return next(createError.Forbidden())
    //const bearerToken = authHeader.split(' ')
    //const token = bearerToken[1]
    if (!cookies?.jwtAccess) return next(createError.Forbidden())
    //console.log("AccessToken",cookies.jwtAccess);
    const token = cookies.jwtAccess;
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        console.log("access token error . Now refresh token")
        return refreshToken(req, res, next); //invalid token
      }
      if (role !== payload.role) {
        console.log("route not for this role")
        return res.sendStatus(403); //unauthorized access
      }
      //req.user = payload.username
      next()
    })
  }
}


const refreshToken = async (req, res, next) => {
  console.log("calling refreshToken")
  try {
    const cookies = req.cookies
    console.log("1")
    if (!cookies?.jwt) return res.sendStatus(403);
    console.log("2")
    const refreshToken = cookies.jwt
    console.log("3")
    const userId = await verifyRefreshToken(refreshToken)
    console.log("4")
    const user = await account.findOne({ _id: userId })
    console.log("5")
    const accessToken = await signAccessToken(user)
    console.log("6")
    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
    res.cookie('jwtAccess', accessToken, { httpOnly: false, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
    next()
  } catch (error) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.clearCookie('jwtAccess', { httpOnly: false, sameSite: 'None', secure: true });
    next(error)
  }
}

const logout = async (req, res, next) => {
  //could not get response when client with different cookie(not valid anymore is trying to access logout
  try {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204);
    if (!cookies?.jwtAccess) return res.sendStatus(204);
    //if (!refreshToken) throw createError.BadRequest()
    const refreshToken = cookies.jwt
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.clearCookie('jwtAccess', { httpOnly: false, sameSite: 'None', secure: true });
    const userId = await verifyRefreshToken(refreshToken)
    //console.log("userId",userId);
    //refreshTokenModel.deleteOne({user_id : userId});
    const result = await refreshTokenModel.deleteOne({ user_id: userId });
    //console.log(result); 
    res.sendStatus(204);
  } catch (error) {
    next(error)
  }
}

module.exports = { signup, login, verifyToken, refreshToken, logout }
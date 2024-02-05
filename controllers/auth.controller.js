const createError = require('http-errors')
const account = require('../models/account')
const refreshTokenModel = require('../models/refresh-token')

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../helpers/jwt-helper')

const {userCredentialsSchema} = require('../helpers/validation')
const JWT = require('jsonwebtoken')


module.exports = {
  signup: async (req, res, next) => {
    
    //to do later : verify if role in list role in env

    try {
      
      let {userInfo, role} = req.body;
      const validationResult = await userCredentialsSchema.validateAsync(userInfo);

      let user = new account(validationResult)

      const doesExist = await account.findOne({
        $or: [
          { $and: [{ email: validationResult.email }, { role: role }] },
          { $and: [{ username: validationResult.username }, { role: role }] }
        ]
      })

      console.log(doesExist)

      if (doesExist)
        throw createError.Conflict('email/username already been registered')

      user.role = role;

      const savedUser = await user.save()
      console.log(savedUser);
      const accessToken = await signAccessToken(savedUser)
      const refreshToken = await signRefreshToken(savedUser.id)
      res.status(201);
      res.cookie('jwt',refreshToken,{httpOnly : true, sameSite: 'None', secure : true, maxAge : 24*60*60*1000})
      res.json({accessToken})
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      //const validationResult = await userCredentialsSchema.validateAsync(req.body)
      console.log(req.body.userInfo.login,req.body.role)
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

      const accessToken = await signAccessToken(user)
      const refreshToken = await signRefreshToken(user.id)
      
      res.cookie('jwt',refreshToken,{httpOnly : true, secure : true,sameSite: 'none', maxAge : 24*60*60*1000}) //secure : true is required for chrome . Verify if it is needed for postman also (for thunder client it needs to be set to false)
      res.json({accessToken})

    } catch (error) {
      next(error)
    }
  },

  verifyToken : (role) => {
    return async (req, res, next) => {
      
      //verify if there still is a refresh token (after logout case : no more access)
      const cookies = req.cookies
      if (!cookies?.jwt) return res.sendStatus(403);

      authHeader = req.headers.authorization || req.headers.Authorization
      if (!authHeader?.startsWith("Bearer ")) return next(createError.Forbidden())
      const bearerToken = authHeader.split(' ')
      const token = bearerToken[1]
      JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
          return res.sendStatus(401); //invalid token
        }
        if (role !== payload.role){
          return res.sendStatus(403); //unauthorized access
        }
        //req.user = payload.username
        next()
      })
    }
  },
  

  refreshToken: async (req, res, next) => {
    try {
      const cookies = req.cookies
      if (!cookies?.jwt) return res.sendStatus(403);
      //if (!refreshToken) throw createError.BadRequest()
      //add 
      const refreshToken = cookies.jwt
      const userId = await verifyRefreshToken(refreshToken)
      //logout(delete refreshToken in database if refreshtoken not valid anymore)

      const user = await account.findOne({ _id : userId })

      const accessToken = await signAccessToken(user)
      //const refToken = await signRefreshToken(userId)

      res.cookie('jwt',refreshToken,{httpOnly : true, secure : true,sameSite: 'None', maxAge : 24*60*60*1000})
      res.json({accessToken}); 
    } catch (error) {
      res.clearCookie('jwt', {httpOnly: true,sameSite: 'None', secure : true});
      next(error)
    }
  },

  logout: async (req, res, next) => {
    try {
      const cookies = req.cookies
      if (!cookies?.jwt) return res.sendStatus(204);
      //if (!refreshToken) throw createError.BadRequest()
      const refreshToken = cookies.jwt
      res.clearCookie('jwt', {httpOnly: true,sameSite: 'None', secure : true});
      const userId = await verifyRefreshToken(refreshToken)
      console.log("userId",userId);
      //refreshTokenModel.deleteOne({user_id : userId});
      const result = await refreshTokenModel.deleteOne({ user_id: userId });
      console.log(result); 
      res.sendStatus(204);
    } catch (error) {
      next(error)
    }
  }

}
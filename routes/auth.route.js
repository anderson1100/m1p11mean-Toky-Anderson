var express = require('express');
var router = express.Router();
const AuthController = require('../controllers/auth.controller')
const managerRouter = require('./manager.route')
const employeRouter = require('./employe.route')
const clientRouter = require('./client.route')


// router.use("/manager/:route", (req, res, next) => {
//     const excludedRoutes = ['signup', 'login'];
//     if (!excludedRoutes.includes(req.params.route)) {
//       return AuthController.verifyToken("manager")(req, res, next);
//     }
//     next();
// });

// router.use("/employe/:route", (req, res, next) => {
//     const excludedRoutes = ['signup', 'login'];
//     if (!excludedRoutes.includes(req.params.route)) {
//       return AuthController.verifyToken("employe")(req, res, next);
//     }
//     next();
// });

router.get('/logout',AuthController.logout)
router.get('/refresh',AuthController.refreshToken)
router.use("/manager/",managerRouter);
router.use("/employe/",employeRouter);
router.use("/client/",clientRouter);

module.exports = router;

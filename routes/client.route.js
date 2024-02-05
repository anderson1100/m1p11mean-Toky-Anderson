var express = require('express');
var router = express.Router();
const {signup,login,verifyToken} = require('../controllers/auth.controller')


router.use("/:ressource?", (req, res, next) => {
  const excludedRoutes = ['signup', 'login'];
  // Check if req.params.ressource is undefined or not in excludedRoutes
  if (!excludedRoutes.includes(req.params.ressource || '')) {
    return verifyToken("client")(req, res, next);
  }
  next();
});

//test
router.get('/', async (req, res, next) => {
    res.json({"message" : "client route ok"});
  }
);

router.post('/signup',async(req, res, next)=>{
  req.body.role = "client";
  signup(res, req, next);
})

router.post('/login',async(req, res, next)=>{
  req.body.role = "client";
  login(req, res, next);
})

module.exports = router;

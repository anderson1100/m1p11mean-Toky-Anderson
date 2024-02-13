var express = require('express');
var router = express.Router();
const {signup,login,verifyToken} = require('../controllers/auth.controller')


router.use("/:ressource?", (req, res, next) => {
  const excludedRoutes = ['signup', 'login'];
  if (!excludedRoutes.includes(req.params.ressource || '')) {
    return verifyToken("employe")(req, res, next);
  }
  next();
});

//test 
router.get('/', async (req, res, next) => {
    res.json({"message" : "employe route ok"});
  }
);

router.post('/signup',async(req, res, next)=>{
  req.body.role = "employe";
  signup(req, res, next);
})

router.post('/login',async(req, res, next)=>{
  req.body.role = "employe";
  login(req, res, next);
})

module.exports = router;

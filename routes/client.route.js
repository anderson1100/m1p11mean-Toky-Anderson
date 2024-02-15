var express = require('express');
var router = express.Router();
const {signup,login,verifyToken} = require('../controllers/auth.controller')
const clientController = require('../controllers/client.controller');


router.use("/:ressource?", (req, res, next) => {
  const excludedRoutes = ['signup', 'login'];
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

router.get('/service/:id',clientController.getService);

router.get('/employes',clientController.getEmployes);

router.post('/appointment',clientController.appointment);

router.get('/service_simple_search',clientController.serviceSimpleSearch);

router.post('/signup',async(req, res, next)=>{
  req.body.role = "client";

  signup(res, req, next);
})

router.post('/login',async(req, res, next)=>{
  req.body.role = "client";
  login(req, res, next);
})

module.exports = router;

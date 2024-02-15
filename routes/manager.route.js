var express = require('express');
var router = express.Router();
const {signup,login,verifyToken} = require('../controllers/auth.controller');
const managerController = require('../controllers/manager.controller');


router.use("/:ressource?", (req, res, next) => {
  const excludedRoutes = ['signup', 'login'];
  if (!excludedRoutes.includes(req.params.ressource || '')) {
    return verifyToken("manager")(req, res, next);
  }
  next();
});


//test 
router.get('/', async (req, res, next) => {
    res.json({"message" : "manager route ok"});
  }
);

router.post('/signup',async(req, res, next)=>{
  req.body.role = "manager";
  signup(req, res, next);
})

router.post('/login',async(req, res, next)=>{
  req.body.role = "manager";
  login(req, res, next);
})

//CRUD SERVICES
router.get('/services',managerController.getServicesByPage)

router.post('/services',managerController.addService)

router.delete('/services/:id',managerController.deleteService)

router.put('/services/:id',managerController.updateService)

//CRUD EMPLOYES
router.get('/employes',managerController.getEmployesByPage)

router.post('/employes',managerController.addEmploye)

router.delete('/employes/:id',managerController.deleteEmploye);

router.put('/employes/:id',managerController.updateEmploye)


module.exports = router;

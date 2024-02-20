var express = require('express');
var router = express.Router();
const {signup,login,verifyToken} = require('../controllers/auth.controller')
const employeController = require('../controllers/employe.controller');


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

// router.post('/signup',async(req, res, next)=>{
//   req.body.role = "employe";
//   signup(req, res, next);
// })

router.post('/login',async(req, res, next)=>{
  req.body.role = "employe";
  login(req, res, next);
})

router.get('/profil',employeController.getEmploye);

router.get('/list_rdv_finished_today',employeController.getListRdvFinishedToday);

router.get('/rdv_history',employeController.getListRdvByPage);

router.post('/complete_rdv/:id',employeController.completeRdv);

router.get('/total_commission_today',employeController.getTotalCommissionToday);

module.exports = router;

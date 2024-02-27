var express = require('express');
var router = express.Router();
const {signup,login,verifyToken} = require('../controllers/auth.controller');
const managerController = require('../controllers/manager.controller');
const multer = require('multer');

//add conflict verification (file already exists)
const storage = multer.diskStorage({
  destination : function (req, file, cb) {
    cb(null,'public/images')
  },
  filename : function (req, file, cb) {
    cb(null,file.originalname)
  }
})

const upload = multer({storage : storage})

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

//STATS 
router.post('/total_benef_month',managerController.getBeneficeMonth);

router.get('/temps_travail_moyen_by_employe',managerController.tempsTravailMoyenByEmploye);

router.get('/count_rdv_by_day_for_month',managerController.countRdvByDayForMonth);

router.get('/chiffre_affaire_by_day_for_month',managerController.chiffreAffaireByDayForMonth);

//CRUD SERVICES
router.get('/services',managerController.getServices)

router.post('/services',upload.single('image'),managerController.addService)

router.delete('/services/:id',managerController.deleteService)

router.put('/services/:id',managerController.updateService)

//CRUD EMPLOYES
router.get('/employes',managerController.getEmployes)

router.post('/employes',upload.single('photo'),managerController.addEmploye)

router.delete('/employes/:id',managerController.deleteEmploye);

router.put('/employes/:id',managerController.updateEmploye)

//CRUD CATEGORIE
router.get('/categories',managerController.getAll);
router.post('/categories',managerController.addCategorie);

router.post('/categories',managerController.deleteCategorie);

router.put('/categories',managerController.updateCategorie);


module.exports = router;

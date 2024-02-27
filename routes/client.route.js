var express = require('express');
var router = express.Router();
const {signup,login,verifyToken} = require('../controllers/auth.controller')
const clientController = require('../controllers/client.controller');


router.use("/:ressource?", (req, res, next) => {
  const excludedRoutes = ['signup', 'login'];
  if (!excludedRoutes.includes(req.params.ressource || '')) {
    console.log("inside");
    return verifyToken("client")(req, res, next);
  }
  next();
});

//test
router.get('/', async (req, res, next) => {
    res.json({"message" : "client route ok"});
  }
);

//toky

router.get('/categories',clientController.getAllCategorie);

router.get('/services',clientController.getAllService);

router.get('/service/:id',clientController.getService);

//fav 

router.get('/employes_fav',clientController.getListEmployeFav);

router.delete('/employes_fav/:id', clientController.deleteEmployeFav);

router.post('/employes_fav/:id',clientController.addEmployeFav);

router.get('/services_fav',clientController.getListServiceFav);

router.delete('/services_fav/:id', clientController.deleteServiceFav);

router.post('/services_fav/:id',clientController.addServiceFav);

//basket 

router.get('/my_basket',clientController.getBasket);

router.delete('/my_basket/:id', clientController.deleteFromBasket);

router.post('/my_basket/:id',clientController.addToBasket);


router.get('/basket_total_price',clientController.getTotalPriceBasket)

router.get('/rdv_not_paid_total_price',clientController.getTotalPriceRdvNotPaid)



router.get('/services/:id',clientController.getService);

router.get('/categories',clientController.getListCategorie);

router.get('/services_by_categorie/:id',clientController.getListServiceCategorie);

router.get('/employes',clientController.getEmployes);

router.post('/appointment',clientController.appointment);

router.get('/total_duree_basket',clientController.getTotalDureeBasket);

router.post('/payment',clientController.payment);

router.get('/service_simple_search',clientController.serviceSimpleSearch);

router.get('/history_rdv',clientController.getHistoryRdv);

router.get('/current_list_offre_speciale',clientController.getCurrentListOffreSpeciale);

router.get('/current_offre_speciale_service/:id',clientController.getCurrentOffreSpecialeService);

router.get('/reduction_percent_service/:id',clientController.getPercentageReductionService);

router.get('/actual_price_service/:id',clientController.getActualPriceService);

router.get('/rappel_rdv',clientController.rappelRendezVous)

router.get('/count_pages_categorie/:id',clientController.countPagesServicesCategorie)

router.get('/count_pages_rdv',clientController.countHistoryRdv)

router.get('/count_pages_simple_search',clientController.countPagesServiceSimpleSearch)

router.post('/signup',async(req, res, next)=>{
  req.body.role = "client";
  signup(req, res, next);
})

router.post('/login',async(req, res, next)=>{
  req.body.role = "client";
  login(req, res, next);
})

module.exports = router;

const createError = require('http-errors')
const serviceModel = require('../models/service')
const categorieModel = require('../models/categorie')
const account = require('../models/account')
const { userCredentialsSchema } = require('../helpers/validation')
const jwt = require('jsonwebtoken')
const rdvModel = require('../models/rendez-vous')
const clientService = require('../services/client.service')
const basketModel = require('../models/basket')
const transaction = require('../models/transaction')

module.exports = {

    getBasket: async (req, res, next) => { //no route yet
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            const client_id = userPayload.aud;
            const basket = await basketModel.find({ client_id: client_id });
            let basketObject = basket[0].toObject();
            for (service of basketObject.services) {
                service.actualPrice = await clientService.getActualPriceService(service._id);
            }
            return res.json(basketObject.services);
        } catch (error) {
            next(error)
        }
    },

    getTotalDureeBasket: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            const client_id = userPayload.aud;
            let duree = await clientService.getTotalDureeBasket(client_id);
            res.json(duree);
        } catch (error) {
            next(error)
        }
    },

    deleteFromBasket: async (req, res, next) => { //no route yet
        try {
            const { id } = req.params;
            const service = await serviceModel.findById(id);
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            const client_id = userPayload.aud;
            let basket_array = await basketModel.find({ client_id: client_id });
            let basket = basket_array[0]
            console.log(basket);
            
            let indexToDelete = basket.services.findIndex(elem => elem._id.toString() === id);
            if (indexToDelete !== -1) {
                let newListService = [...basket.services]; // Create a copy of the array
                newListService.splice(indexToDelete, 1); // Remove the element at the specified index
                // Use newListService for further operations
                basket.services = newListService;
            }
           
            // let newListService = basket.services.filter((elem) => {
            //     return (elem._id.toString() !== id)
            // })
           
            await basket.save();
            return res.json("ok");
        } catch (error) {
            next(error)
        }
    },

    addToBasket: async (req, res, next) => { //no route yet
        try {
            //verify if already in basket
            const { id } = req.params;
            const service = await serviceModel.findById(id);
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            const client_id = userPayload.aud;
            let basket_array = await basketModel.find({ client_id: client_id });
            let basket = basket_array[0];
            basket.services.push(service);
            await basket.save();
            return res.status(201).json("service added to basket");
        } catch (error) {
            next(error)
        }
    },

    serviceSimpleSearch: async (req, res, next) => {
        try {
            if (req.query.search === undefined) {
                throw createError.BadRequest();
            }

            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 6;
            const skip = (page - 1) * limit;


            const { search } = req.query;
            const searchTerms = search.split(" ");

            const conditions = searchTerms.map(term => ({
                nom: { $regex: new RegExp(term, "i") }
            }));

            let result = await serviceModel.find({ $or: conditions }).skip(skip).limit(limit);

            let newList = [];
            for (let service of result) {
                let serviceObject = service.toObject();
                //actualPrice reduction offreSpeciale
                serviceObject.actualPrice = await clientService.getActualPriceService(serviceObject._id);
                serviceObject.reduction = await clientService.getPercentageReductionToday(serviceObject._id);
                serviceObject.offreSpeciale = await clientService.getCurrentOffreSpecialeService(serviceObject._id);
                serviceObject.isFav = await clientService.isServiceFav(userPayload.aud,serviceObject._id.toString());
                newList.push(serviceObject);
            }

            res.json(newList);
        } catch (error) {
            next(error);
        }
    },

    countPagesServiceSimpleSearch: async (req, res, next) => {
        try {
            if (req.query.search === undefined) {
                throw createError.BadRequest();
            }
            
            const limit = req.query.limit ? parseInt(req.query.limit) : 6;

            const { search } = req.query;
            const searchTerms = search.split(" ");

            const conditions = searchTerms.map(term => ({
                nom: { $regex: new RegExp(term, "i") }
            }));

            const totalDocuments = await serviceModel.countDocuments({ $or: conditions });
            const totalPages = totalDocuments === 0 ? 1 : Math.ceil(totalDocuments / limit);
            
            return res.json(totalPages);
        } catch (error) {
            next(error);
        }
    },

    getHistoryRdv: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            // const page = req.query.page ? parseInt(req.query.page) : 1;
            // const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            //const skip = (page - 1) * limit;
            let list = await rdvModel.find({ client_id: userPayload.aud }).populate(["employe_id"]).sort({ date_heure: -1 })/*.skip(skip).limit(limit)*/;
            let newList = [];
            for (let rdv of list) {
                let rdvObject = rdv.toObject();
                //actualPrice reduction offreSpeciale
                if(rdvObject.paiement){
                    let transaction_array = await transaction.find({rendez_vous_id : rdvObject._id})
                    rdvObject.totalPrice = transaction_array[0].montant;
                }else{
                    rdvObject.totalPrice = await clientService.getTotalPriceRdvNotPaid(rdvObject._id);
                }
                rdvObject.totalDuree = await clientService.getTotalDureeRdv(rdvObject._id);
                newList.push(rdvObject);
            }
            return res.json(newList);
        } catch (error) {
            next(error)
        }
    },

    countHistoryRdv: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            const limit = req.query.limit ? parseInt(req.query.limit) : 3;
            const totalDocuments = await rdvModel.countDocuments({ client_id: userPayload.aud });
            //const totalPages = Math.ceil(totalDocuments / limit);
            const totalPages = totalDocuments === 0 ? 1 : Math.ceil(totalDocuments / limit);
            return res.json(totalPages);
        } catch (error) {
            next(error)
        }
    },

    getAllCategorie: async (req, res, next) => {
        try {
            const list = await categorieModel.find();
            res.json(list);
        }
        catch (error) {
            next(error)
        }
    },


    getAllService: async (req, res, next) => {
        try {
            const list = await serviceModel.find();
            res.json(list);
        }
        catch (error) {
            next(error)
        }
    },

    getService: async (req, res, next) => {
        //console.log("calling getService()")
        try {
            const { id } = req.params;
            const service = await serviceModel.findById(id);
            let serviceObject = service.toObject();
            serviceObject.actualPrice = await clientService.getActualPriceService(serviceObject._id);
            serviceObject.reduction = await clientService.getPercentageReductionToday(serviceObject._id);
            serviceObject.offreSpeciale = await clientService.getCurrentOffreSpecialeService(serviceObject._id);
            return res.json(serviceObject);
        } catch (error) {
            //if model error
            //return next(error)
            return res.json({});
        }
    },

    getListCategorie: async (req, res, next) => {
        try {
            let listCategorie = await categorieModel.find();
            return res.json(listCategorie);
        } catch (error) {
            return next(error)
        }
    },

    countPagesServicesCategorie: async (req, res, next) => {
        try {
            const { id } = req.params;
            const limit = req.query.limit ? parseInt(req.query.limit) : 3;
            const totalDocuments = await serviceModel.countDocuments({ "categorie._id": id });
            //const totalPages = Math.ceil(totalDocuments / limit);
            const totalPages = totalDocuments === 0 ? 1 : Math.ceil(totalDocuments / limit);
            res.json(totalPages);
        } catch (error) {
            return next(error)
        }
    },

    getCurrentOffreSpecialeService: async (req, res, next) => {
        try {
            let { id } = req.params;
            let value = await clientService.getCurrentOffreSpecialeService(id);
            return res.json(value);
        } catch (error) {
            next(error)
        }
    },

    getPercentageReductionService: async (req, res, next) => {
        try {
            let { id } = req.params;
            let value = await clientService.getPercentageReductionToday(id);
            return res.json(value);
        } catch (error) {
            next(error)
        }
    },

    getActualPriceService: async (req, res, next) => {
        try {
            let { id } = req.params;
            let actualPrice = await clientService.getActualPriceService(id);
            return res.json(actualPrice);
        } catch (error) {
            next(error)
        }
    },

    getListServiceCategorie: async (req, res, next) => {
        try {

            //fav
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            
            
            const { id } = req.params;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 4;
            const skip = (page - 1) * limit;
            let list = await serviceModel.find({ "categorie._id": id }).skip(skip).limit(limit);
            let newList = [];
            for (let service of list) {
                let serviceObject = service.toObject();
                
                //actualPrice reduction offreSpeciale
                serviceObject.actualPrice = await clientService.getActualPriceService(serviceObject._id);
                serviceObject.reduction = await clientService.getPercentageReductionToday(serviceObject._id);
                serviceObject.offreSpeciale = await clientService.getCurrentOffreSpecialeService(serviceObject._id);
                serviceObject.isFav = await clientService.isServiceFav(userPayload.aud,serviceObject._id.toString());
                newList.push(serviceObject);
            }
            return res.json(newList);
        } catch (error) {
            return next(error)
        }
    },

    //verify if the employe already in favorite
    addEmployeFav: async (req, res, next) => {
        try {
            const { id } = req.params;
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            let client = await account.findById(userPayload.aud);
            let arrayEmploye = await account.find({ _id: id, role: "employe" });
            //console.log(arrayEmploye);
            client.employe_fav.push(arrayEmploye[0]);
            await client.save();
            return res.status(201).json("employé ajouté parmi vos favoris");
        } catch (error) {
            return next(error)
        }
    },

    deleteEmployeFav: async (req, res, next) => {
        try {
            const { id } = req.params;
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            let client = await account.findById(userPayload.aud);
            client.employe_fav = client.employe_fav.filter(employe => employe._id.toString() !== id);
            await client.save();
            return res.json("deleted");
        } catch (error) {
            return next(error)
        }
    },

    getListEmployeFav: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            let client = await account.findById(userPayload.aud);
            return res.json(client.employe_fav);
        } catch (error) {
            return next(error)
        }
    },

    //verify if the service already in favorite
    addServiceFav: async (req, res, next) => {
        try {
            const { id } = req.params;
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            let client = await account.findById(userPayload.aud);
            let service = await serviceModel.findById(id);
            client.service_fav.push(service);
            await client.save();
            return res.status(201).json("service ajouté parmi vos favoris");
        } catch (error) {
            return next(error)
        }
    },

    deleteServiceFav: async (req, res, next) => {
        try {
            const { id } = req.params;
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            let client = await account.findById(userPayload.aud);
            client.service_fav = client.service_fav.filter(service => service._id.toString() !== id);
            await client.save();
            return res.json("deleted");
        } catch (error) {
            return next(error)
        }
    },

    getListServiceFav: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            let client = await account.findById(userPayload.aud);
            let clientObject = client.toObject();
            let newList = [];
            for (let serviceObject of clientObject.service_fav) {
                //actualPrice reduction offreSpeciale
                serviceObject.actualPrice = await clientService.getActualPriceService(serviceObject._id);
                serviceObject.reduction = await clientService.getPercentageReductionToday(serviceObject._id);
                serviceObject.offreSpeciale = await clientService.getCurrentOffreSpecialeService(serviceObject._id);
                serviceObject.isFav = await clientService.isServiceFav(userPayload.aud,serviceObject._id.toString());
                newList.push(serviceObject)
            }
            return res.json(newList);
        } catch (error) {
            return next(error)
        }
    },

    getEmployes: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            const list = await account.find({ role: "employe" });
            
            let newList = [];
            for(employe of list){
                let employeObject = employe.toObject();
                employeObject.isFav = await clientService.isEmployeFav(userPayload.aud,employeObject._id.toString());
                newList.push(employeObject);
            }
            return res.json(newList);
        } catch (error) {
            next(error)
        }
    },

    payment: async (req, res, next) => {
        //req.body contains : idRdv
        try {
            await clientService.payment(req.body)
            return res.status(201).json("Paiement effectué avec succès");
        } catch (error) {
            next(error)
        }
    },

    getCurrentListOffreSpeciale: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            let list = await clientService.getCurrentListOffreSpecialeActive();
            let newList = [];
            for(offre of list){
                let offreObject = offre.toObject();
                for (let serviceObject of offreObject.liste_service) {
                    //actualPrice reduction offreSpeciale
                    serviceObject.actualPrice = await clientService.getActualPriceService(serviceObject._id);
                    serviceObject.reduction = await clientService.getPercentageReductionToday(serviceObject._id);
                    serviceObject.offreSpeciale = await clientService.getCurrentOffreSpecialeService(serviceObject._id);
                    serviceObject.isFav = await clientService.isServiceFav(userPayload.aud,serviceObject._id.toString());
                }
                newList.push(offreObject);
            }
            return res.json(newList);
        } catch (error) {
            next(error)
        }
    },

    getTotalPriceRdvNotPaid: async (req, res, next) => { //no route yet
        try {
            let { id } = req.params
            // const accessToken = req.cookies.jwtAccess
            // let userPayload = jwt.decode(accessToken);
            let total = await clientService.getTotalPriceRdvNotPaid(id);
            return res.json(total);
        } catch (error) {
            next(error)
        }
    },

    getTotalPriceBasket: async (req, res, next) => { //no route yet
        const accessToken = req.cookies.jwtAccess
        let userPayload = jwt.decode(accessToken);
        let total = await clientService.getTotalPriceBasket(userPayload.aud);
        return res.json(total);
    },

    rappelRendezVous: async (req, res, next) => {       ///////////////////////////////////////////////
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            return res.json("en cours de maintenance")
        } catch (error) {
            next(error)
        }
    },

    appointment: async (req, res, next) => {
        try {
            //req.body contains : id client, id service, id employe, dateheure
            //gestion d'erreurs
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            let clientId = userPayload.aud;
            const basket_array = await basketModel.find({ client_id: clientId });
            const basket = basket_array[0];
            const { employeId, dateHeureString } = req.body
            const dateHeure = new Date(dateHeureString);
            const employe = await account.findById(employeId);
            const rdvDuree = await clientService.getTotalDureeBasket(clientId);
            //const service = await serviceModel.findById(serviceId);
            if (employe.isInWorkTime(dateHeure, rdvDuree)) {
                const rdvBeforeArray = await clientService.getNearestRdvBefore(employeId, dateHeure);
                const rdvBefore = rdvBeforeArray.length > 0 ? rdvBeforeArray[0] : null;
                //console.log("rendez-vous before : ", rdvBefore)
                if (rdvBefore !== null) {
                    //let serviceBefore = await serviceModel.findById(rdvBefore.service_id);
                    let dureeRdvBefore = await clientService.getTotalDureeRdv(rdvBefore._id);
                    const HMrdvBefore = rdvBefore.date_heure.getHours() * 60 + rdvBefore.date_heure.getMinutes() + dureeRdvBefore;
                    const HMnewRdz = dateHeure.getHours() * 60 + dateHeure.getMinutes();
                    if (HMrdvBefore > HMnewRdz) return res.json({ state: -1 });
                }

                const rdvAfterArray = await clientService.getNearestRdvAfter(employeId, dateHeure);
                const rdvAfter = rdvAfterArray.length > 0 ? rdvAfterArray[0] : null;
                if (rdvAfter !== null) {
                    //let serviceNew = await serviceModel.findById(serviceId);
                    let dureeRdvAfter = await clientService.getTotalDureeRdv(rdvAfter._id);
                    const HMnewRdzWithDuree = dateHeure.getHours() * 60 + dateHeure.getMinutes() + dureeRdvAfter;
                    const HMrdvAfter = rdvAfter.date_heure.getHours() * 60 + rdvAfter.date_heure.getMinutes();
                    if (HMnewRdzWithDuree > HMrdvAfter) {
                        return res.json({ state: -1 })
                    }

                    //save rdv
                    const newRdv = new rdvModel({ client_id: clientId, employe_id: employeId, services: basket.services, date_heure: dateHeure, completion: false, paiement: false })

                    let saved = await newRdv.save()
                    return res.json({ state: 1, rdv : saved })
                }

                //save rdv
                const newRdv = new rdvModel({ client_id: clientId, employe_id: employeId, services: basket.services, date_heure: dateHeure, completion: false, paiement: false })
                let saved = await newRdv.save()
                basket.services = [];
                await basket.save();
                return res.json({ state: 1, rdv : saved })
            }
            return res.json({ state: 0 })

        } catch (error) {
            next(error)
        }
    }
}
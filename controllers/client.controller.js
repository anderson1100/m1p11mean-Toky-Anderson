const createError = require('http-errors')
const serviceModel = require('../models/service')
const account = require('../models/account')
const { userCredentialsSchema } = require('../helpers/validation')
const jwt = require('jsonwebtoken')
const rdvModel = require('../models/rendez-vous')
const categorieModel = require('../models/categorie')
const clientService = require('../services/client.service')

module.exports = {
    serviceSimpleSearch: async (req, res, next) => {
        try {
            if (req.query.search === undefined) {
                throw createError.BadRequest();
            }

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const skip = (page - 1) * limit;


            const { search } = req.query;
            const searchTerms = search.split(" ");

            const conditions = searchTerms.map(term => ({
                nom: { $regex: new RegExp(term, "i") }
            }));

            let result = await serviceModel.find({ $or: conditions }).skip(skip).limit(limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    getHistoryRdv: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const skip = (page - 1) * limit;
            let list = await rdvModel.find({ client_id: userPayload.aud}).populate(["employe_id","service_id"]).sort({ date_heure: -1 }).skip(skip).limit(limit);
            return res.json(list);
        } catch (error) {
            next(error)
        }
    },

    getService: async (req, res, next) => {
        //console.log("calling getService()")
        try {
            const { id } = req.params;
            const service = await serviceModel.findById(id);
            return res.json(service);
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

    getListServiceCategorie: async (req, res, next) => {
        try {
            const { id } = req.params;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 100;
            const skip = (page - 1) * limit;
            let list = await serviceModel.find({ "categorie._id": id }).skip(skip).limit(limit);
            return res.json(list);
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
            return res.sendStatus(201);
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
            return res.sendStatus(200);
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
            return res.sendStatus(201);
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
            return res.sendStatus(200);
        } catch (error) {
            return next(error)
        }
    },

    getListServiceFav: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            let client = await account.findById(userPayload.aud);
            return res.json(client.service_fav);
        } catch (error) {
            return next(error)
        }
    },

    getEmployes: async (req, res, next) => {
        try {
            const list = await account.find({ role: "employe" });
            return res.json(list);
        } catch (error) {
            next(error)
        }
    },

    payment: async (req, res, next) => {
        //req.body contains : idRdv
        try {
            await clientService.payment(req.body)
            return res.sendStatus(200);
        } catch (error) {
            next(error)
        }

    },

    getCurrentListOffreSpeciale: async (req, res, next) => {
        try {
            let list = await clientService.getCurrentListOffreSpecialeActive();
            return res.json(list);
        } catch (error) {
            next(error)
        }
    },

    getCurrentOffreSpecialeService: async (req, res, next) => {
        try {
            let {id} = req.params;
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
            let service = await serviceModel.findById(id);
            let percentageReduction = await clientService.getPercentageReductionToday(id);
            let actualPrice = service.prix
            actualPrice -= (service.prix * percentageReduction) / 100;
            return res.json(actualPrice);
        } catch (error) {
            next(error)
        }
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
            const { clientId, employeId, serviceId, dateHeureString } = req.body
            const dateHeure = new Date(dateHeureString);
            const employe = await account.findById(employeId);
            const service = await serviceModel.findById(serviceId);

            if (employe.isInWorkTime(dateHeure, service.duree_minute)) {
                const rdvBeforeArray = await clientService.getNearestRdvBefore(employeId, dateHeure);
                const rdvBefore = rdvBeforeArray.length > 0 ? rdvBeforeArray[0] : null;
                //console.log("rendez-vous before : ", rdvBefore)
                if (rdvBefore !== null) {
                    let serviceBefore = await serviceModel.findById(rdvBefore.service_id);
                    const HMrdvBefore = rdvBefore.date_heure.getHours() * 60 + rdvBefore.date_heure.getMinutes() + serviceBefore.duree_minute;
                    const HMnewRdz = dateHeure.getHours() * 60 + dateHeure.getMinutes();
                    if (HMrdvBefore > HMnewRdz) return res.json({ state: -1 });
                }

                const rdvAfterArray = await clientService.getNearestRdvAfter(employeId, dateHeure);
                const rdvAfter = rdvAfterArray.length > 0 ? rdvAfterArray[0] : null;
                if (rdvAfter !== null) {
                    let serviceNew = await serviceModel.findById(serviceId);
                    const HMnewRdzWithDuree = dateHeure.getHours() * 60 + dateHeure.getMinutes() + serviceNew.duree_minute;
                    const HMrdvAfter = rdvAfter.date_heure.getHours() * 60 + rdvAfter.date_heure.getMinutes();
                    if (HMnewRdzWithDuree > HMrdvAfter) {
                        return res.json({ state: -1 })
                    }

                    //save rdv
                    const newRdv = new rdvModel({ client_id: clientId, employe_id: employeId, service_id: serviceId, date_heure: dateHeure, completion: false, paiement: false })
                    await newRdv.save()
                    return res.json({ state: 1 })
                }

                //save rdv
                const newRdv = new rdvModel({ client_id: clientId, employe_id: employeId, service_id: serviceId, date_heure: dateHeure, completion: false, paiement: false })
                await newRdv.save()
                return res.json({ state: 1 })
            }
            return res.json({ state: 0 })

        } catch (error) {
            next(error)
        }
    }
}
const createError = require('http-errors')
const serviceModel = require('../models/service')
const account = require('../models/account')
const { getNearestRdvBefore, getNearestRdvAfter,payment } = require('../services/client.service')
const { userCredentialsSchema } = require('../helpers/validation')
const JWT = require('jsonwebtoken')
const rdvModel = require('../models/rendez-vous')

module.exports = {
    getService: async (req, res, next) => {
        console.log("calling getService()")
        try {
            const { id } = req.params;
            const service = await serviceModel.findById(id);
            res.json(service);
        } catch (error) {
            //if model error
            return res.json({});
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

    payment: async (req, res, next) =>{
        //req.body contains : idRdv
        try{
            await payment(req.body.idRdv)
        }catch(error){
            next(error)
        }

    },

    appointment: async (req, res, next) => {
        //req.body contains : id client, id service, id employe, dateheure
        //gestion d'erreurs
        const { clientId, employeId, serviceId, dateHeureString } = req.body
        const dateHeure = new Date(dateHeureString);
        const employe = await account.findById(employeId);
        const service = await serviceModel.findById(serviceId);

        if (employe.isInWorkTime(dateHeure, service.duree_minute)) {
            const rdvBeforeArray = await getNearestRdvBefore(employeId, dateHeure);
            const rdvBefore = rdvBeforeArray.length > 0 ? rdvBeforeArray[0] : null;
            console.log("rendez-vous before : ", rdvBefore)
            if (rdvBefore !== null) {
                let serviceBefore = await serviceModel.findById(rdvBefore.service_id);
                const HMrdvBefore = rdvBefore.date_heure.getHours() * 60 + rdvBefore.date_heure.getMinutes() + serviceBefore.duree_minute;
                const HMnewRdz = dateHeure.getHours() * 60 + dateHeure.getMinutes();
                if (HMrdvBefore > HMnewRdz) return res.json({ state: -1 });
            }

            const rdvAfterArray = await getNearestRdvAfter(employeId, dateHeure);
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
    }
}
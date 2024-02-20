const rendezVous = require('../models/rendez-vous');
const transaction = require('../models/transaction');
const serviceModel = require('../models/service');
const offreSpecialeModel = require('../models/offre-speciale')
const { getPercentageReductionToday } = require('../services/employe.service')

module.exports = {

    getPercentageReductionToday,

    payment: async (paymentObject) => {
        //verify price offre speciale
        const { id, carte, nom, montant } = paymentObject;
        let datenow = Date.now();
        //use transaction if there is time for that
        let payment = new transaction({ rendez_vous_id: id, montant: montant, num_carte_credit: carte, nom: nom, date: datenow, status: true })
        await payment.save();
        let rdv = await rendezVous.findById(id);
        rdv.paiement = true;
        await rdv.save()
    },

    getCurrentOffreSpecialeService: async (service_id) => {
        try {
            let value = null;
            let offreSpec = await offreSpecialeModel.find({
                "liste_service": { $elemMatch: { "_id": service_id } },
                "date_debut": { $lte: new Date() },
                "date_fin": { $gte: new Date() }
            })
            if (offreSpec.length > 0) {
                return offreSpec[0];
            }
            return value;
        } catch (error) {
            throw error
        }
    },

    getCurrentListOffreSpecialeActive: async () => {
        let now = new Date();
        let list = await offreSpecialeModel.find({
            date_debut : {
                $lte : now
            },
            date_fin : {
                $gte : now
            }
        })
        return list;
    },

    //maybe employe service function
    //for only a specific day no consideration for other days
    getNearestRdvBefore: async (id, desiredDate) => {
        const startDate = new Date(desiredDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(desiredDate);
        endDate.setHours(23, 59, 59, 999);
        try {
            const rdv = await rendezVous.find({
                $and: [{
                    date_heure: {
                        $gte: startDate,
                        $lte: endDate // ?rdv + duree <= endDate
                    },
                },
                {
                    employe_id: id
                },
                {
                    date_heure: {
                        $lt: desiredDate
                    }
                }
                ]
            }).sort({ date_heure: -1 }).limit(1).exec();
            return rdv;
        } catch (error) {
            //console.error('Error retrieving documents:', error);
            throw error;
        }
    },


    getNearestRdvAfter: async (id, desiredDate) => {
        const startDate = new Date(desiredDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(desiredDate);
        endDate.setHours(23, 59, 59, 999);
        try {
            const rdv = await rendezVous.find({
                $and: [{
                    date_heure: {
                        $gte: startDate,
                        $lte: endDate
                    },
                },
                {
                    employe_id: id
                },
                {
                    date_heure: {
                        $gte: desiredDate
                    }
                }
                ]
            }).sort({ date_heure: 1 }).limit(1).exec();
            return rdv;
        } catch (error) {
            //console.error('Error retrieving documents:', error);
            throw error;
        }
    }

}
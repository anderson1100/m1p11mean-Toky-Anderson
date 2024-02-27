const rendezVous = require('../models/rendez-vous');
const transaction = require('../models/transaction');
const serviceModel = require('../models/service');
const offreSpecialeModel = require('../models/offre-speciale')
const { getPercentageReductionToday } = require('../services/employe.service')
const basketModel = require('../models/basket');
const account = require('../models/account');
const mongoose = require("mongoose")


module.exports = {

    getPercentageReductionToday,

    isServiceFav: async (client_id,service_id) => {
        try {
            let client = await account.findById(client_id);
            let listServiceFav = client.service_fav;

            let isIdInArray = listServiceFav.some(service => service._id.toString() === service_id);
            return isIdInArray;

        } catch (error) {
            throw error
        }
    },

    isEmployeFav: async (client_id,id) => {
        try {
            let client = await account.findById(client_id);
            let listEmployeFav = client.employe_fav;

            let isIdInArray = listEmployeFav.some(employe => employe._id.toString() === id);
            return isIdInArray;

        } catch (error) {
            throw error
        }
    },

    getActualPriceService: async (id) => {
        try {
            let service = await serviceModel.findById(id);
            let percentageReduction = await getPercentageReductionToday(id);
            let actualPrice = service.prix
            actualPrice -= (service.prix * percentageReduction) / 100;
            return actualPrice;
        } catch (error) {
            throw error;
        }
    },

    //getTotalPrixBasket and rdv

    // emptyBasket: async (id_client) => {
    //     try {
    //         let result = await basketModel.find({ client_id: id_client });
    //         if (result.length > 0) {
    //             let basket = result[0];
    //             basket.services = [];
    //             return await basket.save();
    //         }
    //     } catch (error) {
    //         throw (error)
    //     }
    // },

    getTotalPriceBasket: async (id_client) => {
        try {
            const basket_array = await basketModel.find({ client_id: id_client });
            let basket = basket_array[0];
            let total = 0;
            for (let service of basket.services) {
                let id = service._id;
                let percentageReduction = await getPercentageReductionToday(id);
                let actualPrice = service.prix
                actualPrice -= (service.prix * percentageReduction) / 100;
                total += actualPrice
            }
            return total;
        } catch (error) {
            throw (error)
        }
    },

    getTotalPriceRdvNotPaid: async (id_rdv) => {
        try {
            const rdv_array = await rendezVous.find({ _id: id_rdv });
            let rdv = rdv_array[0];
            let total = 0;
            for (let service of rdv.services) {
                let id = service._id;
                let percentageReduction = await getPercentageReductionToday(id);
                let actualPrice = service.prix
                actualPrice -= (service.prix * percentageReduction) / 100;
                total += actualPrice
            }
            return total;
        } catch (error) {
            throw (error)
        }
    },

    getTotalDureeRdv: async (id_rdv) => {
        try {
            let result = await rendezVous.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id_rdv)
                    }
                },
                {
                    $unwind: "$services"
                },
                {
                    $group: {
                        _id: {
                            id: "$_id"
                        },
                        totalDuree: { $sum: "$services.duree_minute" }
                    }
                }

            ])

            console.log("totaldureerdv", result)

            if (result.length > 0) {
                return result[0].totalDuree;
            } else {
                return 0;
            }
        } catch (error) {
            throw (error)
        }
    },

    getTotalDureeBasket: async (id_client) => {
        try {
            let result = await basketModel.aggregate([
                {
                    $match: {
                        "client_id": new mongoose.Types.ObjectId(id_client)
                    }
                },
                {
                    $unwind: "$services"
                },
                {
                    $group: {
                        _id: "$_id",
                        totalDuree: { $sum: "$services.duree_minute" }
                    }
                }

            ]);

            //console.log("totaldureebasketdsfds",result)

            if (result.length > 0) {
                return result[0].totalDuree;
            } else {
                return 0;
            }
        } catch (error) {
            throw (error)
        }
    },

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
            date_debut: {
                $lte: now
            },
            date_fin: {
                $gte: now
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
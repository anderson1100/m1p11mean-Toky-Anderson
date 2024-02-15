const rendezVous = require('../models/rendez-vous');
const transaction = require('../models/transaction');
const serviceModel = require('../models/service');

module.exports = {

    payment : async (paymentObject) =>{
        const{id} = paymentObject;
        const rdv = await rendezVous.findById(id);
        const service = await serviceModel.findById(rdv.service_id);
        //verify price offre speciale
        let datenow = Date.now();
        let payment = new transaction({rendez_vous_id : id,montant : service.montant, date : datenow, status : true})
        await payment.save();
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
                        employe_id : id
                    },
                    {
                        date_heure: {
                            $lt : desiredDate
                        }
                    }
                 ]
            }).sort({ date_heure: -1 }).limit(1).exec();
            return rdv;
        } catch (error) {
            console.error('Error retrieving documents:', error);
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
                        employe_id : id
                    },
                    {
                        date_heure: {
                            $gte : desiredDate
                        }
                    }
                 ]
            }).sort({ date_heure: 1 }).limit(1).exec();
            return rdv;
        } catch (error) {
            console.error('Error retrieving documents:', error);
            throw error;
        }
    }

}
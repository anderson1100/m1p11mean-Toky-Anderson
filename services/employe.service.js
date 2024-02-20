const rendezVous = require('../models/rendez-vous');
const transactionModel = require('../models/transaction')
const offreSpecialeModel = require('../models/offre-speciale')
//const transaction = require('../models/transaction');
//const serviceModel = require('../models/service');

computeTotalCommission = async (listRdv, withOffreSpecialReduction) => {
    try {
        let total = 0;
        for (rdv of listRdv) {
            let service = rdv.service_id;
            let price = service.prix;
            if (withOffreSpecialReduction) {
                let reductionPercentage = await getPercentageReductionToday(service._id);
                price -= ((price * reductionPercentage) / 100)
            }
            let commission = (price * service.commission) / 100;
            total += commission;
        }
        return total;
    } catch (error) {
        throw error
    }
}

getPercentageReductionToday = async (service_id) => {
    try {
        let value = 0;
        let offreSpec = await offreSpecialeModel.find({
            "liste_service": { $elemMatch: { "_id": service_id } },
            "date_debut": { $lte: new Date() },
            "date_fin": { $gte: new Date() }
        })
        if (offreSpec.length > 0) {
            offreSpec = offreSpec[0]; //
            let index = offreSpec.liste_service.findIndex((x) => {
                return x._id.toString() === service_id.toString(); //verify id object or string if there's time
            })
            let reduction = offreSpec.reduction[index];
            value += reduction;
        }
        return value;
    } catch (error) {
        throw error
    }
}

module.exports = { computeTotalCommission, getPercentageReductionToday};
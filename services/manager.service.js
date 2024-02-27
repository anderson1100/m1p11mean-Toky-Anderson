const rendezVousModel = require('../models/rendez-vous');
const transactionModel = require('../models/transaction');
const offreSpecialeModel = require('../models/offre-speciale');
//const transaction = require('../models/transaction');
//const serviceModel = require('../models/service');

getTotalChiffreAffaireMonth = async (month, year) => { 
    try {
        let total = 0;
        let result = await transactionModel.aggregate([
            {
                $lookup: {
                    from: "rendez_vous",
                    localField: "rendez_vous_id",
                    foreignField: "_id",
                    as: "rendez_vous_array"
                }
            },
            {
                $addFields: {
                    rendez_vous: { $arrayElemAt: ["$rendez_vous_array", 0] }
                }
            },
            {
                $match: {
                    "rendez_vous.date_heure": {
                        $gte: new Date(year, month, 1),
                        $lt: new Date(year, month + 1, 1)
                    },
                    status: true
                }
            },
            {
                $group: {
                    _id: { $month: "$rendez_vous.date_heure" },
                    totalPayment: { $sum: "$montant" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ])
        if (result.length > 0) total += result[0].totalPayment;
        return result[0]; 
    } catch (error) {
        throw error;
    }
}

getPercentageReductionDate = async (service_id, date) => { 
    try {
        let value = 0;
        let offreSpec = await offreSpecialeModel.find({
            "liste_service": { $elemMatch: { "_id": service_id } },
            "date_debut": { $lte: date },
            "date_fin": { $gte: date }
        })
        if (offreSpec.length > 0) {
            offreSpec = offreSpec[0];
            let index = offreSpec.liste_service.findIndex((x) => {
                return (x._id.toString() === service_id.toString());
            })
            let reduction = offreSpec.reduction[index];
            value += reduction;
        }
        return value;
    } catch (error) {
        throw error
    }
}

getTotalCommissionMonth = async (month, year, withOffreSpecialReduction) => {

    let listRdv = await rendezVousModel.aggregate([
        {
            $match: {
                date_heure: {
                    $gte: new Date(year, month, 1),
                    $lt: new Date(year, month + 1, 1)
                }
            }
        },
        {
            $unwind: "$services"
        }
    ]);

    let total = 0;
    for (let rdv of listRdv) {
        console.log("rdv",rdv);
        let service = rdv.services;
        let price = service.prix;
        if (withOffreSpecialReduction) {
            let reductionPercentage = await getPercentageReductionDate(service._id, rdv.date_heure);
            price -= ((price * reductionPercentage) / 100)
        }
        let commission = (price * service.commission) / 100;
        total += commission;
    }
    return total;
}

getBeneficeMonth = async (month, year, inputObject) => {
    let totalChiffreAffaire = await getTotalChiffreAffaireMonth(month, year);
    let totalCommission = await getTotalCommissionMonth(month, year, true /*or false*/);
    inputObject["commissions"] = totalCommission;
    let benefice = totalChiffreAffaire.totalPayment;
    for (let key in inputObject) {
        if (typeof inputObject[key] === 'number') {
            benefice -= inputObject[key];
        }
    }
    let responseObject = {
        "chiffreAffaire": totalChiffreAffaire,
        "charges": inputObject,
        "benefice": benefice
    }
    return responseObject;
}

tempsTravailMoyenByEmploye = async () => {
    try {
        const result = await rendezVousModel.aggregate([
            {
                $lookup: {
                    from: "account",
                    localField: "employe_id",
                    foreignField: "_id",
                    as: "employe_array"
                }
            },
            {
                $addFields: {
                    employe: { $arrayElemAt: ["$employe_array", 0] }
                }
            },
            // consider moving "$match" up if applicable for better performance 
            {
                $match: {
                    "completion": true
                }
            },
            {
                $unwind : "$services"
            },
            {
                $group: {
                    _id: {
                        employe_id: "$employe_id",
                        employe_nom: "$employe.nom",
                        employe_prenom: "$employe.prenom",
                        year: { $year: "$date_heure" },
                        month: { $month: "$date_heure" },
                        day: { $dayOfMonth: "$date_heure" }
                        // hour: { $hour: "$date_heure" } //verify 
                    },
                    totalDureeMinute: { $sum: "$services.duree_minute" }
                }
            },
            {
                $group: {
                    _id: {
                        id_employe : "$_id.employe_id",
                        nom_employe : "$_id.employe_nom",
                        prenom_employe : "$_id.employe_prenom"
                    },
                    avgTempsTravailPer24h: { $avg: "$totalDureeMinute" }
                }
            }
        ]);
        return result;
    } catch (error) {
        throw error
    }
}

countRdvByDayForMonth = async (month, year) => { 
    try {
        const result = await rendezVousModel.aggregate([
            {
                $match: {
                    date_heure: {
                        $gte: new Date(year, month, 1),
                        $lt: new Date(year, month + 1, 1)
                    }
                }
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$date_heure" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 } // sort by day
            }
        ])
        return result;
    } catch (error) {
        throw error;
    }
}


chiffreAffaireByDayForMonth = async (month, year) => { 
    try {
        let result = await transactionModel.aggregate([
            {
                $lookup: {
                    from: "rendez_vous",
                    localField: "rendez_vous_id",
                    foreignField: "_id",
                    as: "rendez_vous_array"
                }
            },
            {
                $addFields: {
                    rendez_vous: { $arrayElemAt: ["$rendez_vous_array", 0] }
                }
            },
            {
                $match: {
                    "rendez_vous.date_heure": {
                        $gte: new Date(year, month, 1),
                        $lt: new Date(year, month + 1, 1)
                    },
                    status: true
                }
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$rendez_vous.date_heure" },
                    totalPayment: { $sum: "$montant" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ])
        return result;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getBeneficeMonth, tempsTravailMoyenByEmploye, countRdvByDayForMonth, chiffreAffaireByDayForMonth
}
const createError = require('http-errors')
const serviceModel = require('../models/service')
const account = require('../models/account')
const { userCredentialsSchema } = require('../helpers/validation')
const bcrypt = require("bcrypt")

module.exports = {

    getEmploye: async (req, res, next) => {
        try {
            const { id } = req.params;
            const employe = await account.findById(id);
            return res.json(employe);
        } catch (error) {
            next(error)
        }
    },

    updateEmploye: async (req, res, next) => {
        //req.body contains user : whole employe object, additional : {password : true/false}
        try {
            const { id } = req.params;
            const { nom, prenom, email, password, heure_debut, heure_fin } = req.body.employe;
            const { changePassword } = req.body.additional.password;
            let employe = account.findById(id);
            let debut = new Date(heure_debut);
            let fin = new Date(heure_fin);
            employe.nom = nom;
            employe.prenom = prenom;
            if (changePassword) {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
            }
            employe.heure_debut = debut;
            employe.heure_fin = fin;
            await employe.save();
        } catch (error) {
            next(error)
        }
    }
}
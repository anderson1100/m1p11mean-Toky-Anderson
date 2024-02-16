const createError = require('http-errors')
const serviceModel = require('../models/service')
const account = require('../models/account')
const categorieModel = require('../models/categorie')
const { userCredentialsSchema } = require('../helpers/validation')
const bcrypt = require("bcrypt")

module.exports = {

    //CRUD EMPLOYE
    getEmployesByPage: async (req, res, next) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const skip = (page - 1) * limit;
            const list = await account.find({ role: "employe" }).skip(skip).limit(limit);
            return res.json(list);
        } catch (error) {
            next(error)
        }
    },

    addEmploye: async (req, res, next) => {
        try {
            let role = "employe";
            let userInfo = req.body;
            const validationResult = await userCredentialsSchema.validateAsync(userInfo);

            let user = new account(validationResult)

            const doesExist = await account.exists({
                $or: [
                    { $and: [{ email: validationResult.email }, { role: role }] },
                    { $and: [{ username: validationResult.username }, { role: role }] }
                ]
            })

            console.log("does exist with exists method test", doesExist)

            if (doesExist)
                throw createError.Conflict('email/username already been registered')

            user.role = role;

            user.heure_debut = new Date(user.heure_debut);
            user.heure_fin = new Date(user.heure_fin);

            await user.bcryptPassword();
            const savedUser = await user.save()
            //console.log(savedUser);
            res.sendStatus(201);
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    deleteEmploye: async (req, res, next) => {
        try {
            const { id } = req.params;
            await account.deleteOne({ _id: id });
            res.sendStatus(200);
        } catch (error) {
            next(error)
        }
    },

    updateEmploye: async (req, res, next) => {
        //req.body contains user : whole employe object, additional : {password : true/false}
        try {
            const { id } = req.params;
            const { nom, prenom, email,username, password, heure_debut, heure_fin } = req.body;
            let employe = await account.findById(id);
            let debut = new Date(heure_debut);
            let fin = new Date(heure_fin);
            employe.nom = nom;
            employe.prenom = prenom;
            employe.email = email;
            employe.username = username;
            if (req.query.chpass !== undefined) {
                console.log("changing employe password");
                employe.password = password;
                await employe.bcryptPassword();
            }
            employe.heure_debut = debut;
            employe.heure_fin = fin;
            await employe.save();
            res.sendStatus(200)
        } catch (error) {
            next(error)
        }
    },


    //CRUD CATEGORIE

    getAll: async (req,res,next) => {
        try{
            const list = await categorieModel.find();
            return res.json(list);
        }
        catch(error){
            next(error)
        }
    },

    addCategorie: async (req, res, next) => {
        try{
            let categorieInfo = req.body;
            let categorie = new categorieModel(categorieInfo);
            const doesExist = await account.exists({nom : categorie.nom})

            if(doesExist)
                throw createError.Conflict("Categorie name already exist!");

            const saved = await categorie.save();
            res.sendStatus(201);
        }
        catch(error){
            next(error)
        }
    },

    deleteCategorie: async (req, res, next) => {
        try {
            const { id } = req.params;
            await categorieModel.deleteOne({ _id: id });
            res.sendStatus(200);
        } catch (error) {
            next(error)
        }
    },

    updateCategorie : async (req, res, next) => {
     
        try {
            const { id } = req.params;
            const {nom, description} = req.body;
            let categorie = await categorieModel.findById(id);
            categorie.nom = nom;
            categorie.description = description;
            await categorie.save();
            res.sendStatus(200);
        } catch (error) {
            next(error)
        }
    },






    //CRUD SERVICE
    getServicesByPage: async (req, res, next) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const skip = (page - 1) * limit;
            const list = await serviceModel.find().skip(skip).limit(limit);
            return res.json(list);
        } catch (error) {
            next(error)
        }
    },

    addService: async (req, res, next) => {
        try {
            let serviceInfo = req.body;
            let service = new serviceModel(serviceInfo);
            const doesExist = await account.exists({ nom : service.nom})

            if (doesExist)
                throw createError.Conflict('service name already used');

            const saved = await service.save()
            res.sendStatus(201);
        } catch (error) {
            next(error)
        }
    },

    deleteService: async (req, res, next) => {
        try {
            const { id } = req.params;
            await serviceModel.deleteOne({ _id: id });
            res.sendStatus(200);
        } catch (error) {
            next(error)
        }
    },

    updateService : async (req, res, next) => {
        //req.body contains user : whole employe object, additional : {password : true/false}
        try {
            const { id } = req.params;
            const {nom, description, categorie, prix, duree_minute, commission} = req.body;
            //categorie
            let service = await serviceModel.findById(id);
            service.nom = nom;
            service.description = description;
            service.categorie = categorie;
            service.prix = prix;
            service.duree_minute = duree_minute;
            service.commission = commission;
            await service.save();
            res.sendStatus(200);
        } catch (error) {
            next(error)
        }
    }
}
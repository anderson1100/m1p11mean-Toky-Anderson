const createError = require('http-errors')
const serviceModel = require('../models/service')
const rdvModel = require('../models/rendez-vous')
const account = require('../models/account')
const { userCredentialsSchema } = require('../helpers/validation')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const { updateEmploye } = require('./manager.controller')
const employeService = require('../services/employe.service')
const mongoose = require('mongoose')


module.exports = {

    getEmploye: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            const employe = await account.findById(userPayload.aud);
            return res.json(employe);
        } catch (error) {
            next(error)
        }
    },

    getListRdvByPage: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const skip = (page - 1) * limit;
            let list = await rdvModel.find({ employe_id: userPayload.aud, completion: true }).populate(["client_id"]).sort({ date_heure: -1 }).skip(skip).limit(limit);
            return res.json(list);
        } catch (error) {
            next(error)
        }
    },

    getListRdvFinishedToday: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            const startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date();
            endDate.setHours(23, 59, 59, 999);
            let list = await rdvModel.find({
                $and: [
                    { employe_id: userPayload.aud, completion: true },
                    {
                        date_heure: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    },
                ]
            }).sort({ date_heure: -1 })
            return res.json(list);
        } catch (error) {
            next(error)
        }
    },
    getListRdvToday: async (req, res, next) => {
        try {
            const accessToken = req.cookies.jwtAccess
            let userPayload = jwt.decode(accessToken);
            const startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date();
            endDate.setHours(23, 59, 59, 999);
            let list = await rdvModel.find({
                $and: [
                    { employe_id: userPayload.aud, completion: false },
                    {
                        date_heure: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    },
                ]
            }).sort({ date_heure: -1 })
            console.log(list);
            return res.json(list);
        } catch (error) {
            next(error)
        }
    },


    completeRdv: async (req, res, next) => {
        try{
        let { id } = req.params;
        let rdv = await rdvModel.findById(id);
        rdv.completion = true;
        await rdv.save();
        return res.status(201).json("Rendez-vous complèté");
        } catch(error){
            next(error)
        }
    },

    getTotalCommissionToday: async (req, res, next) => {
        const accessToken = req.cookies.jwtAccess
        let userPayload = jwt.decode(accessToken);
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        let list = await rdvModel.aggregate([
            {
                $match: {
                    employe_id: new mongoose.Types.ObjectId(userPayload.aud),
                    completion: true,
                    date_heure: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            { $unwind: "$services" }])
        // console.log(list);
        let result = await employeService.computeTotalCommission(list, true);
        return res.json(result);
    },

    updatePhotoEmploye: async (req, res, next) => {
        //req.body contains user : whole employe object, additional : {password : true/false}
        try {
            const { id } = req.params;
            let employe = await account.findById(id);
            //to verify
            if(req.file !== undefined){
                employe.photo = req.file.originalname;
            }
            await employe.save();
            return res.sendStatus(200)
        } catch (error) {
            next(error)
        }
    },

}
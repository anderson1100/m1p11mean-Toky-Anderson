const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
let Schema = mongoose.Schema


const refreshToken = new Schema({
    value: {
      type: String
    },
    user_id : {
        type: ObjectId
    }
});

module.exports = mongoose.model("refresh_token",refreshToken,"refresh_token")
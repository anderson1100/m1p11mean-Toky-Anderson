const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

//type: Schema.Types.ObjectId

let Schema = mongoose.Schema

const refreshToken = new Schema({
    value: {
      type: String
    },
    user_id : {
        type: ObjectId,
        ref : "account"
    }
});

module.exports = mongoose.model("refresh_token",refreshToken,"refresh_token")
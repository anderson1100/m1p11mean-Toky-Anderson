const Joi = require('joi')

const userCredentialsSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
}).keys({}).unknown(true);

module.exports = {
  userCredentialsSchema
}

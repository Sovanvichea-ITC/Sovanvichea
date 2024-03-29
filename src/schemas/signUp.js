const Joi = require('joi');
module.exports = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dayofbirth: Joi.string(),
    phone: Joi.string(),
    // imageUrl: Joi.string(),
    location:Joi.string(),
    password: Joi.string(),
    gender:Joi.string(),
    role: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeat_password: Joi.ref('password'),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
}).with('password', 'repeat_password');

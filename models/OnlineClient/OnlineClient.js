const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const client = new Schema(
    {
        clinica: { type: Schema.Types.ObjectId, ref: 'Clinica' },
        isArchive: { type: Boolean, default: false },
        // firstname: { type: String, required: true },   
        // lastname: { type: String, required: true }, 
        fullname: { type: String, required: true }, 
        brondate: { type: Date, required: true },
        phone: { type: String, required: true },
        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        reseption: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

function validateClient(client) {
    const schema = Joi.object({
        clinica: Joi.string().required(),
        firstname: Joi.string().optional(),
        lastname: Joi.string().optional(),
        fullname: Joi.string().required(),
        brondate: Joi.date(),
        phone: Joi.string(),
        department: Joi.string(),
        reseption: Joi.string(),
    })

    return schema.validate(client)
}

module.exports.validateOnlineClient = validateClient
module.exports.OnlineClient = model('OnlineClient', client)

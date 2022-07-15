import Joi from 'joi'

export const cdnToAgoraDto = Joi.object({
    sourceUrl: Joi.string().required(),
    targetUrl: Joi.string().required()
})
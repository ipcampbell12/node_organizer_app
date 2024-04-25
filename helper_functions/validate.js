const Joi = require('joi');


function validateBook(person) {
    const schema = Joi.object({
        title: Joi.string().min(4).required()
    });

    return schema.validate(person);
}


const sum = (...args) => {
    return args.reduce(function (acc, cur) {
        return acc + cur
    })

}


module.exports = {
    validateBook: validateBook
}
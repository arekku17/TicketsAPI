const roleSchema = require("../models/Role");

const createRoles = async () => {
    try {
        const count = await roleSchema.estimatedDocumentCount()

        if (count > 0) return;

        const values = await Promise.all([
            new roleSchema({ name: "moderator" }).save(),
            new roleSchema({ name: "admin" }).save()
        ])

        console.log(values);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createRoles};
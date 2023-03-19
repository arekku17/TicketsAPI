const User = require("../models/User");

const ROLES = ["user", "admin", "moderator"];

const checkDuplicateUser = async (req, res, next) => {
    const userFound = await User.findOne({username: req.body.username});
    if(userFound) return res.status(400).json({message: "Usuario ya existe"})
    next();
}


const checkRolesExisted = (req, res, next) => {
    if(req.body.roles){
        for (let i = 0; i < req.body.roles.length; i++) {
            if(!ROLES.includes(req.body.roles[i])){
                return res.status(404).json({
                    message: `Role ${req.body.roles[i]} no existe`
                })
            }
        }
    }
    next();
}

module.exports = { checkRolesExisted, checkDuplicateUser }
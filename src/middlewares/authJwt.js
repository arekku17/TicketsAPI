const jwt = require("jsonwebtoken")
const User = require("../models/User");
const Role = require("../models/Role");

const verifyToken = async (req, res, next) => {

    try {
        const token = req.headers["x-access-token"];

        if (!token) return res.status(403).json({ error: "No token" })

        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userId = decoded.id;

        const userFound = await User.findById(decoded.id, { password: 0 });


        if (!userFound) return res.status(404).json({ error: "no user found" });

        next();
    } catch (error) {
        return res.json({error});
    }
}

const isModerador = async (req, res, next) => {
    const userFound = await User.findById(req.userId);
    const roles = await Role.find({_id: {$in: userFound.roles}});

    for(let i = 0; i < roles.length; i++){
        if(roles[i].name === "moderator"){
            next();
            return;
        }
    }

    return res.status(403).json({error: "No tienes permisos para acceder"});
}

const isAdmin = async (req, res, next) => {
    const userFound = await User.findById(req.userId);
    const roles = await Role.find({_id: {$in: userFound.roles}});

    for(let i = 0; i < roles.length; i++){
        if(roles[i].name === "admin"){
            next();
            return;
        }
    }

    return res.status(403).json({error: "No tienes permisos para acceder"});
}

module.exports = { verifyToken, isModerador, isAdmin};
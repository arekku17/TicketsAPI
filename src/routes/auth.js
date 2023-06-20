const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userSchema = require('../models/User');
const Role = require('../models/Role');

const verify = require('../middlewares/verifySignup');

const authJwt = require('../middlewares/authJwt');

router.post('/signUP', [
    // authJwt.verifyToken,
    // authJwt.isAdmin,
    verify.checkDuplicateUser,
    verify.checkRolesExisted
    ], async (req, res) => {
    const { username, nombre, password} = req.body;

    const newUser = new userSchema({
        username,
        nombre,
        password: await userSchema.encryptPassword(password)
    })

    const role = await Role.findOne({name: "moderator"});
    newUser.roles = [role._id];


    const savedUser = await newUser.save()
    .then(data => {
        console.log(data);
        const token = jwt.sign({id: data._id}, process.env.JWT_KEY, {
            expiresIn: '30d'
        })
        res.json({token})
        
    })
    .catch((err) => {
        res.json(err);
    });
    
})

router.post('/signin', async (req, res) => {

    const userFound = await userSchema.findOne({username: req.body.username}).populate("roles")

    if(!userFound){
        return res.status(400).json({message: "Usuario no registrado"}) 
    }

    const matchPass = await userSchema.comparePassword(req.body.password, userFound.password);

    if(!matchPass){
        return res.status(400).json({token: null, message: "Contraseña incorrecta"}) 
    }

    const token = jwt.sign({id: userFound._id}, process.env.JWT_KEY, {
        expiresIn: '30d'
    })

    res.json({token})
})

module.exports = router;
const express = require("express");
const ticketSchema = require('../models/ticket');

const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken")
const authJwt = require('../middlewares/authJwt');

// Crear ticket
router.post("/crear", [authJwt.verifyToken, authJwt.isModerador], async (req, res) => {

    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    const userFound = await User.findById(decoded.id, { password: 0 });

    const {
        nombres,
        apellidos,
        edad,
        tipoBoleto,
        costo,
        pagado
    } = req.body;

    const fechaCompra = new Date();

    const ticket = new ticketSchema({
        nombres: nombres,
        apellidos: apellidos,
        edad: edad,
        tipoBoleto: tipoBoleto,
        fechaCompra: fechaCompra,
        costo: costo,
        pagado: pagado,
        estado: true,
        vendedor: userFound.nombre
    });

    ticket.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
    
})

router.get("/", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    ticketSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}))
})

router.get("/:id", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    const { id } = req.params;
    ticketSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}))
})
 
router.put("/:id", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    const { id } = req.params;
    ticketSchema
        .updateOne({_id: id}, {estado: false})
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}))
})

module.exports = router;
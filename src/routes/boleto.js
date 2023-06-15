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
        pagado,
        asistencia
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
        vendedor: userFound.nombre,
        asistencia: asistencia
    });

    ticket.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

})

router.get("/", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    ticketSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})

router.get("/allAsistencias", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    ticketSchema
        .aggregate([
            {
                $match: {
                    asistencia: {
                        $elemMatch: { asistio: true }
                    }
                }
            },
            {
                $addFields: {
                    totalAsistencias: {
                        $size: {
                            $filter: {
                                input: '$asistencia',
                                as: 'asistencia',
                                cond: { $eq: ['$$asistencia.asistio', true] }
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    $expr: {
                        $eq: ["$totalAsistencias", { $size: "$asistencia" }]
                    }
                }
            }
        ])
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})

router.get("/:id", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    const { id } = req.params;
    ticketSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})

router.get("/usuario/:vendedor", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    const { vendedor } = req.params;
    ticketSchema
        .find({ vendedor: vendedor })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})

// CAMBIAR ESTADO A INACTIVO
router.put("/estado/:id", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    const { id } = req.params;
    ticketSchema
        .updateOne({ _id: id }, { estado: false })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})

// CAMBIAR ASISTENCIA
router.put("/asistencia/:id", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    const { id } = req.params;
    const { fechaAsistencia } = req.body;
    ticketSchema
        .findOneAndUpdate({ _id: id, 'asistencia.fecha': fechaAsistencia },
            { $set: { 'asistencia.$.asistio': true } },
            { new: true })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})


// CAMBIAR PAGO
router.put("/pago/:id", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    const { id } = req.params;
    const { pago } = req.body;
    ticketSchema
        .updateOne({ _id: id }, { pagado: pago })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})

module.exports = router;
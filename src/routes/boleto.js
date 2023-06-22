const express = require("express");
const ticketSchema = require('../models/ticket');

const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken")
const authJwt = require('../middlewares/authJwt');

// Crear ticket
router.post("/crear", [authJwt.verifyToken], async (req, res) => {

    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    const userFound = await User.findById(decoded.id, { password: 0 });

    const {
        nombres,
        apellidos,
        email,
        carrera,
        tipoBoleto,
        costo,
        pagado,
        asistencia,
        semestre
    } = req.body;

    const ticket = new ticketSchema({
        nombres,
        apellidos,
        tipoBoleto,
        fechaCompra: new Date(),
        costo,
        pagado,
        estado: true,
        vendedor: userFound.username,
        asistencia,
        email,
        carrera,
        semestre
    });

    ticket.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

})

router.get("/", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const nombres = req.query.nombre || "";
    const pagination = req.query.pagination === "false" ? false : true;

    ticketSchema.paginate(nombres ? {nombres: {$regex: new RegExp(nombres, 'i')}} : {}, { limit, page, nombres, pagination }).then((result) => {
        res.json(result)
        // process the paginated result.
      }).catch((error) =>  res.status(500).json({ message: error }));
})

router.get("/allAsistencias", [authJwt.verifyToken, authJwt.isModerador], (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const nombres = req.query.nombre || "";
    const pagination = req.query.pagination === "false" ? false : true;
    
    const myAggregate = ticketSchema
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
                },
                nombres: {$regex: new RegExp(nombres, 'i')}
            }
        }
    ]);

    ticketSchema.aggregatePaginate(myAggregate, { limit, page, nombres, pagination })
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

router.get("/usuario/:vendedor", [authJwt.verifyToken], (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const nombres = req.query.nombre || "";
    const pagination = req.query.pagination === "false" ? false : true;
    const { vendedor } = req.params;

    ticketSchema.paginate({vendedor: {$eq: vendedor}, nombres: {$regex: new RegExp(nombres, 'i')}}, { limit, page, nombres, pagination }).then((result) => {
        res.json(result)
        // process the paginated result.
      }).catch((error) =>  res.status(500).json({ message: error }));
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

    console.log(fechaAsistencia);
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
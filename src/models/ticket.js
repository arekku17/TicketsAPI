const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    carrera: {
        type: String
    },
    edad: {
        type: Number,
        required: true
    },
    tipoBoleto: {
        type: String,
        required: true
    },
    fechaCompra: {
        type: Date,
        required: true
    },
    costo: {
        type: Number,
        required: true
    },
    pagado: {
        type: Number,
        required: true
    },
    vendedor: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        required: true
    },
    asistencia: {
        type: [
            {
                fecha: {type: Date, required: true},
                asistio: {type: Boolean, default: false}
            }
        ],
        required: true
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);
const express = require('express');
const mongoose = require('mongoose');
const boletoRoutes = require('./routes/boleto');
const initialSetup = require('./libs/initialSetup');
const rutaAuth = require('./routes/auth');


require("dotenv").config();


const app = express();


const port = process.env.PORT || 9000;

// Middleware
app.use(express.json());
app.use('/api/boleto', boletoRoutes); 
app.use('/api/auth', rutaAuth);

// RUTAS
app.get("/", (req, res) => {
    res.send("Bienvenido al API");
})

// Creación de Roles defualt
initialSetup.createRoles();

// MongoDB Conexión

mongoose.connect(
    process.env.MONGODB_URI
).then(() => console.log("Conexión a MongoDB Atlas"))
.catch((err) => console.log(err));


app.listen(port, () => console.log('Server prendido en el puerto ', port))


const express = require('express');
const boletoRoutes = require('./src/routes/boleto');
const initialSetup = require('./src/libs/initialSetup');
const rutaAuth = require('./src/routes/auth');
const rutaUser = require('./src/routes/user')
const morgan = require('morgan');
const cors = require('cors')


require("dotenv").config();


const app = express();


const port = process.env.PORT || 5000;

// Importar conexión mongoDB
const archivoBD = require('./conection');

app.use(cors());
app.use(morgan('dev'));

//Importar body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:'true'}));

// Middleware
app.use(express.json());
app.use('/api/boleto', boletoRoutes); 
app.use('/api/auth', rutaAuth);
app.use('/api/user', rutaUser);

// RUTAS
app.get("/", (req, res) => {
    res.send("Bienvenido al API");
})

// Creación de Roles defualt
initialSetup.createRoles();

// MongoDB Conexión




app.listen(port, () => console.log('Server prendido en el puerto ', port))


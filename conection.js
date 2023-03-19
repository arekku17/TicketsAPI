require("dotenv").config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(error => console.error(error));
mongoose.set('strictQuery', false);

const objetobd = mongoose.connection;
objetobd.on('connected', () => {console.log('Conexión correcta')});
objetobd.on('error', () => {console.log('Error en la conexión')});

module.exports = mongoose;
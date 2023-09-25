const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./db/config');
const cors = require('cors');

//Crea el servidor de express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors())

app.use( express.static('public'));

//rutas
// app.get('/', (req, res) => {
//     console.log('se requier /');

//     res.json({
//         ok: true
//     })
// })
//Rutas

//Lectura y parseo del body
app.use( express.json());

app.use('/api/auth', require('./routes/auth'));

//Escucha peticiones
app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo')
})

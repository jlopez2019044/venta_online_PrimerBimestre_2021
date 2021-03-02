'use strict'

//VARIABLES GLOBALES
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

//IMPORTACION RUTAS
const usuario_ruta = require('./src/rutas/usuarios.rutas');
const categoria_ruta = require('./src/rutas/categorias.rutas');

//MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CABECERAS
app.use(cors());

//CARGA DE RUTAS
app.use('/api/usuarios',usuario_ruta);
app.use('/api/categorias',categoria_ruta);

//EXPORTAR
module.exports = app;

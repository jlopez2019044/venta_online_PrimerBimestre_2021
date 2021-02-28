'use strict'

//VARIABLES GLOBALES
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

//IMPORTACION RUTAS

//MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CABECERAS
app.use(cors());

//EXPORTAR
module.exports = app;

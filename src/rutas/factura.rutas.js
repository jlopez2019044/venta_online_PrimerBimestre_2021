'use strict'

//IMPORTACIONES
const express = require("express");
const facturaControlador = require('../controladores/factura.controlador');

//MIDDLEWARES
var md_autenticacion = require('../middlewares/authenticated');

//RUTAS
var api = express.Router();

module.exports = api;
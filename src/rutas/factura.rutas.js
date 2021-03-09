'use strict'

//IMPORTACIONES
const express = require("express");
const facturaControlador = require('../controladores/factura.controlador');

//MIDDLEWARES
var md_autenticacion = require('../middlewares/authenticated');

//RUTAS
var api = express.Router();
api.get('/crearFactura',md_autenticacion.ensureAuth,facturaControlador.crearFactura);
api.get('/facturasPorUsuario/:idUsuario',md_autenticacion.ensureAuth,facturaControlador.facturasPorUsuario);

module.exports = api;
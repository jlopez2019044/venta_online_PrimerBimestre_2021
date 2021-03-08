'use strict'

//IMPORTACIONES
const express = require("express");
const carritoControlador = require('../controladores/carrito.controlador');

//MIDDLEWARES
var md_autenticacion = require('../middlewares/authenticated');


//RUTAS
var api = express.Router();
api.post('/agregarCarrito',md_autenticacion.ensureAuth,carritoControlador.agregarCarrito);

module.exports = api;
'use strict'

//IMPORTACIONES
const express = require("express");
const categoriaControlador = require("../controladores/categoria.controlador");

//MIDDLEWARES
var md_autenticacion = require('../middlewares/authenticated');
const categoriasModel = require('../modelos/categorias.model');

//RUTAS
var api = express.Router();
api.post('/registrarCategoria',md_autenticacion.ensureAuth,categoriaControlador.registrarCategoria);
api.post('/editarCategoria/:idCategoria',md_autenticacion.ensureAuth,categoriaControlador.editarCategoria);

module.exports = api;
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
api.put('/editarCategoria/:idCategoria',md_autenticacion.ensureAuth,categoriaControlador.editarCategoria);
api.post('/buscarPorCategoria',md_autenticacion.ensureAuth,categoriaControlador.buscarPorCategoria);
api.delete('/eliminarCategoria/:idCategoria',md_autenticacion.ensureAuth,categoriaControlador.eliminarCategoria);
api.get('/obtenerCategorias',md_autenticacion.ensureAuth,categoriaControlador.obtenerCategorias);

module.exports = api;
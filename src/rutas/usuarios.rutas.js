'use strict'

//IMPORTACIONES
const express = require("express");
const usuarioControlador = require('../controladores/usuario.controlador');

//MIDDLEWARES
var md_autenticacion = require('../middlewares/authenticated');
const usuariosModel = require('../modelos/usuarios.model');

//RUTAS
var api = express.Router();
api.post('/login',usuarioControlador.login);
api.post('/registrarAdministrador',md_autenticacion.ensureAuth,usuarioControlador.agregarUsuario);
api.post('/registrarCliente',usuarioControlador.registrarCliente);

module.exports = api;
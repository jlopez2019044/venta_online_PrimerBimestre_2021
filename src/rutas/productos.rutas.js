'use strict'

//IMPORTACIONES
const express = require("express");
const productoControlador = require('../controladores/producto.controlador');
 
//MIDDLEWARES
var md_autenticacion = require('../middlewares/authenticated');
var productosModel = require('../modelos/productos.model');

//RUTAS
var api = express.Router();
api.post('/registrarProducto',md_autenticacion.ensureAuth,productoControlador.registrarProducto);
api.put('/editarProducto/:idProducto',md_autenticacion.ensureAuth,productoControlador.editarProducto);
api.delete('/eliminarProducto/:idProducto',md_autenticacion.ensureAuth,productoControlador.eliminarProducto)
api.get('/listarProductos',productoControlador.listarProductos);
api.get('/buscarProductoId/:idProducto',productoControlador.buscarProductoId)
api.post('/buscarProductoNombre',md_autenticacion.ensureAuth,productoControlador.buscarNombreProducto);
api.get('/buscarProductosAgotados',md_autenticacion.ensureAuth,productoControlador.buscarProductosAgotados);
api.get('/controlProductosStock/:idProducto',md_autenticacion.ensureAuth,productoControlador.controlStock);
api.get('/productosMasVendidos',md_autenticacion.ensureAuth,productoControlador.productosMasVendidos);

module.exports = api;
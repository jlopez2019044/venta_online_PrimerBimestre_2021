'use strict'

const Producto = require('../modelos/productos.model');
const jwt = require('jwt-simple');
const bcrypt = require("bcrypt-nodejs");
const usuariosModel = require('../modelos/usuarios.model');
const categoriasModel = require('../modelos/categorias.model');

function registrarProducto(req,res) {

    let productoModel = new Producto();
    var params = req.body;

    if(req.user.rol === 'ROL_ADMIN'){

        productoModel.nombre = params.nombre;
        productoModel.precio = params.precio;
        productoModel.cantidad = params.cantidad;
        productoModel.idCategoria = params.idCategoria;

        Producto.find({$or:[
            {nombre: productoModel.nombre}
        ]}).exec((err,productoEncontrado)=>{

            if(err) return res.status(500).send({mensaje: 'Error en la petición del producto'});

            if(productoEncontrado && productoEncontrado.length>=1){
                return res.status(500).send({mensaje: 'El producto ya está creado'});
            }else{

                if(productoModel.cantidad<0) return res.status(500).send({mensaje: 'La cantidad no puede ser menor a cero'})

                productoModel.save((err,productoGuardado)=>{

                    if(err) return res.status(500).send({mensaje: 'Error al guardar el producto'});

                    if(productoGuardado){
                        return res.status(200).send({productoGuardado});
                    }else{
                        return res.status(500).send({mensaje: 'No se ha podido registrar el producto'})
                    }

                })

            }

        })

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos para crear un producto'})
    }
    
}

function editarProducto(req,res) {

    var idProducto = req.params.idProducto;
    var params = req.body;

    delete params.popularidad;

    if(req.user.rol === 'ROL_ADMIN'){

        if(params.cantidad <0) return res.status(500).send({mensaje: 'No se puede agregar cantidad negativa'})

        Producto.findByIdAndUpdate(idProducto,params,{new: true, useFindAndModify:false},(err,productoActualizado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!productoActualizado) return res.status(500).send({mensaje: 'No se ha podido actualizar el producto'});

            return res.status(200).send({productoActualizado})

        })

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos para editar el producto'})
    }
    
}

 function eliminarProducto(req,res) {

    var idProducto = req.params.idProducto;

    if(req.user.rol ==='ROL_ADMIN'){

        Producto.findByIdAndDelete(idProducto,(err,productoEliminado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la petición'});
            if(!productoEliminado) return res.status(500).send({mensaje: 'Error al eliminar el producto'});

            return res.status(200).send({productoEliminado});
         })

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos para eliminar el producto'})
    }
    
}

function listarProductos(req,res) {

    Producto.find((err,productosEncontrados)=>{
        
        if(err) return res.status(500).send({mensaje: 'Error en la petición'})
        if(!productosEncontrados) return res.status(500).send({mensaje: 'Error al hacer encontrar productos'})
        return res.status(200).send({productosEncontrados})

    })

}

function buscarProductoId(req,res) {

    var idProducto = req.params.idProducto;

    Producto.findById(idProducto,(err,productoEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la petición'})
        if(!productoEncontrado) return res.status(500).send({mensaje: 'Error al hacer encontrar productos'})
        return res.status(200).send({productoEncontrado})
    })
    
}

function buscarNombreProducto(req,res) {
    
    var params = req.body;
    var nombreProducto = params.nombre;

    Producto.findOne({nombre: nombreProducto},(err,productoEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la petición'});

        if(!productoEncontrado) return res.status(500).send({mensaje: 'Error en la peticion de producto'})

        return res.status(200).send({productoEncontrado});
    })

}

function buscarProductosAgotados(req,res) {
    
    if(req.user.rol === 'ROL_ADMIN'){
        Producto.find({cantidad: 0},(err,productosAgotados)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!productosAgotados) return res.status(500).send({mensaje: 'Error al encontrar los productos'})

            if(productosAgotados.length==0){
                return res.status(500).send({mensaje: 'No existen productos agotados'})
            }else{
                return res.status(200).send({productosAgotados});
            }
    
        })
    
    }else{
        return res.status(500).send({mensaje: 'No tiene los permisos para hacer esta accion'})
    }

}

function controlStock(req,res) {

    var productoId = req.params.idProducto;

    if(req.user.rol === 'ROL_ADMIN'){

        Producto.findById(productoId,(err,productoEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!productoEncontrado) return res.status(500).send({mensaje: 'Error al encontrar el producto'});
    
            if(productoEncontrado.cantidad >=1){
                return res.status(200).send({mensaje: 'Existen productos en el stock'});
            }else{
                return res.status(200).send({mensaje: 'No existen productos en el stock'});
            }
    
    
        })

    }else{
        return res.status(500).send({mensaje: 'No tiene los permisos suficientes para realizar esta accion'})
    }
    
}

module.exports ={
    registrarProducto,
    editarProducto,
    eliminarProducto,
    listarProductos,
    buscarProductoId,
    buscarNombreProducto,
    buscarProductosAgotados,
    controlStock
}
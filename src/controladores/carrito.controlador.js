'use strict'

const Carrito = require('../modelos/carritos.model');
const Producto = require('../modelos/productos.model');
const jwt = require('../servicios/jwt');

function agregarCarrito(req,res){

    var params = req.body;

    Producto.findById(params.idProducto,(err, productoEncontrado)=>{

        if(!productoEncontrado) return res.status(500).send({mensaje: 'No existe el producto seleccionado'});

        if(params.cantidad<=0){
            return res.status(500).send({mensaje: 'No se puede agregar esa cantidad de productos'})
        }else{

            if(params.cantidad > productoEncontrado.cantidad){
                return res.status(500).send({mensaje: 'No existen suficientes productos en stock'})
            }else{

                Carrito.findOneAndUpdate({idUsuario: req.user.sub},{$push: {productos: {idProductos: params.idProducto, cantidad: params.cantidad}}},
                {new: true, useFindAndModify: false},(err, carritoAgregado)=>{
            
                    Producto.findById(params.idProducto,(err,productoEncontradoV)=>{
        
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion del producto'});
                        if(!productoEncontradoV) return res.status(500).send({mensaje: 'No existe el producto seleccionado'});
        
                        var cantidadM  = params.cantidad;
                        var totalM = productoEncontrado.precio;
                        var totalCarrito = carritoAgregado.total;

                        var totalAgregar = totalCarrito +(cantidadM*totalM);

                        Carrito.findOneAndUpdate({idUsuario: req.user.sub},{total:totalAgregar},{new: true, useFindAndModify: false},
                        (err,carritoTotal)=>{
                            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                            if(!carritoTotal) return res.status(500).send({mensaje: 'Error al agregar el total'});

                            return res.status(200).send({carritoTotal});

                        })
            
                    })
            
                })

            }

        }

    })

}

module.exports = {
    agregarCarrito,
}

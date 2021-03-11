'use strict'

const Categoria = require('../modelos/categorias.model');
const Productos = require('../modelos/productos.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../servicios/jwt');
const usuariosModel = require('../modelos/usuarios.model');

function registrarCategoria(req,res){

    let categoriaModel = new Categoria();
    var params = req.body;

    if(req.user.rol === 'ROL_ADMIN'){

        categoriaModel.nombre = params.nombre;
        categoriaModel.descripcion = params.descripcion;

        Categoria.find({$or: [
            {nombre: categoriaModel.nombre}
        ]}).exec((err, categoriaEncontrada)=>{

            if(err) return res.status(500).send({mensaje: 'Error en la peticion de la categoria'})
            
            if(categoriaEncontrada && categoriaEncontrada.length>=1){
                return res.status(500).send({mensaje: 'La categoria ya esta creada'})
            }else{
                
                categoriaModel.save((err,categoriaGuardada)=>{
                    if(err) return res.status(500).send({mensaje: 'Error al guardar la categoria'});

                    if(categoriaGuardada){
                        return res.status(200).send({categoriaGuardada})
                    }else{
                        return res.status(500).send({mensaje: 'No se ha podido registrar la categoria'})
                    }

                })

            }

        })

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos para poder crear una categoría'});
    }

}

function editarCategoria(req,res) {

    var idCategoria = req.params.idCategoria;
    var params = req.body;

    if(req.user.rol ==='ROL_ADMIN'){

        Categoria.findByIdAndUpdate(idCategoria,params,{new: true, useFindAndModify:false},(err,categoriaActualizada)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!categoriaActualizada) return res.status(500).send({mensaje: 'No se ha podido actualizar la categoria'});

            return res.status(200).send({categoriaActualizada})

        })

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos para poder editar la categoria'})
    }
    
}

function buscarPorCategoria(req,res) {
    
    var params = req.body;
    var categoriaNombre = params.nombre;
    var categoriaId

    Categoria.findOne({nombre: categoriaNombre},(err,categoriaEncontrada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!categoriaEncontrada) return res.status(500).send({mensaje: 'Error al buscar la categoria'});

        categoriaId = categoriaEncontrada._id;

        Productos.find({idCategoria: categoriaId},(err,productosEncontrados)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
            if(!productosEncontrados) return res.status(500).send({mensaje: 'Error al encontrar los productos'});

            return res.status(200).send({productosEncontrados})
        })

    })
}

function eliminarCategoria(req,res) {

    if(req.user.rol ==='ROL_ADMIN'){


    var categoriaId = req.params.idCategoria;

    Categoria.findById(categoriaId,(err,categoriaEncontradaSi)=>{

        if(categoriaEncontradaSi){
            
            crearCategoriaDefault;

            Categoria.findOne({nombre: 'Default'},(err,categoriaEncontradaDefault)=>{


                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!categoriaEncontradaDefault) return res.status(500).send({mensaje: 'No existe la categoria por default'});
    
                    Productos.updateMany({idCategoria:categoriaId},{idCategoria:categoriaEncontradaDefault._id},(err,productosCambiados)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
                    })
    
                Categoria.findByIdAndDelete(categoriaId,(err,categoriaEliminada)=>{
                    if(err) return res.status(500).send({mensaje: 'Error al en la peticion'});
                    if(!categoriaEliminada) return res.status(500).send({mensaje: 'Error al eliminar la categoria'});
                    return res.status(200).send({categoriaEliminada}); 
                })
    
            })

        }else{
            return res.status(500).send({mensaje: 'La categoria no se ha encontrado'});
        }

    })

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos necesarios para eliminar la categoria'})
    }
    
}

function crearCategoriaDefault(req,res) {
    
    var categoriaModel = new Categoria();
    categoriaModel.nombre = 'Default';
    categoriaModel.descripcion = 'Esta es la categoria por defecto';
    
    Categoria.find({$or:[
        {nombre: categoriaModel.nombre}
    ]}).exec((err, categoriasEncontradas)=>{

        if(err) return res.status(500).send({mensaje: 'Error en la peticion de la categoria por defecto'});
        if(categoriasEncontradas && categoriasEncontradas.length<1){

            categoriaModel.save((err,categoriaGuardada)=>{
                if(err) return res.status(500).send({mensaje: 'Error al guardar la categoria por defecto'});
            })

        }
    })

}

function obtenerCategorias(req,res) {

    Categoria.find((err,categoriasEncontradas)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!categoriasEncontradas) return res.status(500).send({mensaje: 'Error al buscar categorias'});

        return res.status(200).send({categoriasEncontradas});

    })
    
}

module.exports = {
    registrarCategoria,
    editarCategoria,
    buscarPorCategoria,
    eliminarCategoria,
    obtenerCategorias
}
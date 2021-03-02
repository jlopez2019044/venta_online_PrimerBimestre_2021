'use strict'

const Categoria = require('../modelos/categorias.model');
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

module.exports = {
    registrarCategoria,
    editarCategoria
}
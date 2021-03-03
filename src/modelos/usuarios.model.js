'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    usuario: String,
    password: String,
    rol: String,
    carrito:{
        productos:[{
            idProducto: {type: Schema.Types.ObjectId, ref: 'productos'},
            cantidad: {type: Number, default: 0}
        }],
        total: {type: Number, default: 0}
    }
})

module.exports = mongoose.model('usuarios',UsuarioSchema);
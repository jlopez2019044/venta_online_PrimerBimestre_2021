'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productoSchema = Schema({
    nombre: String,
    precio: Number,
    cantidad: {type: Number, default: 0},
    popularidad: {type: Number, default: 0},
    idCategoria: {type: Schema.Types.ObjectId, ref:'categorias'}
})

module.exports = mongoose.model('productos',productoSchema);
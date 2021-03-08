'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var facturaSchema = Schema({
    fecha: String,
    total: Number,
    productos: [{
        idProductos: {type: Schema.Types.ObjectId, ref: 'productos'},
        cantidad: {type: Number, default: 0}
    }]
})

module.exports = mongoose.model('facturas',facturaSchema);
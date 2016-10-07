'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

/**
 * Product Schema
 */


var ProductSchema = new Schema({
    user:{
      type:Number, ref:'Users',required:true
    },
    loc: {//센터 좌표
        type: {type: String},
        coordinates: []
    },
    sort:{
        type:String,required:true
    },
    photo:[{
        type:String,required:true
    }],
    title:{
        type:String,required:true
    },
    contents:{
        type:String,required:true
    }

}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
ProductSchema.index({"loc": '2dsphere'});
ProductSchema.plugin(autoIncrement.plugin, {
    model: 'Products'
});


module.exports = mongoose.model('Products', ProductSchema);
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

/**
 * Share Schema
 */


var ShareSchema = new Schema({
    lister:{ type:Number, ref:'Users',required:true },
    renter:{ type:Number, ref:'Users',required:true },
    product:{type:Number, ref:'Products',required:true },
    sort:{ type:String,required:true },
    status:{ type:String,required:true ,default:'RR'},//(RR 대기 , RC 취소 , RS 승인)
    startAt:{type:Date,required:true,default:Date.now()},
    endAt:{type:Date,default:null}
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
ShareSchema.plugin(autoIncrement.plugin, {
    model: 'Share'
});


module.exports = mongoose.model('Share', ShareSchema);

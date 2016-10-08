'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

/**
 * Feed Schema
 */


var FeedSchema = new Schema({
    user:{
      type:Number, ref:'Users',required:true
    },
    loc: {//센터 좌표
        type: {type: String},
        coordinates: []
    },
    sido:{
        type:String,required:true
    },
    sigungu:{
        type:String,required:true
    },
    sigungu_code:{
        type:Number,required:true
    },
    photo:[{
        type:String,required:true
    }],
    contents:{
        type:String,required:true
    }

}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
FeedSchema.index({"loc": '2dsphere'});
FeedSchema.plugin(autoIncrement.plugin, {
    model: 'Feeds'
});


module.exports = mongoose.model('Feeds', FeedSchema);

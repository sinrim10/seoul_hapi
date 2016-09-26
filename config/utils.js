/**
 * Created by jk on 2016-06-21.
 */

'use strict';
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj ==='number') return false;
    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handleA
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
function and(filter){
    var and = [];

    if(!isEmpty(filter)){
        Object.keys(filter).forEach(function(key){
            if(typeof filter[key] === 'object'){
                if(filter[key].length > 0){
                    var json = {};
                    json[key] = {$in:filter[key]};
                    and.push(json);
                }
            }else{
                if(!isEmpty(filter[key])){
                    var json = {};
                    json[key] = filter[key];
                    and.push(json);

                }
            }
        });
    }
    if(isEmpty(and)){
        and.push({});
    }
    return and;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function isField(key,array){
    if(Array.isArray(array)){
        if(array.indexOf(key)==-1){
            return true;
        }
    }else{
        return false;
    }
}

/*
* 같은 배열인지 비교
* */
var compare = function(a, b){
    var compare = null;
    if(Array.isArray(b)){
        compare = a.map(function(v,i){
            if(b.indexOf(v)==-1){
                return false;
            }else{
                return true;
            }
        });

    }
    console.log('compare ' , compare);
    return compare.indexOf(false) != -1 ? false:true;
};


Date.prototype.format = function format(f) {
    if (!this.valueOf()) return " ";

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
    var h =0;
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};



/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */

function errors(errors) {
    var keys = Object.keys(errors)
    var errs = []

    // if there is no validation error, just display a generic error
    if (!keys) {
        return ['Oops! There was an error']
    }

    keys.forEach(function (key) {
        if (errors[key]) errs.push(errors[key].message)
    })

    return errs
}

/**
 * Index of object within an array
 *
 * @param {Array} arr
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

 function indexof(arr, obj) {
    var index = -1; // not found initially
    var keys = Object.keys(obj);
    // filter the collection with the given criterias
    var result = arr.filter(function (doc, idx) {
        // keep a counter of matched key/value pairs
        var matched = 0;

        // loop over criteria
        for (var i = keys.length - 1; i >= 0; i--) {
            if (doc[keys[i]] === obj[keys[i]]) {
                matched++;

                // check if all the criterias are matched
                if (matched === keys.length) {
                    index = idx;
                    return idx;
                }
            }
        };
    });
    return index;
}

/**
 * Find object in an array of objects that matches a condition
 *
 * @param {Array} arr
 * @param {Object} obj
 * @param {Function} cb - optional
 * @return {Object}
 * @api public
 */

function findByParam(arr, obj, cb) {
    var index = exports.indexof(arr, obj)
    if (~index && typeof cb === 'function') {
        return cb(undefined, arr[index])
    } else if (~index && !cb) {
        return arr[index]
    } else if (!~index && typeof cb === 'function') {
        return cb('not found')
    }
    // else undefined is returned
}


module.exports = {
    isEmpty: isEmpty, //빈객체 검사
    and : and,
    shuffle : shuffle,
    isField:isField,
    compare: compare,
    errors:errors,
    findByParam:findByParam,
    indexof:indexof
};

"use strict"

const util = require('util');

module.exports = (obj, replacer = null, space = 0) => {
    return JSON.stringify(util.inspect(obj), replacer, space);
}
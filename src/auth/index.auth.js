'use strict';

console.log('index auth can you hear me?')
const {router} = require('./router');
const {localStrategy, jwtStrategy} = require('./strategy-auth');

module.exports = {router, localStrategy, jwtStrategy};

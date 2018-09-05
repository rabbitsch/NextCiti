'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://citi:passw0rd@ds145752.mlab.com:45752/nextciti';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/testnode_capstone';
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET || 'secret';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
// console.log(DATABASE_URL)

const ENV = process.env.NODE_ENV || 'production';
const config = require('../knexfile.js')[ENV];
const knex = require('knex')(config);

knex.migrate.latest(config);

module.exports = knex;

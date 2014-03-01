/**
 * Usage example:
 *
 *      ./node_modules/.bin/knex --config etc/knexmigrate.js migrate:make migrationName
 */


module.exports = {

    database: require(__dirname + '/../app/server/boot.js').DB.knex

  , directory: __dirname + '/migrations'

};

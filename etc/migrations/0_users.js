
exports.up = function(knex) {

  return knex.schema.createTable('users', function(t) {

    t.increments();
    t.timestamps();
    t.string('email').unique().index();
    t.string('password');

    t.string('first_name');
    t.string('last_name');
  });

};






exports.down = function(knex) {

  return knex.schema.dropTable('users');

};


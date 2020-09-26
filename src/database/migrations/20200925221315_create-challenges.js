exports.up = function (knex) {
  return knex.schema.createTable('challenges', (table) => {
    table.increments('id').primary();
    table.string('description');
    table.integer('level');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('challenges');
};

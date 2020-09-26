exports.up = function (knex) {
  return knex.schema.createTable('score', (table) => {
    table.increments('id').primary();
    table.integer('user_id');
    table.integer('challenge_id');
    table.integer('point');
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('score');
};

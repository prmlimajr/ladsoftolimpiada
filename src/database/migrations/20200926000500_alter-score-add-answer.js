exports.up = function (knex) {
  return knex.schema.alterTable('challenges', (table) => {
    table.string('answer').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table.dropColumn('answer');
};

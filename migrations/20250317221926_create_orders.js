exports.up = function (knex) {
  return knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.string('customer_name').notNullable();
    table.string('address').notNullable();
    table.integer('status').notNullable().defaultTo(0);
    table.integer('created_by').unsigned().notNullable().references('id').inTable('users'); // Correção
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('orders');
};

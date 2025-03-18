exports.seed = async function (knex) {
  await knex('users').del();
  await knex('users').insert([
    {
      first_name: 'Carlos',
      last_name: 'Aedo',
      email: 'carlosalexandreaedo@gmail.com',
      password: '$2b$12$a4/fR7Ye5XETwtzgBupr1u8pVErgN4xWQUYk5o82yjGBv3KllG8XO',
      user_group: 'superuser',
    },
  ]);
};

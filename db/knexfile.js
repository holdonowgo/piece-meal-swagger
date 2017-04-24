

module.exports = {

  development: {
    client: "pg",
    connection: "postgres://localhost/piecemeal_dev",
    migrations: {
      tableName: "knex_migration"
    }
  },

  test: {
    client: "pg",
    connection: "postgres://localhost/piecemeal_test",
    migrations: {
      tableName: "knex_migration"
    }
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL
  }

};

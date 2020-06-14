module.exports = {
  development: {
    username: "root",
    password: "Tobiloba",
    database: "books_metadata",
    host: "localhost",
    dialect: "mysql",
    operatorsAliases: false,
    dialectOptions: {
      options: {
        requestTimeout: 3000,
      },
    },
    pool: {
      min: 0,
      max: 5,
      idle: 100000,
      acquire: 100000,
      evict: 10000,
      handleDisconnects: true,
    },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: false,
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: false,
  },
};

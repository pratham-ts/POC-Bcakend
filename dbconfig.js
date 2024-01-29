const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: 1433,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
  },
};

module.exports = config;

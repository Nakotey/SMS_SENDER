const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "Entai",
    host: "localhost",
    port: 5432,
    database: "smssender"
});

module.exports = pool;




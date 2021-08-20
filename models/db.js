const Pool = require("pg").Pool;

const pool = new Pool({
    user: "mjbzaofxwhvcgd",
    password: "ce2c575df3522b0d0a2d4339eac8df4afcae6f87d589f43cf76918bbeb8dbfb1",
    host: "1@ec2-54-156-60-12.compute-1.amazonaws.com",
    port: 5432,
    database: "d23uigunhfndik",

});

module.exports = pool;




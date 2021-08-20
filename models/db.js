const Pool = require("pg").Pool;

const pool = new Pool({
    user: "mjbzaofxwhvcgd",
    host: "ec2-54-156-60-12.compute-1.amazonaws.com",
    port: 5432,
    database: "d23uigunhfndik",

    

});

module.exports = pool;




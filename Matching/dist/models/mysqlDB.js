"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
let mysql_connection = mysql.createConnection({
    host: 'mysqldbinstance2.ctergpgkzn3p.us-west-2.rds.amazonaws.com',
    user: 'masterdb',
    password: 'advertisers2018',
    database: 'configuration'
});
mysql_connection.connect();
exports.default = mysql_connection;
//# sourceMappingURL=mysqlDB.js.map
import * as mysql from 'mysql';

let mysql_connection = mysql.createConnection({
    host     : 'mysqldbinstance2.ctergpgkzn3p.us-west-2.rds.amazonaws.com',
    user     : 'masterdb',
    password : 'advertisers2018',
    database : 'configuration'
});

mysql_connection.connect();

export default mysql_connection;
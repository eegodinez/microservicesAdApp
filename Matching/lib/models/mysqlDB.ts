import * as mysql from 'mysql';

let mysql_connection = mysql.createConnection({
    host     : 'mysqldatabase.cp5tg8bwqbz7.us-east-1.rds.amazonaws.com',
    user     : 'masterdb',
    password : 'advertisers2018',
    database : 'configuration'
});

mysql_connection.connect();

export default mysql_connection;
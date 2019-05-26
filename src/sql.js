var mysql      = require('mysql');
var connection = mysql.createConnection({
    // host     : 'SDN-WEB-P01',
    host     : 'localhost',
    socketPath: '/tmp/mysql.sock',
    user     : 'dflreader',
    password : 'etk',
    database : 'dfl2db'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: \n' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

connection.end()
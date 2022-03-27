const mysql = require('mysql');

module.exports = {
    dataBase: (sql, callback) => {
        let connection = mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.database
        })

        connection.connect()

        connection.query(sql, (error, results, fields) => {
            if (error) throw error
            connection.end(error => {
                if (error) throw error
                callback(results)
            })
        })
    }
}

const mysqlCon = require('../utils/database');

exports.logError = (code, error, rawError) => {
    const sql = `
        INSERT INTO error_log (code, error, raw_error)
        VALUES(${code}, '${error}', "${rawError}")
    `;

    mysqlCon.query(
        sql, 
        (error, results) => {
            // This should probably have a redundant system but I'm
            // leaving it here for now
            if (error) {
                console.log(error);
            } else {
                console.log('Error logged to database. ' + code);
            }

            return;
    });
}
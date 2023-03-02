const mysqlCon = require('../utils/database');

exports.addImage = (image, queryId) => {
    let sql = `
        INSERT INTO image (query_id, url)
        VALUES(${queryId}, '${image}')`;

    mysqlCon.query(
        sql, 
        (error, results) => {
            if (error) {
                console.log(error);
                return false;
            }

            console.log(results);
    });
}



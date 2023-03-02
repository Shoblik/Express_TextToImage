const mysqlCon = require('../utils/database');

exports.addImages = (images, queryId) => {
    let sql = `
        INSERT INTO image (query_id, url, created_at, updated_at)
        VALUES`;

    // build query so we don't need to do individual inserts
    for (let i = 0; i < images.length; i++) {
        
        sql += `(${queryId}, '${images[i].url}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
        
        if (i != images.length - 1) {
            sql += ',';
        }
    }

    mysqlCon.query(
        sql, 
        (error, results) => {
            if (error) {
                console.log(error);
                return false;
            }
    });
}



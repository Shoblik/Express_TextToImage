const mysqlCon = require('../utils/database');
const ImageModel = require('./ImageModel.js');
const ErrorModel = require('./ErrorModel.js');

exports.addQuery = async (query, ip, browser, os, platform, source, isMobile) => {
    const sql = `
        INSERT INTO query (\`query\`, ip, browser, os, platform, \`source\`, isMobile, created_at, updated_at)
        VALUES('${query}', '${ip}', '${browser}', '${os}', '${platform}', '${source}', '${isMobile}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `;

    await mysqlCon.query(
        sql, 
        (error, results) => {
            if (error) {
                // log error
                ErrorModel.logError(777, 'Insert query failed', error);
            } else {
                // figure out why we can read data right now
                // console.log('//////////////', data);

                if (data.images.length) {
                    const didInsert = ImageModel.addImages(data.images, results.insertId);
                }
            }
    });
}

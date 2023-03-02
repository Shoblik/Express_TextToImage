const mysqlCon = require('../utils/database');
const ImageModel = require('./ImageModel.js');
const ImageController = require('../controllers/ImageController.js');
const ErrorModel = require('./ErrorModel.js');

exports.addQuery = (query, ip, browser, os, platform, source, isMobile) => {

    isMobile = isMobile ? 1: 0;

    const sql = `
        INSERT INTO query (\`query\`, ip, browser, os, platform, \`source\`, isMobile, created_at, updated_at)
        VALUES('${query}', '${ip}', '${browser}', '${os}', '${platform}', '${source}', '${isMobile}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `;

    mysqlCon.query(
        sql, 
        (error, results) => {
            if (error) {
                // log error
                ErrorModel.logError(777, 'Insert query failed', error);
            } else {
                // figure out why we can read data right now
                // console.log('//////////////', data);

                if (data.images.length) {
                    ImageController.saveImages(data.images, results.insertId);
                }
            }
    });
}

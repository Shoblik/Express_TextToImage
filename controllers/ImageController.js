const QueryModel = require('../model/QueryModel.js');
const ErrorModel = require('../model/ErrorModel.js');
const ImageModel = require('../model/ImageModel.js');
const env = require('../utils/env.js');

exports.getImages = async (req, res) => {
    data = {
        success: true,
        errors: [],
        images: [],
        didAdd: false
    }

    const ip = req.socket.remoteAddress;
    const thisBrowser = req.useragent.browser;
    const os = req.useragent.os;
    const platform = req.useragent.platform;
    const source = req.useragent.source;
    const isMobile = req.useragent.isMobile;
    const imageStr = req.body.imageStr;
    
    if (!env.testing) {
        const { Configuration, OpenAIApi } = require("openai");
        const configuration = new Configuration({
            apiKey: env.apiKey,
        });
        const openai = new OpenAIApi(configuration);

        const response = await openai.createImage({
            prompt: imageStr,
            n: 1,
            size: "512x512",
        }).catch(error => {
            // API failed
            data.errors.push(error.response.data.error.message);

            // log error
            ErrorModel.logError(656, 'API failed', error.response.data.error.message);

            // Still want to keep track of who searched what
            QueryModel.addQuery(imageStr, ip, thisBrowser, os, platform, source, isMobile)

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        });

        data.images = response.data.data;
    } else {
        // TESTING ONLY
        data.images = [
            {"url": "http://localhost:3000/ai/1677805045291.jpg"}
        ];
    }
    
    //Also calls imageModel
    QueryModel.addQuery(imageStr, ip, thisBrowser, os, platform, source, isMobile);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
}

exports.saveImages = (images, queryId) => {
    const https = require('https'); // or 'https' for https:// URLs
    const fs = require('fs');

    for (let i = 0; i < images.length; i++) {
        
        let filename = Date.now() + '.jpg';
        let file = fs.createWriteStream('./public/ai/' + filename);
        let request = https.get(images[i].url, function(response) {
            response.pipe(file);

            // after download completed close filestream
            file.on("finish", () => {
                file.close();
                console.log(filename);
                console.log("Download Completed");
                
                // add it to the image database
                ImageModel.addImage('/public/ai/' + filename, queryId);
            });
        });
    }



    
}

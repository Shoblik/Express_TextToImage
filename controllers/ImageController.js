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
            n: 2,
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
            {"url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-p9CuILOWpRQcUQ2zdxhiIRLj/user-rij9MdwjxPUzTsloafnpLad3/img-MnsTMXLlo9PrCaQdlqMi7z3D.png?st=2023-03-02T01%3A08%3A08Z&se=2023-03-02T03%3A08%3A08Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-01T21%3A42%3A54Z&ske=2023-03-02T21%3A42%3A54Z&sks=b&skv=2021-08-06&sig=gVXt60HMORm2Gb826Ud%2Bd5Q2XgyseIMbpHYlUHln3wY%3D"}
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
        let file = fs.createWriteStream('./image/' + filename);
        let request = https.get(images[i].url, function(response) {
            response.pipe(file);

            // after download completed close filestream
            file.on("finish", () => {
                file.close();
                console.log(filename);
                console.log("Download Completed");
                
                // add it to the image database
                ImageModel.addImage('/image/' + filename, queryId);
            });
        });
    }



    
}

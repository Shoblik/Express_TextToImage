const QueryModel = require('../model/QueryModel.js');
const ErrorModel = require('../model/ErrorModel.js');
const env = require('../utils/env.js');
const testing = true;

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
    

    if (!testing) {
        const { Configuration, OpenAIApi } = require("openai");
        const configuration = new Configuration({
            apiKey: env.apiKey,
        });
        const openai = new OpenAIApi(configuration);

        const response = await openai.createImage({
            prompt: imageStr,
            n: 1,
            size: "256x256",
        }).catch(error => {
            // API failed
            data.errors.push(error.response.data.error.message);

            // log error
            ErrorModel.logError(656, 'API failed', error.response.data.error.message);

            // // Still want to keep track of who searched what
            QueryModel.addQuery(imageStr, ip, thisBrowser, os, platform, source, isMobile)

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        });

        data.images = response.data.data;
    } else {
        // TESTING ONLY
        data.images = [
            {
            "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-7Mx3zAFRO3FyBf7inVVu1dn3/user-MFbiojPuxsJQUfphJ5UdOztG/img-UBLISsj22uIOzOCKOCtvpG42.png?st=2023-03-01T23%3A41%3A55Z&se=2023-03-02T01%3A41%3A55Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-01T22%3A06%3A15Z&ske=2023-03-02T22%3A06%3A15Z&sks=b&skv=2021-08-06&sig=9ICTiXqc0tnNn98iPRMLfs2LHkc18xpQXRIBs2b4A5A%3D"
            },
            {
            "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-7Mx3zAFRO3FyBf7inVVu1dn3/user-MFbiojPuxsJQUfphJ5UdOztG/img-UBLISsj22uIOzOCKOCtvpG42.png?st=2023-03-01T23%3A41%3A55Z&se=2023-03-02T01%3A41%3A55Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-01T22%3A06%3A15Z&ske=2023-03-02T22%3A06%3A15Z&sks=b&skv=2021-08-06&sig=9ICTiXqc0tnNn98iPRMLfs2LHkc18xpQXRIBs2b4A5A%3D"
            },
            {
            "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-7Mx3zAFRO3FyBf7inVVu1dn3/user-MFbiojPuxsJQUfphJ5UdOztG/img-UBLISsj22uIOzOCKOCtvpG42.png?st=2023-03-01T23%3A41%3A55Z&se=2023-03-02T01%3A41%3A55Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-01T22%3A06%3A15Z&ske=2023-03-02T22%3A06%3A15Z&sks=b&skv=2021-08-06&sig=9ICTiXqc0tnNn98iPRMLfs2LHkc18xpQXRIBs2b4A5A%3D"
            }
        ];
    }
    
    //Also calls imageModel
    QueryModel.addQuery(imageStr, ip, thisBrowser, os, platform, source, isMobile);


    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
}

const express = require('express');
const app = express();
var useragent = require('express-useragent');
const imageRouter = require('./routes/imageRoute');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(useragent.express());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
});

app.use('/image', imageRouter);

app.listen(3000);
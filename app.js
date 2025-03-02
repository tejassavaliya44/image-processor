require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const port = process.env.PORT || 3000;
const app = express();

app.use(require('cors')({ origin: '*' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));

require('./models');
app.use('/api', require('./routes/index'));
app.use((req, res, next) => { next(require('http-errors')[404](`can't find ${req.url} on this server!`)) });
app.use(require('./middlewares/errorHandler'));

const server = app.listen(port, async () => {
    try {
        console.log('Server running on PORT:', port);
        await require('./services/dbService')();
    } catch (error) {
        console.log(error);
    }
});

process.on('unhandledRejection', () => {
    server.close(() => {
        process.exit(1);
    })
});
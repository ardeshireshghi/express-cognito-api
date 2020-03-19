const PORT = process.env.PORT || 8080;

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const apiRouter = require('./routes/api');

app.use(bodyParser.json());
app.use('/', apiRouter);

app.listen(PORT, () => {
	console.log(`Live on port: ${PORT}!`);
});

global.app = app;

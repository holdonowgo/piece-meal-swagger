'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const SwaggerExpress = require('swagger-express-mw');
const express = require('express');
const app = express();

app.disable('x-powered-by');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const ev = require('express-validation');
const cors = require('cors');
const auth = require('./api/helpers/auth');

const path = require('path');
app.use(express.static(path.join('public')));
app.use(cors());

switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;

  case 'production':
    app.use(morgan('short'));
    break;

  default:
}
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

app.use('/api/v1/clients', auth.verifyLoggedIn);
app.use('/api/v1/search', auth.verifyLoggedIn);
app.use('/api/v1/ingredients', auth.verifyLoggedIn);
app.use('/api/v1/recipes', auth.verifyLoggedIn);

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});

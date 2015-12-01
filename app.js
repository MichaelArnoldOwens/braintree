var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// Braintree - configure BEGIN
var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "z2qq8gkr9fdn57nb",
  publicKey: "smzp6685qh335qy5",
  privateKey: "2e8395691b948162a32c3f232a492efb"
});

// Braintree - configure stuff END

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

//Braintree - generate client token
//TODO: pass key directly to page instead of making ajax request
app.get("/client_token", function(req,res) {
  gateway.clientToken.generate({}, function(err, response) {
    res.send(response.clientToken);
  });
});

//Braintree - receive payment method nonce from client
app.post("/checkout", function (req, res) {
  console.log(req.body);
  
  console.log('######');
  var nonce = req.body.payment_method_nonce;
  
  // Use payment method nonce here
  var nonceFromTheClient = 'fake-valid-amex-nonce';

  gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: nonceFromTheClient,
  }, function (err, result) {
    console.log('checkout success')
  });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

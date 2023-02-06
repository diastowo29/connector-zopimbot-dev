var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var zopimRouter = require('./routes/zopim');
const graph = require('./payloader/graphql')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/zopim', zopimRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// function openWs (startAgentSessionQueryPayload) {
//   axios({
//       method: 'POST',
//       url: CHAT_API_URL,
//       data: {
//           query: startAgentSessionQueryPayload
//       }
//   }).then((response) => {
//       console.log('startAgentSession')
//       console.log(JSON.stringify(response.data.data))
//       let newAgentSessionResponse = response.data.data.startAgentSession
//       newWs = new WebSocket(newAgentSessionResponse.websocket_url);
//       zp_session.create({
//           session_id: newAgentSessionResponse.session_id,
//           client_id: newAgentSessionResponse.client_id,
//           token: newZdToken,
//           chat_api_url: CHAT_API_URL,
//           websocket_url: newAgentSessionResponse.websocket_url
//       }).then(zp_session_created => {
//           console.log('zp_session_created success');
//       })

//       doAttachEventListeners(newWs);
//       res.status(200).send({
//           status: 'connected'
//       })
//   }).catch(err =>{
//       res.send(err)
//   })
// }

module.exports = app;

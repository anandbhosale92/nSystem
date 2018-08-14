
// Bring in our dependencies
const
  express          = require('express'),
  app              = express(),
  io               = require('socket.io'),
  server           = require('http').createServer(app),
  mongo            = require('mongodb').MongoClient,
  PORT             = process.env.PORT || 3000,
  mongoUrl         = process.env.MONGOURL || 'mongodb://localhost:27017/notification_system',
  notifcationsService = require('./controllers/generateNotification');

mongo.connect(mongoUrl, function (err, db) {
  if (err) {
    console.log(err);
  }

  global.mongoClient       = db;
  global.notificationDB    = process.env.notificationDB || 'notifcations';
  global.userDB            = process.env.userDB || 'users';

  //CREATING SOCKET CONNECTION FOR SENDING NOTIFICATION TO CLIENT
  socket.on('connection', function (client) {
    const cookies = client.request.headers.cookie;

    const userId = getCookie(cookies, 'userId');

    global.socketConn = client;
    notifcationsService.dumpNotifications(userId);
    var date = new Date();

    client.on('onClicking', function (req) {
      notifcationsService.updateNotificationStatus(userId);
    })
  });
});

function getCookie(cookies, name) {
  var parts = cookies.split("; ");

  for(var i = 0; i <parts.length; i++) {
    var c = parts[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
}
//FRONTEND PART
app.use('/public', express.static(__dirname + '/views'));

// Turn on that server!
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// This allows you to set req.session.maxAge to let certain sessions
// have a different value than the default.
app.use(function (req, res, next) {
  res.cookie('name', 'express').send('cookie set');
  next();
});

var socket = io.listen(server);
global.socket = socket;


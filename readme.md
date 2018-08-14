# Notification System

Tech Stack node.js, mongoDB.

### Installation

Install the dependencies and start the server.

```sh
$ cd nSystem
$ npm install
$ npm start
```

### Usage Example:
###   Route
Url :- http://localhost:3000/public
#### User case
```
On init of application mongo is connected apon mongo connection a socket connection is created and which is accessible from URL (http://localhost:3000/public).
At some interval of time new notification is generated and stored in mongo and send it back to the user. Notification count is increased.
Once user clicked the bell icon to view the notification all messages are marked as read and notification counter is reset to 0.

```

### Database Schema:

#### notifications
```sh
{
    "_id"        : Mongo ObjectId,
    "notifiedBy" : String,
    "txt"        : String,
    "timestamp"  : timeStamp,
    "readBy"     : Array
}
```

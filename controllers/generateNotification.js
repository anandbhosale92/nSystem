const commonFunction = require('../handlers/common');
const notificationsAction = {
    users : [

      {name: "Anand Bhosale"
      },
      {
        name: "Arjun Rampal"
      },
      {
        name: "john deo"
      }
    ],
    actions: ["liked", "reacted on", "shared"],
      actionResult  : ["your picture", "your post", "your video"]
};

//generates a random number between 0 and 2 to select random polling data
const getRandomNumber = function(){
    return Math.floor(Math.random() * 3);
};

//GENERATING NEW NOTIFICATION WITH USERS, ACTION AND ACTION RESULT
const getNewNotification = function(){
  const
    userIndex         = getRandomNumber(),
    actionIndex       = getRandomNumber(),
    actionTargetIndex = getRandomNumber(),
    notificationText  = `${notificationsAction.actions[actionIndex]} ${notificationsAction.actionResult[actionTargetIndex]}`,
    newNotification = {
    notifiedBy : notificationsAction.users[userIndex].name,
    txt        : notificationText,
    timestamp  : new Date(),
    readBy     : []
    }

  return newNotification;
};

module.exports = {
  //DUMP NEW NOTIFICATION
  async dumpNotifications(userId) {

    //RANDOM INTERVAL TIME BETWEEN 5 - 10 SECONDS
    const min = 5,
    max = 10;
    const rand = Math.floor(Math.random() * (max - min + 1) + min);
    const randomInterval = rand * 1000;


    //STORE NEW NOTIFICATION IN DB FOR FURTHER USE
    await mongoClient.collection(notificationDB).insert(getNewNotification());

    //GET NOTIFICATION AND SEND IT BACK TO USER
    const query = generateNotificationQuery(userId);

    const data = await mongoClient.collection(notificationDB).aggregate(query);
    const doc = await data.next();

    const response = {};
    response.notSeenCnt = doc.NSEEN.length;
    response.notifications = [];
    for (let i = 0; i < doc.NSEEN.length; i++) {
      const tmp      = {};
      tmp.notifiedBy = doc.NSEEN[i].notifiedBy;
      tmp.txt        = doc.NSEEN[i].txt;
      tmp.timeStamp  = commonFunction.getDateTimeFromUNIX(doc.NSEEN[i].timestamp);
      tmp.type = 'N';

      response.notifications.push(tmp);
    }

    for (let i = 0; i < doc.SEEN.length; i++) {
      const tmp      = {};
      tmp.notifiedBy = doc.SEEN[i].notifiedBy;
      tmp.txt        = doc.SEEN[i].txt;
      tmp.timeStamp  = commonFunction.getDateTimeFromUNIX(doc.SEEN[i].timestamp);
      tmp.type       = 'S';
      response.notifications.push(tmp);
    }

    socketConn.emit('message', response);

    //CALL RECURSIVELY SAME FUNCTION TO GENERATING NEW NOTIFICATION WITH DURATION
    setTimeout(function () {
      module.exports.dumpNotifications(userId);
    }, randomInterval);
  },

  //UPDATE NOTIFICATION TO READ WITH STORING USER ID
  async updateNotificationStatus(userId) {
    const updateParam = {
      $addToSet: { readBy: userId }
    };
    console.log(userId);
    //UPDATE MONGO
    await mongoClient.collection(notificationDB).update({}, updateParam, { multi: true });
    //UPDATION COMPLETE CALL NOTIFICATION FOR GETTING INSTANT NEW NOTIFICATGION
    // module.exports.dumpNotifications(userId);

  }
};

/**
 * FUNCTION TO GENERATE MONGO FACET QUERY
 * @param {*} userSessData = USER ID WHICH IS GET FROM COOKIES
 */
const generateNotificationQuery = function(userSessData = '') {
  const query = [
    {
      '$facet': {
        NSEEN: [
          {
            '$match': {
              readBy: { $nin: [userSessData] }
            }
          },
          { '$sort': { timestamp: -1 } }
        ],
        SEEN: [
          {
            '$match': {
              readBy: userSessData
            }
          },
          { '$sort': { timestamp: -1 } }
        ]
      }
    }
  ];

  return query;
}




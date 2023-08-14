const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
   date: {
    type: Date,
    default: Date.now()
   },
   content: {
    type: String
   },
   type: {
      type: String
   }
})


const notificationModel = mongoose.model("Notification", notificationSchema)
module.exports = notificationModel














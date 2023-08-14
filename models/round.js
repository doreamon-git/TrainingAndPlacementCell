const mongoose = require('mongoose');

const roundSchema = mongoose.Schema({
   selectedStudents: [],
   name: {
      type: String
   }
})

const roundModel = mongoose.model('Round', roundSchema)
module.exports = roundModel



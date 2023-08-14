const mongoose = require('mongoose');
const roundModel = require('./round')
const commentModel = require('./comment')

const companySchema = mongoose.Schema({
   name: {
    type: String
   },
   role: {
    type: String
   },
   pakage: {
    type: Number
   },
   eligibleYear: { 
    type: Number, 
   },
   isActive: {
    type: Boolean,
    default: true,
    required: true
   },
   isHired: {
    type: Boolean,
    default: false
   },
   eligibleBranches: {
    type: [String]
   },
   description: {
    type: String
   },
   rounds: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Round'
      }
   ],
   comments: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
   ]
})


// "this" is query object here, remove() is depricated so deleteOne is used 
companySchema.pre('deleteOne', async function(next){
    const company = await this.model.findOne(this.getQuery())
    const rounds = company.rounds
    await roundModel.deleteMany({_id: {$in: rounds}})

    const comments = company.comments
    await commentModel.deleteMany({_id: {$in: comments}})

    next()
})


const companyModel = mongoose.model("Company", companySchema)
module.exports = companyModel 














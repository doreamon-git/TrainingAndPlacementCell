const mongoose = require('mongoose');

const placementSchema = mongoose.Schema({
    rollNo: {
        type: Number
    },
    name: {
        type: String
    },
    placedIn: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        }
    ],
    highestPakage: {
        type: Number,
        default: 0
    },
    endYear: {
        type: Number
    },
    branch: {
        type: String
    }
})


const placementModel = mongoose.model("Placement", placementSchema)
module.exports = placementModel

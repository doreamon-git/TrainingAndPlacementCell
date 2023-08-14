const mongoose = require('mongoose');
const companyModel = require('./models/company.js')
const roundModel = require('./models/round')
const studentModel = require('./models/student')
const PlacementModel = require('./models/placement');
const placementModel = require('./models/placement');
const { findOneAndUpdate } = require('./models/company.js');

mongoose.connect('mongodb://127.0.0.1:27017/Tpc', {useNewUrlParser: true});
const db=mongoose.connection
db.on('error', err => console.error(err));
db.once('open',()=>{console.log("Database Connected!")});


// companyModel.insertMany([
//    {
//       name: "Infosys",
//       role: "SP",
//       pakage: 9.5,
//       isActive: true
//    },
//    {
//     name: "TCS",
//     role: "Ninja",
//     pakage: 3.36,
//     isActive: true
//    },
//    {
//     name: "Optum",
//     role: "Dev-Ops",
//     pakage: 11,
//     isActive: false
//    },
//    {
//     name: "Maventic",
//     role: "Software Developer",
//     pakage: 6,
//     isActive: false 
//    },
//    {
//     name: "Infosys",
//     role: "DSE",
//     pakage: 6.25,
//     isActive: true
//    },
//    {
//     name: "TCS",
//     role: "Digital",
//     pakage: 7.5,
//     isActive: false
//    },
//    {
//     name: "IndiaMart",
//     role: "Software Developer",
//     pakage: 8,
//     isActive: false
//    },
// ])

// companyModel.deleteMany({}).then((data)=>{
//   console.log(data)
// })


async function callMe(){

    await companyModel.deleteMany({})
    await studentModel.deleteMany({})
    await roundModel.deleteMany({})
    await PlacementModel.deleteMany({})
    
}

callMe()


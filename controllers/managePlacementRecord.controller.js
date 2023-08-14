const companyModel = require('../models/company.js')
const studentModel = require('../models/student.js')
const roundModel = require('../models/round.js')
const commentModel = require('../models/comment.js')
const placementModel = require('../models/placement.js')





class managePlacementRecordController {

  static async show(req, res) {
    res.render('manage/showPlacementRecord')
  }
  static async showFilter(req, res) {

    const studentObj = Object.entries(req.body).reduce((acc, [key, value]) => {
      if (value !== '' && key !== "company" && key !== "highestPakage")
        acc[key] = value
      return acc
    }, {})

    let studentObjArr = await studentModel.find(studentObj, { rollNo: 1, _id: 0 })
    studentObjArr = studentObjArr.filter((obj)=>{return (obj.role != 'Admin')})
    const studentArr = studentObjArr.map((obj) => { return obj.rollNo })


    async function findRollNosByCompanyName(companyName) {
      try {
        if (companyName.length == 0) {
          const allStudentObjArr = await studentModel.find({role: {$ne: 'Admin'}}, { rollNo: 1, _id: 0 })
          const allStudentArr = allStudentObjArr.map((obj) => { return obj.rollNo })
          return allStudentArr
        }
        const company = await companyModel.findOne({ name: companyName }); // find the company by name
        const placements = await placementModel.find({ placedIn: company._id }); // find the placements that have this company's _id in placedIn
        const rollNos = placements.map((placement) => placement.rollNo); // get the rollNos of those placements
        return rollNos
      } catch (err) {
        return err
      }
    }

    const placementArr = await findRollNosByCompanyName(req.body.company)
    const finalRollNos = studentArr.filter((num) => placementArr.includes(num))
    const filteredStudents = await studentModel.find({ rollNo: { $in: finalRollNos } })
    
    res.render('manage/showPRFilter', { filteredStudents })
  }

}




module.exports = managePlacementRecordController
const companyModel = require('../models/company.js')
const studentModel = require('../models/student.js')
const roundModel = require('../models/round.js')
const commentModel = require('../models/comment.js')
const placementModel = require('../models/placement.js')


class manageTPOController{

    static async show(req, res){
        const allTPO = await studentModel.find({role: "TPO"})
        res.render("manage/showTPO", {allTPO})
    }
    static async addTPO(req, res){
        const {rollNo} = req.body
        const student = await studentModel.findOne({rollNo: rollNo})

        if(!student){
            req.flash('error', "No student found")    
        }
        else{
            if(student.role == 'Admin'){
                console.log("hahahaha")
                req.flash('error', "Admin can not be TPO")   
            }
            else if(student.role == 'TPO'){
                req.flash('error', "Already TPO")
            }
            else{
                student.role='TPO'
                await student.save()
                req.flash('success', "New TPO added")
            }
        }

        res.redirect('/manage/TPO')
    }
    static async removeTPO(req, res){
        const {id} = req.params
        await studentModel.findByIdAndUpdate(id, {role: "student"})
        req.flash('success', "TPO removed successfully")
        res.redirect('/manage/TPO')
    }
}



module.exports = manageTPOController
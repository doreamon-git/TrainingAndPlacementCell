const companyModel = require('../models/company.js')
const studentModel = require('../models/student.js')
const roundModel = require('../models/round.js')
const commentModel = require('../models/comment.js')
const placementModel = require('../models/placement.js')
const notificationModel = require('../models/notification.js')
const mailer = require('../utils/mailer.js')

class companyController{
    static async showAllCompany(req, res){
        
        let activeCompaniesList, pastCompaniesList  
        
        if(req.user.role === 'student'){
        activeCompaniesList = await companyModel.find({isHired: false, eligibleYear: req.user.endYear})
        pastCompaniesList = await companyModel.find({isHired: true, eligibleYear: req.user.endYear})
        }    
        else{
        activeCompaniesList = await companyModel.find({isHired: false})
        pastCompaniesList = await companyModel.find({isHired: true})    
        }

         res.render('company/index', {activeCompaniesList, pastCompaniesList})
    }
    static async showCompany(req, res){
        const {id} = req.params
        const company = await companyModel.findById(id).populate('rounds').populate('comments')
//console.log(company.rounds[0].selectedStudents[0].Name)

        const allStudents = await studentModel.find({}) 
        res.render('company/showCompany', {company, allStudents})
    }
    static async showAddCompany(req, res){
        res.render('company/addCompany')
    }
    static async addCompany(req, res){
        const company = new companyModel(req.body)
        await company.save()

        let newNotification = new notificationModel()
        newNotification.content = `<b>${company.name} is hiring</b>`
        newNotification.type = "hiring"
        await newNotification.save()

        await studentModel.updateMany({endYear: company.eligibleYear}, {
            $push: {
                notifications: {
                    notification: newNotification._id,
                    seen: false
                }
            }
        })
        
        const mailerStudentsObj = await studentModel.find({endYear: company.eligibleYear}, {email: 1, _id: 0})
        const mailerStudents = mailerStudentsObj.map((obj) => { return obj.email })
        console.log(mailerStudents)
        mailer(`Invitation to Campus Drive: ${company.name}`, 
        `Dear Students,<br><p>We are thrilled to invite you to a campus drive by ${company.name}, a leading name in the industry. Discover exciting internship and employment prospects. Eligibility criteria and registration information will follow. Prepare diligently and showcase your potential. Don't miss this chance to kick-start your career with a renowned organization. Stay tuned for further updates and make the most of this remarkable opportunity.</p><br>Best regards,<br>Training and Placement Cell`,
        mailerStudents)
        
        req.flash('success', "Drive added successfully")
        res.redirect('/company')
    }
    static async studentApi(req, res){
        const students = await studentModel.find({})
        res.status(200).json({students})
    }
    static async addRound(req, res){
        const {id} = req.params
        res.render('company/addRound', {id})
    }
    static async roundResult(req, res){
        const {id} = req.params
        const {selectedStudents, name} = req.body
        const round = new roundModel()
        const company = await companyModel.findById(id)
        for(let i = 0; i < selectedStudents.length; i++)
            selectedStudents[i] = JSON.parse(selectedStudents[i])

        if(company.rounds.length > 0){
            const lastRound = await roundModel.findById(company.rounds.slice(-1))
            const lastRoundSelected = lastRound.selectedStudents

            const finalStudents = selectedStudents.filter((objA) => {
                return lastRoundSelected.some((objB) => {return objB["Roll No."] == objA["Roll No."]})
            })
            round.selectedStudents = finalStudents
        }    
        else{
            
            const allStudentObjArr = await studentModel.find({role: {$ne: 'Admin'}}, { rollNo: 1, _id: 0 })
            const allStudentArr = allStudentObjArr.map((obj) => { return obj.rollNo })
            const finalselectedStudents = selectedStudents.filter((obj)=>{ return (allStudentArr.includes(obj['Roll No.'])) })

            round.selectedStudents = finalselectedStudents
        }
        round.name = name


        const placedRollNos = round.selectedStudents.map((obj)=>{return obj["Roll No."]})
        let newNotification = new notificationModel()
        newNotification.content = `<b>Congratulations!</b> You've qualified <b>${round.name}</b> at <b>${company.name}</b>`
        newNotification.type = 'round result'
        await newNotification.save()

        await studentModel.updateMany({rollNo: {$in: placedRollNos}}, {
            $push: {
                notifications: {
                    notification: newNotification._id,
                    seen: false
                }
            }
        })


        company.rounds.push(round)

        await company.save()
        await round.save()
        req.flash('success', "Round added")
        res.redirect(`/company/${id}`)
    }
    static async addComment(req, res){
        const comment = new commentModel()
        comment.content = req.body.content
        comment.name = req.user.name                 
        comment.rollNo = req.user.rollNo                     
        const data = new Date()
        const d = data.toDateString()
        comment.publishDate =  d.substring(4, 7) + " " + d.substring(8, 10) + ", " + d.substring(11, 15) + " " + data.getHours() + ":" + data.getMinutes()  

        const {id} = req.params
        const company = await companyModel.findById(id)
        company.comments.push(comment)

        await company.save()
        await comment.save()

        res.redirect(`/company/${id}`)
    }
    static async deleteCompany(req, res){
        const {id} = req.params
        await companyModel.deleteOne({_id: id})
        
        req.flash('success', "Company Removed")
        res.redirect('/company')
    }
    static async finaliseRound(req, res){
        
        const {id} = req.params
        await companyModel.findByIdAndUpdate(id, {isHired: true})
        const company = await companyModel.findById(id).populate('rounds')
        const round = company.rounds[company.rounds.length-1]
        const placedRollNos = round.selectedStudents.map((obj)=>{return obj["Roll No."]})
        
        let newNotification = new notificationModel()
        newNotification.content = `<b>Congratulations!</b> You've been hired at <b>${company.name}</b>`
        newNotification.type = 'final round result'

        await newNotification.save()

        await studentModel.updateMany({rollNo: {$in: placedRollNos}}, {
            $push: {
                notifications: {
                    notification: newNotification._id,
                    seen: false
                }
            }
        })

        await placementModel.updateMany({rollNo: {$in: placedRollNos}}, {$addToSet: {placedIn: id}})
        req.flash('success', "Round finalised")
        res.redirect(`/company/${id}`)
    }

}

module.exports = companyController




const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const companyRoutes = require('./routes/company.routes.js')
const managePlacementRecordRoutes = require('./routes/managePlacementRecord.routes.js')
const passport = require('passport');
const manageTPORoutes = require('./routes/manageTPO.routes.js')
const flash = require('connect-flash');
const session = require('express-session')
require('dotenv').config()


const db = require("./utils/dbConnection");
db.connect();


//built-in middleware
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method'))


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
// Set directory to contain the templates ('views')
app.set('views', path.join(__dirname, 'views'));


//use static files in app.js
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'partials')));


const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}));


app.use(passport.initialize())
app.use(passport.session())


app.use(session({
    secret:'TPC',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());


const authRoutes = require('./routes/auth.routes.js')
app.use('/auth', authRoutes);


app.use((req, res, next) => {
    res.locals.currentUser = req.user; //passport attached methods to req such as req.isAuthenticate(), req.user etc
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next(); //whatever there in req-flash it attached to res object and can use it
})


// to make notification count global
app.use(async (req, res, next)=>{
    if(req.user){
    const student = await studentModel.findById(req.user._id)    
    const allNotificationsId = student.notifications.filter((oneNotification)=>{ return (oneNotification.seen == false) })
    res.locals.notificationCount = allNotificationsId.length
    }
    else{
        res.locals.notificationCount = 0
    }
    next()
})


app.use('/company', companyRoutes)
app.use('/manage/placementRecord', managePlacementRecordRoutes)
app.use('/manage/TPO', manageTPORoutes)


// API for fetching notifications
const studentModel = require('./models/student.js');
app.get('/notification', async (req, res)=>{
    const studentNotifications = await studentModel.findById(req.user._id, {notifications: 1, _id: 0}).populate('notifications.notification')
    studentNotifications.notifications = studentNotifications.notifications.reverse()
    await studentModel.findByIdAndUpdate(req.user._id, {$set: {'notifications.$[].seen': true}})
    res.status(200).json(studentNotifications)  
})


//User Profile
const placementModel = require('./models/placement.js');
app.get('/profile/:id', async (req, res) => {
    const { id } = req.params
    const user = await studentModel.findById(id);
    res.render('user', { user });
})


//register
app.get('/register', (req, res) => {
    res.render('register');
})
app.post('/register', async (req, res) => {
    if(req.body.email === 'abtiwari2904@gmail.com'){
        req.body.role = 'Admin'
    }
    const registeredUser = new studentModel(req.body);
    await registeredUser.save()
        .then(doc => {
            console.log("Inserted in student model");
            return doc;
        })
        .catch(err => { throw err });
        const newPlacedStudent = new placementModel(req.body)
        req.flash('success', "Registered Successfully")
    res.redirect('/');
})




app.use('/', async (req, res) => {
    const allTpo = await studentModel.find({role: 'TPO'})
    res.render('index', {allTpo})
})


const port = 3000;
app.listen(port, () => {
    console.log(`Server listening at ${port}`);
})

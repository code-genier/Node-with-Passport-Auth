const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require('mongoose');
const mongoInfo = require('./config/keys'); 
const passport = require('passport');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// DB config
const db = mongoInfo.mongoURI;

//require local logic
require("./config/passport")(passport);

// connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
.then(() => {
    console.log('mongo connnected');
})
.catch(e => {
    console.log(e);
})

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//passport setup
app.use(passport.initialize());
app.use(passport.session());

//body parser
app.use(express.urlencoded({ extended: false }));


//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, console.log(`Server start on ${PORT}`));


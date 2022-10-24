const express = require("express");
const { emit } = require("../models/User");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require('passport');

const router = express.Router();

router.get('/login', (req, res)=>{
    res.render('login');
})

router.get('/register', (req, res)=>{
    res.render('register');
})

// handle register
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // check require field
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Please fill in all fields' });
    }

    // chack password match
    if(password != password2){
        errors.push({ masg: 'password not match' });
    }

    //check pass length
    if(password.length < 6){
        errors.push({ msg: 'password atleast 6 char long' });
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name, 
            email,
            password,
            password2
        })
    }
    else{
        // res.send('pass');
        // validatation passed
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                // user exist
                errors.push({ msg: 'email alredy register' });
                res.render('register', {
                    errors,
                    name, 
                    email,
                    password,
                    password2
                })
            }
            else{
                const newUser = new User({
                    name,
                    email,
                    password
                })

                // console.log(newUser);
                // hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;

                        // set password to hash
                        newUser.password = hash;

                        //save user
                        newUser.save()
                        .then(
                            user => {
                                console.log(newUser);
                                res.redirect('/users/login');
                            }
                        )
                        .catch(
                            err => {
                                console.log(err);
                            }
                        )
                    })
                })
            }
        })
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
    //   failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout((err => {
        if(err) return next(err);
        res.redirect('/users/login');
    }));
  });

module.exports = router;
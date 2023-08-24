const Cart = require('../models/cart');
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator')

const transporter = nodemailer.createTransport((sendgridTransport({
    auth: {
        api_key: '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'
    }
})))


exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: [],
        oldInput: {
            email: '',
            password: ''
        }
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req)
    console.log(errors.array());

    if(!errors.isEmpty()){
        return res.render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            }
        });
    }
    console.log('check1');
    console.log(email);
    User.findOne({email : email})
    .then(user => {
        console.log(user);
        if(!user){
            console.log('check');
            return res.render('auth/login', {
                pageTitle: 'Login',
                path: '/login',
                errorMessage: 'Enter valid email or password',
                oldInput: {
                    email: email,
                    password: password
                }
            });
        }
        console.log('check2');
        bcrypt.compare(password, user.password)
        .then(result => {
            console.log(result);
            if(result){
                console.log(result);
                req.session.user = user;
                req.session.isLoggedIn = true;
                req.session.save(() => {
                    return res.redirect('/products');
                })
            }
            else{
                return res.render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    errorMessage: 'Enter valid email or password',
                    oldInput: {
                        email: email,
                        password: password
                    }
                });
            }
            
        })
        .catch(err => {
            return res.render('auth/login', {
                pageTitle: 'Login',
                path: '/login',
                errorMessage: 'Enter valid email or password',
                oldInput: {
                    email: email,
                    password: password
                }
            });
        })
    })
    .catch(err => console.log(err));


}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
    
}

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Sign-Up',
        path: '/signup',
        errorMessage: [],
        oldInput: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    })
}

exports.postSignUp = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    let errorMessage = [];
    console.log(errors.array());


    if(!errors.isEmpty()){
        return res.status(422)
        .render('auth/signup', {
            pageTitle: 'Sign-Up',
            path: '/signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }
        })
    }

    return User.findOne({email: email})
    .then(user => {
        if(user){
            return res.redirect('/signup');
        } 
        return bcrypt.hash(password, 12)
        .then((safepass) => {
            const user = new User({
                username: username,
                email: email,
                password: safepass
            })
            return user.save()
            .then(result => {
                const cart = new Cart ({
                    userId: result._id,
                    products: []
                })
                return cart.save()
                .then(() => {
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'khamruiaritya.2.3.5.ak@gmail.com',
                        subject: 'you got signup sucessfully',
                        html: '<h1>success</h1>'
                    })
                    .then((res) => {
                        console.log(res);
                    })
                    .catch(err => console.log(err)) 
                    
                })
                
            });
        })

    })
}

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset'
    })
}

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            return res.redirect('/reset');
        }
        const str = buffer.toString('hex');
        User.findOne({email: email})
        .then(user => {
            if(!user){
                return res.redirect('/reset');
            }
            let currentDate = new Date();
            console.log(user);
            user.token = str;
            user.validTill = new Date(currentDate.getTime() + 60*60000);

            return user.save()
            .then(() => {
                transporter.sendMail({
                    to: email,
                    from: 'khamruiaritya.2.3.5.ak@gmail.com',
                    subject: 'Password-Resetting',
                    html: `
                    <h1>Password Reset Process</h1>
                    <p> click on the below link </p>
                    <a href="http://localhost:4000/reset/${str}">Reset</a> 
                    `
                })
                return res.redirect('/products');
            })
        })

    })
    
    
}

exports.getResetPass = (req, res, next) =>{
    const token = req.params.token;

    User.findOne({token: token, validTill: {$gt: new Date()}})
    .then(user => {
        if(!user){
            return res.redirect('/products');
        }
        return res.render('auth/new-password', {
            path: 'new-password', 
            pageTitle: 'New Password',
            userId: user._id.toString()
        })
    })
    .catch(err => console.log(err))
}


exports.postResetPass = (req, res, next) => {
    const userId = req.body.userId;
    const password = req.body.password;
    const confirmPassword = req.body.cpassword;

    User.findOneAndUpdate({_id: userId}, {$unset: {token: 1, validTill: 1}}, {new: true})
    .then(user => {
        return bcrypt.hash(password, 12)
        .then(safepass => {
            user.password = safepass;
            return user.save()
            .then(result => {
                return res.redirect('/login')
            })
        })

    })
}


const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',
    check('email')
    .isEmail().withMessage('Enter valid e-mail or password')
    .custom((value, {req})=> {
        return User.findOne({email: value})
        .then(userDoc => {
            if(!userDoc){
                throw new Error('Enter a valid e-mail or password');
            }
            else return true;
        })
    }),
    authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignUp);

router.post('/signup', 
    check('email').isEmail().withMessage('Enter a valid e-mail')
    .custom((value, {req})=> {
        return  User.findOne({email: value})
        .then(userDoc => {
            console.log(userDoc);
            console.log(value);
            if(userDoc){
                return Promise.reject('E-Mail Already Exist');
            }
            else return true;
        })
    }),

    check('password', 'Password should be 6 charecters long')
    .isLength({min: 6}),

    check('confirmPassword')
    .custom((value, {req}) => {
        if(value!==req.body.password){
            throw new Error ('Passwords have to match!')
        }
        return true;
    })

    ,authController.postSignUp);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getResetPass);

router.post('/new-password', authController.postResetPass);

// router.get('/new-password', authController.getNewPassword);

module.exports = router;
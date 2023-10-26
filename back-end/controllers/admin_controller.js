const User = require("../models/User");
const path = require("path");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');

const verifInputs = async (req, res) => {
    body('email', 'Le mail est obligatoire').isEmail().notEmpty();
    body('pswd', 'Le mot de passe est obligatoire').isString().notEmpty();
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(422).json({errors : errors.array()});
    }
}

const findUserByMail = async (req) => {
    return await User.findOne({ email: req.body.email })
}

exports.loginRender = async (req, res, next) => {
    try {
        const errorFindUser = req.session.errorFindUser ? req.session.errorFindUser : null;
        const token = req.cookies.token;

        if(token) {
            res.status(200).redirect('/admin');
        }

        const title = "Connexion Admin";
        res.status(200).render(path.join(__dirname, "../views/login.ejs"), { title, errorFindUser, token });        
    }
    catch(error) {
        console.log("Try Error Login Page : ", error);
    }
}

exports.login = async (req, res, next) => {
    try {
        verifInputs(req, res);
        
        await findUserByMail(req)
        .then(user => {
            const passwordVerify = bcrypt.compare(req.body.pswd, user.password)
            
            if(passwordVerify) {
                req.session.userConnected = {
                    id: user._id,
                    email : user.email,
                    fullname : `${user.lastname} ${user.firstname}`,
                    access: user.fullaccess
                };

                const token = jwt.sign(
                    { userId: user._id },
                    process.env.SECRET_KEY_TOKEN,
                    { expiresIn: '7d' }
                );

                res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 604800000 // 1 semaine
                });

                res.redirect("/admin");
            } else {
                req.session.errorFindUser = "Email ou mot de passe incorrect.";
            }
        })
        .catch(error => {
            req.session.errorFindUser = `Email ou Mot de passe incorrect.`;
            console.log(`Error FindUserByMail ${error}`);
        })       
    }
    catch(error) {
        req.session.errorFindUser = `Try Error Signin : ${error}`;
        res.status(500).redirect("/");
    }
}

exports.adminRender = async (req, res, next) => {
    try {
        const title = "Dashboard";
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect('/');
        }

        res.status(200).render(path.join(__dirname, "../views/admin/admin.ejs"), { title, token });        
    }
    catch(error) {
        console.log("Try Error Admin Page : ", error);
    }
}

exports.logout = async (req, res, next) => {
    try {
        await res.clearCookie('token');
        await req.session.destroy();
        res.redirect('/');
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}
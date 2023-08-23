const User = require("../models/User");
const path = require("path");
const { body, validationResult } = require("express-validator");

const verifInputs = async (req, res) => {
    body('firstname', 'Le nom est obligatoire').isString().notEmpty();
    body('lastname', 'Le prénom est obligatoire').isString().notEmpty();
    body('email', 'Le mail est obligatoire').isEmail().notEmpty();
    body('pswd', 'Le mot de passe est obligatoire').isString().notEmpty();
    body('pswdConfirm', 'La confirmation du mot de passe est obligatoire').isString().notEmpty();
    body('birthdate', 'La date de naissance est obligatoire').isDate().notEmpty();

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(422).json({errors : errors.array()});
    }
}

const findUsers = async () => {
    return await User.find();
}

const findUserById = async (id) => {
    return await User.findOne({ _id: id });
}

const findUserByMail = async (req) => {
    return await User.findOne({ email: req.body.email })
}

const newUser = async (req, res) => {

    try{
        
        const newUser = new User({
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            birthdate: req.body.birthdate,
            email: req.body.email,
            password: req.body.pswd
        });

        newUser.save()
        .then(result => {
            req.session.successCreateUser = `Utilisateur ${result.firstname} ${result.lastname} créé avec succès.`;
            res.status(201).redirect("/users/create");
        })
        .catch(error => {
            req.session.errorCreateUser = `Erreur lors de la tentative de création d'un utilisateur, ${error.message}.`;
            res.status(500).redirect("/users/create");
        });
    }
    catch(error) {
        console.log('Erreur lors du traitement des données : ', error);
    }
}

const modifyUser = async (req, res) => {

    try{
        
        const modifyUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthdate: req.body.birthdate,
        };

        await User.updateOne({ _id: req.params.id}, { ...modifyUser})
        .then(result => {
            req.session.successUpdateUser = `Utilisateur ${req.body.firstname} ${req.body.lastname} mis à jour avec succès.`;
            res.status(201).redirect(`/users/${req.params.id}/update`);
        })
        .catch(error => {
            req.session.errorUpdateUser = `Erreur lors de la tentative de modification d'un utilisateur, ${error.message}.`;
            res.status(500).redirect(`/users/${req.params.id}/update`);
        });
    }
    catch(error) {
        console.log('Erreur lors du traitement des données : ', error);
    }
}

const modifyPassword = async (req, res) => {

    try{
        
        const modifyPassword = {
            password: req.body.pswd,
        };

        await User.updateOne({ _id: req.params.id}, { ...modifyPassword})
        .then(result => {
            req.session.successUpdateUser = `Mot de passe de ${req.body.firstname} ${req.body.lastname} mis à jour avec succès.`;
            res.status(201).redirect(`/users/${req.params.id}/password/update`);
        })
        .catch(error => {
            req.session.errorUpdateUser = `Erreur lors de la tentative de modification d'un mot de passe, ${error.message}.`;
            res.status(500).redirect(`/users/${req.params.id}/password/update`);
        });
    }
    catch(error) {
        console.log('Erreur lors du traitement des données : ', error);
    }
}

exports.listUsers = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            res.status(200).redirect("/");
        }

        await findUsers()
        .then(users => {
            users.sort((a, b) => {
                if(a.lastname < b.lastname) { return -1 }
                else if(a.lastname > b.lastname) { return 1 }
                else { return 0 }
            });

            const title = "Liste des utilisateurs";
            const successDeleteUser = req.session.successDeleteUser ? req.session.successDeleteUser : null;
            const errorUser = req.session.errorUser ? req.session.errorUser : null;

            res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/users/list-users.ejs"), { title, users, errorUser, successDeleteUser });
        })
        .catch(error => console.log(error))

    }
    catch(error) {
        console.log("Try Error List Userss Page : ", error);
    }
}

exports.createUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        const title = "Créer un utilisateur";
        const errorCreateUser = req.session.errorCreateUser ? req.session.errorCreateUser : null;
        const successCreateUser = req.session.successCreateUser ? req.session.successCreateUser : null;
        res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/users/create-user.ejs"), { title, errorCreateUser, successCreateUser });
    }
    catch(error) {
        console.log("Try Error Create User Page : ", error);
    }
}

exports.createConfirmUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        verifInputs(req, res);

        await findUserByMail(req)
        .then(user => {
            if(user) {
                req.session.errorCreateUser = `Utilisateur ${user.date} existe déjà`;
                res.status(401).redirect("/users/create");
            } else {
                newUser(req, res);
            }
        })
        .catch(error => {
            req.session.errorCreateUser = `Erreur lors de la recherche d'un utilisateur identique, ${error.message}.`;
            res.status(500).redirect("/users/create");
        })
    }
    catch(error) {
        console.log("Try Error Create User Page : ", error);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        await findUserById(req.params.id)
        .then(user => {
            if(user) {
                const title = "Mettre à jour un utilisateur";
                const errorUpdateUser = req.session.errorUpdateUser ? req.session.errorUpdateUser : null;
                const successUpdateUser = req.session.successUpdateUser ? req.session.successUpdateUser : null;
                res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/users/update-user.ejs"), { title, user, errorUpdateUser, successUpdateUser });
            } else {
                req.session.errorUser = `User inexistant`;
                res.status(401).redirect('/users');
            }
        })
        .catch(error => {
            req.session.errorUser = `Erreur Mise à jour Utilisateur`;
            console.log(error);
            res.status(401).redirect('/users');
        })      
    }
    catch(error) {
        console.log("Try Error Update User Page : ", error);
    }
}

exports.updateConfirmUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        verifInputs(req, res);

        await findUserById(req.params.id)
        .then(user => {
            if(user) {
                modifyUser(req, res);
            } else {
                req.session.errorUser = `Utilisateur ${req.params.id} inexistant`;
                res.status(401).redirect(`/users`);
            }
        })
        .catch(error => {
            req.session.errorUser = `Erreur lors de la recherche d'un utilisateur, ${error.message}.`;
            res.status(500).redirect("/users");
        })       
    }
    catch(error) {
        console.log("Try Error Update User Page : ", error);
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        await findUserById(req.params.id)
        .then(user => {
            if(user) {
                const title = "Mettre à jour un utilisateur";
                const errorUpdatePassword = req.session.errorUpdatePassword ? req.session.errorUpdatePassword : null;
                const successUpdatePassword = req.session.successUpdatePassword ? req.session.successUpdatePassword : null;
                res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/users/update-password.ejs"), { title, user, errorUpdatePassword, successUpdatePassword });
            } else {
                req.session.errorUser = `User inexistant`;
                res.status(401).redirect('/users');
            }
        })
        .catch(error => {
            req.session.errorUser = `Erreur Mise à jour Mot de passe Utilisateur`;
            console.log(error);
            res.status(401).redirect('/users');
        })      
    }
    catch(error) {
        console.log("Try Error Update Password User Page : ", error);
    }
}

exports.updateConfirmPassword = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        verifInputs(req, res);

        if(req.body.pswd === req.body.pswdConfirm) {
            await findUserById(req.params.id)
            .then(user => {
                if(user) {
                    modifyPassword(req, res);
                } else {
                    req.session.errorUser = `Utilisateur ${req.params.id} inexistant`;
                    res.status(401).redirect(`/users`);
                }
            })
            .catch(error => {
                req.session.errorUser = `Erreur lors de la recherche d'un utilisateur, ${error.message}.`;
                res.status(500).redirect("/users");
            })   
        } else {
            req.session.errorUser = `Les mots de passe ne sont pas identique`;
            res.status(401).redirect(`/users/${req.params.id}/password/update`);
        }

            
    }
    catch(error) {
        console.log("Try Error Update Password User Page : ", error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const title = "Suppression d'un utilisateur";

        await findUserById(req.params.id)
        .then(user => {
            if(!user) { 
                req.session.errorUser = `Utilisateur ${req.params.id} non trouvé`;
                req.session.successDeleteUser = null;
                res.redirect("/users");
            } else {
                const errorDeleteUser = req.session.errorDeleteUser ? req.session.errorDeleteUser : null;
                res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/users/delete-user.ejs"), { title, user, errorDeleteUser });
            }
        })
        .catch(error => {
            req.session.successDeleteUser = null;
            req.session.errorUser = `Utilisateur ${req.params.id} non trouvé, ${error.message}`;
            res.redirect("/users");
        })
    }
    catch(error) {
        console.log("Try Error Delete User Page : ", error);
    }
}

exports.deleteConfirmUser = async (req, res, next) => {
    try {        
        await findUserById(req.params.id)
        .then(user => {
            if(!user) {
                req.session.errorUser = `Utilisateur ${req.params.id} non trouvé`;
                req.session.successDeleteUser = null;
                res.redirect("/users");
            } else {
                user.deleteOne({ _id: req.params.id })
                .then(() => {
                    req.session.successDeleteUser = `Utilisateur ${user.date} supprimé avec succès.`;
                    req.session.errorUser = null;
                    res.redirect("/users");
                })
                .catch(error => {
                    req.session.errorDeleteUser = `Erreur lors de la suppression d'un utilisateur. ${error.message}`;
                    res.redirect(`/users/${user._id}/delete`) 
                })
            }
        })
        .catch(error => {
            req.session.errorUser = `Utilisateur ${req.params.id} non trouvé, ${error.message}`;
            res.redirect("/users");
        })
    }
    catch(error) {
        console.log("Try Error Delete User Page : ", error);
    }
}
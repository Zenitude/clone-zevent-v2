const Historic = require("../models/Historic");
const path = require("path");
const { body, validationResult } = require("express-validator");

const verifInputs = async (req, res) => {
    body('date', 'La date est obligatoire').isString().notEmpty();
    body('amount', 'Le montant est obligatoire').isString().notEmpty();
    body('associations', 'Les associations sont obligatoire').isString().notEmpty();

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(422).json({errors : errors.array()});
    }
}

const findHistorics = async () => {
    return await Historic.find();
}

const findHistoricById = async (id) => {
    return await Historic.findOne({ _id: id });
}

const findHistoricByDate = async (req) => {
    return await Historic.findOne({ date: req.body.dates })
}

const newHistoric = async (req, res) => {

    try{
        
        const newHistoric = new Historic({
            date: req.body.dates,
            amount: req.body.amount,
            associations: req.body.associations
        });

        newHistoric.save()
        .then(result => {
            req.session.successCreateHistoric = `Historique ${result.date} créé avec succès.`;
            res.status(201).redirect("/historics/create");
        })
        .catch(error => {
            req.session.errorCreateHistoric = `Erreur lors de la tentative de création d'un historique, ${error.message}.`;
            res.status(500).redirect("/historics/create");
        });
    }
    catch(error) {
        console.log('Erreur lors du traitement des données : ', error);
    }
}

const modifyHistoric = async (req, res) => {

    try{
        
        const modifyHistoric = {
            date: req.body.dates,
            amount: req.body.amount,
            associations: req.body.associations
        };

        await Historic.updateOne({ _id: req.params.id}, { ...modifyHistoric})
        .then(result => {
            req.session.successUpdateHistoric = `Historique ${req.body.pseudo} mis à jour avec succès.`;
            res.status(201).redirect(`/historics/${req.params.id}/update`);
        })
        .catch(error => {
            req.session.errorUpdateHistoric = `Erreur lors de la tentative de modification d'un historique, ${error.message}.`;
            res.status(500).redirect(`/historics/${req.params.id}/update`);
        });
    }
    catch(error) {
        console.log('Erreur lors du traitement des données : ', error);
    }
}

exports.listHistorics = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            res.status(200).redirect("/");
        }

        await findHistorics()
        .then(historics => {
            historics.sort((a, b) => {
                if(a.date < b.date) { return -1 }
                else if(a.date > b.date) { return 1 }
                else { return 0 }
            });

            const title = "Liste des historiques";
            const successDeleteHistoric = req.session.successDeleteHistoric ? req.session.successDeleteHistoric : null;
            const errorHistoric = req.session.errorHistoric ? req.session.errorHistoric : null;

            res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/historics/list-historics.ejs"), { title, historics, errorHistoric, successDeleteHistoric });
        })
        .catch(error => console.log(error))

    }
    catch(error) {
        console.log("Try Error List Historic Page : ", error);
    }
}

exports.createHistoric = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        const title = "Créer un historique";
        const errorCreateHistoric = req.session.errorCreateHistoric ? req.session.errorCreateHistoric : null;
        const successCreateHistoric = req.session.successCreateHistoric ? req.session.successCreateHistoric : null;
        res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/historics/create-historic.ejs"), { title, errorCreateHistoric, successCreateHistoric });
    }
    catch(error) {
        console.log("Try Error Create Historic Page : ", error);
    }
}

exports.createConfirmHistoric = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        verifInputs(req, res);

        await findHistoricByDate(req)
        .then(historic => {
            if(historic) {
                req.session.errorCreateHistoric = `Historic ${historic.date} existe déjà`;
                res.status(401).redirect("/historics/create");
            } else {
                newHistoric(req, res);
            }
        })
        .catch(error => {
            req.session.errorCreateHistoric = `Erreur lors de la recherche d'un historic identique, ${error.message}.`;
            res.status(500).redirect("/historics/create");
        })
    }
    catch(error) {
        console.log("Try Error Create Historic Page : ", error);
    }
}

exports.updateHistoric = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        await findHistoricById(req.params.id)
        .then(historic => {
            if(historic) {
                const title = "Mettre à jour un historique";
                const errorUpdateHistoric = req.session.errorUpdateHistoric ? req.session.errorUpdateHistoric : null;
                const successUpdateHistoric = req.session.successUpdateHistoric ? req.session.successUpdateHistoric : null;
                res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/historics/update-historic.ejs"), { title, historic, errorUpdateHistoric, successUpdateHistoric });
            } else {
                req.session.errorHistoric = `Historic inexistant`;
                res.status(401).redirect('/historics');
            }
        })
        .catch(error => {
            req.session.errorHistoric = `Erreur Mise à jour Historique`;
            console.log(error);
            res.status(401).redirect('/historics');
        })      
    }
    catch(error) {
        console.log("Try Error Update Historic Page : ", error);
    }
}

exports.updateConfirmHistoric = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        verifInputs(req, res);

        await findHistoricById(req.params.id)
        .then(historic => {
            if(historic) {
                modifyHistoric(req, res);
            } else {
                req.session.errorHistoric = `Historique ${req.params.id} inexistant`;
                res.status(401).redirect(`/historics`);
            }
        })
        .catch(error => {
            req.session.errorHistoric = `Erreur lors de la recherche d'un historique, ${error.message}.`;
            res.status(500).redirect("/historics");
        })       
    }
    catch(error) {
        console.log("Try Error Update Historic Page : ", error);
    }
}

exports.deleteHistoric = async (req, res, next) => {
    try {
        const title = "Suppression d'un historique";

        await findHistoricById(req.params.id)
        .then(historic => {
            if(!historic) { 
                req.session.errorHistoric = `Historique ${req.params.id} non trouvé`;
                req.session.successDeleteHistoric = null;
                res.redirect("/historics");
            } else {
                const errorDeleteHistoric = req.session.errorDeleteHistoric ? req.session.errorDeleteHistoric : null;
                res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/historics/delete-historic.ejs"), { title, historic, errorDeleteHistoric });
            }
        })
        .catch(error => {
            req.session.successDeleteHistoric = null;
            req.session.errorHistoric = `Historique ${req.params.id} non trouvé, ${error.message}`;
            res.redirect("/historics");
        })
    }
    catch(error) {
        console.log("Try Error Delete Historic Page : ", error);
    }
}

exports.deleteConfirmHistoric = async (req, res, next) => {
    try {        
        await findHistoricById(req.params.id)
        .then(historic => {
            if(!historic) {
                req.session.errorHistoric = `Historique ${req.params.id} non trouvé`;
                req.session.successDeleteHistoric = null;
                res.redirect("/historics");
            } else {
                historic.deleteOne({ _id: req.params.id })
                .then(() => {
                    req.session.successDeleteHistoric = `Historique ${historic.date} supprimé avec succès.`;
                    req.session.errorHistoric = null;
                    res.redirect("/historics");
                })
                .catch(error => {
                    req.session.errorDeleteHistoric = `Erreur lors de la suppression d'un historique. ${error.message}`;
                    res.redirect(`/historics/${historic._id}/delete`) 
                })
            }
        })
        .catch(error => {
            req.session.errorHistoric = `Historique ${req.params.id} non trouvé, ${error.message}`;
            res.redirect("/historics");
        })
    }
    catch(error) {
        console.log("Try Error Delete Historic Page : ", error);
    }
}
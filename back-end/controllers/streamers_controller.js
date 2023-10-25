const Streamer = require("../models/Streamer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const { body, validationResult } = require("express-validator");

const verifInputs = async (req, res) => {
    body('pseudo', 'Le pseudo est obligatoire').isString().notEmpty();
    body('channel', 'La chaine twitch est obligatoire').isString().notEmpty();

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(422).json({errors : errors.array()});
    }
}

const findStreamerById = async (id) => {
    return await Streamer.findOne({ _id: id });
}

const findStreamerByName = async (req) => {
    return await Streamer.findOne({ name: req.body.pseudo })
}

const newStreamer = async (req, res) => {

    try{
        console.log(req);
        const file = req.files[0];
        const tempFilePath = path.join(__dirname, "../../front-end/public/assets/images/temp", file.originalname);
        const sanitizedPseudo = req.body.pseudo.toLowerCase().split(' ').join('-');
        const tempNewFilePath = path.join(__dirname, "../../front-end/public/assets/images/temp", `${sanitizedPseudo}.webp`);
        const newFilePath = path.join(__dirname, "../../front-end/public/assets/images/streamers", `${sanitizedPseudo}.webp`);
        
        fs.writeFile(tempFilePath, file.buffer, (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture de tempFilePath : ', err);
            }
        });

        if (fs.existsSync(newFilePath)) {
            try {
                fs.writeFile(newFilePath, file.buffer, (err) => {
                    if (err) {
                        console.error('Erreur lors de l\'écriture de newFilePath : ', err);
                    }
                });
            } catch(error) {
                console.log('Erreur lors de l\'écriture de newFilePath : ', error);
            }
        } else {
            await sharp(tempFilePath)
            .webp({quality: 80})
            .toFile(tempNewFilePath)
            
            await sharp(tempNewFilePath)
            .toFile(newFilePath);
        }
      
        const newStreamer = new Streamer({
            name: req.body.pseudo,
            twitch: req.body.channel
        });

        newStreamer.save()
        .then(result => {
            req.session.successCreateStreamer = `Streamer ${result.name} créé avec succès.`;
            res.status(201).redirect("/streamers/create");
        })
        .catch(error => {
            req.session.errorCreateStreamer = `Erreur lors de la tentative de création d'un streamer, ${error.message}.`;
            res.status(500).redirect("/streamers/create");
        });
    }
    catch(error) {
        console.log('Erreur lors du traitement des données : ', error);
    }
}

const modifyStreamer = async (req, res) => {

    try{
        if(req.files.length > 0) {
            const file = req.files[0];

            const tempFilePath = path.join(__dirname, "../../front-end/public/assets/images/temp", file.originalname);
            const sanitizedPseudo = req.body.pseudo.toLowerCase().split(' ').join('-');
            const tempNewFilePath = path.join(__dirname, "../../front-end/public/assets/images/temp", `${sanitizedPseudo}.webp`);
            const newFilePath = path.join(__dirname, "../../front-end/public/assets/images/streamers", `${sanitizedPseudo}.webp`);
            
            fs.writeFile(tempFilePath, file.buffer, (err) => {
                if (err) {
                    console.error('Erreur lors de l\'écriture de tempFilePath : ', err);
                }
            });
            
            if (fs.existsSync(newFilePath)) {
                try {
                    fs.writeFile(newFilePath, file.buffer, (err) => {
                        if (err) {
                            console.error('Erreur lors de l\'écriture de newFilePath : ', err);
                        }
                    });
                } catch(error) {
                    console.log('Erreur lors de l\'écriture de newFilePath : ', error);
                }
            } else {
                await sharp(tempFilePath)
                .webp({quality: 80})
                .toFile(tempNewFilePath)
                
                await sharp(tempNewFilePath)
                .toFile(newFilePath);
            }
        } else {
            await findStreamerById(req.params.id)
            .then(streamer => {
                const sanitizedPseudo = req.body.pseudo.toLowerCase().split(' ').join('-');
                const oldPseudo = streamer.name.toLowerCase().split(' ').join('-');
                const oldFilePath = path.join(__dirname, "../../front-end/public/assets/images/streamers", `${oldPseudo}.webp`);
                const newFilePath = path.join(__dirname, "../../front-end/public/assets/images/streamers", `${sanitizedPseudo}.webp`);
    
                fs.rename(oldFilePath, newFilePath, (err) => {
                    if (err) {
                        console.error('Erreur lors du renommage du fichier : ', err);
                    } else {
                        console.log('Fichier renommé avec succès !');
                    }
                });
            })
            .catch(error => console.log(error));
        }
            
        const modifyStreamer = {
            name: req.body.pseudo,
            twitch: req.body.channel
        };

        await Streamer.updateOne({ _id: req.params.id}, { ...modifyStreamer})
        .then(result => {
            req.session.successUpdateStreamer = `Streamer ${req.body.pseudo} mis à jour avec succès.`;
            res.status(201).redirect(`/streamers/${req.params.id}/update`);
        })
        .catch(error => {
            req.session.errorUpdateStreamer = `Erreur lors de la tentative de modification d'un streamer, ${error.message}.`;
            res.status(500).redirect(`/streamers/${req.params.id}/update`);
        });
    }
    catch(error) {
        console.log('Erreur lors du traitement des données : ', error);
    }
}

exports.listStreamers = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            res.status(200).redirect("/");
        }

        let page = parseInt(req.query.page);
        const totalStreamers = await Streamer.countDocuments();
        const limit = 8;
        const maxPage = Math.ceil(totalStreamers / limit);
        const nextPage = page + 1 > maxPage ? 1 : page + 1;
        const previousPage = page - 1 < 1 ? maxPage : page - 1;
        const skip = (page - 1 ) * limit;
        const title = "Liste des streamers";
        const successDeleteStreamer = req.session.successDeleteStreamer ? req.session.successDeleteStreamer : null;
        const errorStreamer = req.session.errorStreamer ? req.session.errorStreamer : null;
        const streamers = await Streamer.find().sort({name: 1}).skip(skip).limit(limit);
        
        res.status(200).render(path.join(__dirname, "../views/admin/streamers/list-streamers.ejs"), { title, streamers, page, maxPage, previousPage, nextPage, errorStreamer, successDeleteStreamer, token });

    }
    catch(error) {
        console.log("Try Error List Streamers Page : ", error);
    }
}

exports.streamersList = async (req, res, next) => {
    try {
        const streamers = await Streamer.find().sort({name: 1});
        res.status(200).json(streamers)
    }
    catch(error) {
        console.log("Try Error List Streamers Page : ", error);
    }
}

exports.createStreamer = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        const title = "Créer un streamer";
        const errorCreateStreamer = req.session.errorCreateStreamer ? req.session.errorCreateStreamer : null;
        const successCreateStreamer = req.session.successCreateStreamer ? req.session.successCreateStreamer : null;
        res.status(200).render(path.join(__dirname, "../views/admin/streamers/create-streamer.ejs"), { title, errorCreateStreamer, successCreateStreamer, token });
    }
    catch(error) {
        console.log("Try Error Create Streamer Page : ", error);
    }
}

exports.createConfirmStreamer = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        verifInputs(req, res);

        await findStreamerByName(req)
        .then(streamer => {
            if(streamer) {
                req.session.errorCreateStreamer = `Streamer ${streamer.name} existe déjà`;
                res.status(401).redirect("/streamers/create");
            } else {
                newStreamer(req, res);
            }
        })
        .catch(error => {
            req.session.errorCreateStreamer = `Erreur lors de la recherche d'un streamer du même nom, ${error.message}.`;
            res.status(500).redirect("/streamers/create");
        })
    }
    catch(error) {
        console.log("Try Error Create Streamer Page : ", error);
    }
}

exports.updateStreamer = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        await findStreamerById(req.params.id)
        .then(streamer => {
            if(streamer) {
                const title = "Mettre à jour un streamer";
                const errorUpdateStreamer = req.session.errorUpdateStreamer ? req.session.errorUpdateStreamer : null;
                const successUpdateStreamer = req.session.successUpdateStreamer ? req.session.successUpdateStreamer : null;
                res.status(200).render(path.join(__dirname, "../views/admin/streamers/update-streamer.ejs"), { title, streamer, errorUpdateStreamer, successUpdateStreamer, token });
            } else {
                req.session.errorStreamer = `Streamer inexistant`;
                res.status(401).redirect('/streamers');
            }
        })
        .catch(error => {
            req.session.errorStreamer = `Erreur Mise à jour Streamer`;
            console.log(error);
            res.status(401).redirect('/streamers');
        })      
    }
    catch(error) {
        console.log("Try Error Update Streamer Page : ", error);
    }
}

exports.updateConfirmStreamer = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        verifInputs(req, res);

        await findStreamerById(req.params.id)
        .then(streamer => {
            if(streamer) {
                modifyStreamer(req, res);
            } else {
                req.session.errorStreamer = `Streamer ${req.params.id} inexistant`;
                res.status(401).redirect(`/streamers`);
            }
        })
        .catch(error => {
            req.session.errorStreamer = `Erreur lors de la recherche d'un streamer, ${error.message}.`;
            res.status(500).redirect("/streamers");
        })       
    }
    catch(error) {
        console.log("Try Error Update Streamer Page : ", error);
    }
}

exports.deleteStreamer = async (req, res, next) => {
    try {
        const title = "Supprimer un streamer";

        await findStreamerById(req.params.id)
        .then(streamer => {
            if(!streamer) { 
                req.session.errorStreamer = `Streamer ${req.params.id} non trouvé`;
                req.session.successDeleteStreamer = null;
                res.redirect("/streamers");
            } else {
                const errorDeleteStreamer = req.session.errorDeleteStreamer ? req.session.errorDeleteStreamer : null;
                res.status(200).render(path.join(__dirname, "../views/admin/streamers/delete-streamer.ejs"), { title, streamer, errorDeleteStreamer, token });
            }
        })
        .catch(error => {
            req.session.successDeleteStreamer = null;
            req.session.errorStreamer = `Streamer ${req.params.id} non trouvé, ${error.message}`;
            res.redirect("/streamers");
        })
    }
    catch(error) {
        console.log("Try Error Delete Streamer Page : ", error);
    }
}

exports.deleteConfirmStreamer = async (req, res, next) => {
    try {        
        await findStreamerById(req.params.id)
        .then(streamer => {
            if(!streamer) {
                req.session.errorStreamer = `Streamer ${req.params.id} non trouvé`;
                req.session.successDeleteStreamer = null;
                res.redirect("/streamers");
            } else {
                streamer.deleteOne({ _id: req.params.id })
                .then(() => {
                    req.session.successDeleteStreamer = `Streamer ${streamer.name} supprimé avec succès.`;
                    req.session.errorStreamer = null;
                    res.redirect("/streamers");
                })
                .catch(error => {
                    req.session.errorDeleteStreamer = `Erreur lors de la suppression d'un streamer. ${error.message}`;
                    res.redirect(`/streamers/${streamer._id}/delete`) 
                })
            }
        })
        .catch(error => {
            req.session.errorStreamer = `Streamer ${req.params.id} non trouvé, ${error.message}`;
            res.redirect("/streamers");
        })
    }
    catch(error) {
        console.log("Try Error Delete Streamer Page : ", error);
    }
}
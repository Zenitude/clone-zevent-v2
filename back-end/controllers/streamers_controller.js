const Streamer = require("../models/Streamer");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs/promises");
const { body, validationResult } = require("express-validator");

const verifInputs = async (req, res) => {
    body('pseudo', 'Le pseudo est obligatoire').isString().notEmpty();
    body('channel', 'La chaine twitch est obligatoire').isString().notEmpty();

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(422).json({errors : errors.array()});
    }
}

const findStreamers = async () => {
    return await Streamer.find();
}

const findStreamerById = async (id) => {
    return await Streamer.findOne({ _id: id });
}

const findStreamerByName = async (req) => {
    return await Streamer.findOne({ name: req.body.pseudo })
}

const storage = multer.memoryStorage();
exports.upload = multer({storage: storage});

const newStreamer = async (req, res) => {

    const newStreamer = new Streamer({
        name: req.body.pseudo,
        twitch: req.body.channel
    });

    const sanitizedPseudo = req.body.pseudo.toLowerCase().split(' ').join('-');
    const webpFilename = sanitizedPseudo + ".webp";
    const webpPath = path.join(__dirname, `../../front-end/public/assets/images/streamers/${webpFilename}`);
    // const convertedWebpPath = path.join(__dirname, `../../front-end/public/assets/images/streamers/temp.webp`);
    console.log(sanitizedPseudo);
    console.log(webpFilename)
    console.log(webpPath);
    // await sharp(req.file.buffer)
    // .webp({ quality: 80 })
    // .toFile(convertedWebpPath);

    // Check if the generated WebP filename already exists
    // if (await fileExists(webpPath)) {
    //     await fs.unlink(webpPath);
    // }

    // await fs.rename(convertedWebpPath, webpPath);
    
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

exports.listStreamers = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            res.status(200).redirect("/");
        }

        await findStreamers()
        .then(streamers => {
            streamers.sort((a, b) => {
                if(a.name < b.name) { return -1 }
                else if(a.name > b.name) { return 1 }
                else { return 0 }
            });

            const title = "Du 9 au 11 septembre 2022";
            const successDeleteStreamer = req.session.successDeleteStreamer ? req.session.successDeleteStreamer : null;
            const errorDeleteStreamer = req.session.errorDeleteStreamer ? req.session.errorDeleteStreamer : null;

            res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/streamers/list-streamers.ejs"), { title, streamers, errorDeleteStreamer, successDeleteStreamer });
        })
        .catch(error => console.log(error))

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

        const title = "Du 9 au 11 septembre 2022";
        const errorCreateStreamer = req.session.errorCreateStreamer ? req.session.errorCreateStreamer : null;
        const successCreateStreamer = req.session.successCreateStreamer ? req.session.successCreateStreamer : null;
        res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/streamers/create-streamer.ejs"), { title, errorCreateStreamer, successCreateStreamer });
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

        const title = "Du 9 au 11 septembre 2022";
        res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/streamers/update-streamer.ejs"), { title });        
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

        const title = "Du 9 au 11 septembre 2022";
        res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/streamers/update-streamer.ejs"), { title });        
    }
    catch(error) {
        console.log("Try Error Update Streamer Page : ", error);
    }
}

exports.deleteStreamer = async (req, res, next) => {
    try {
        const title = "Du 9 au 11 septembre 2022";

        await findStreamerById(req.params.id)
        .then(streamer => {
            if(!streamer) { 
                req.session.errorDeleteStreamer = `Streamer ${req.params.id} non trouvé`;
                req.session.successDeleteStreamer = null;
                res.redirect("/streamers");
            } else {
                const errorDeleteStreamer = req.session.errorDeleteStreamer ? req.session.errorDeleteStreamer : null;
                res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/streamers/delete-streamer.ejs"), { title, streamer, errorDeleteStreamer });
            }
        })
        .catch(error => {
            req.session.successDeleteStreamer = null;
            req.session.errorDeleteStreamer = `Streamer ${req.params.id} non trouvé, ${error.message}`;
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
                req.session.errorDeleteStreamer = `Streamer ${req.params.id} non trouvé`;
                req.session.successDeleteStreamer = null;
                res.redirect("/streamers");
            } else {
                streamer.deleteOne({ _id: req.params.id })
                .then(() => {
                    req.session.successDeleteStreamer = `Streamer ${streamer.name} supprimé avec succès.`;
                    req.session.errorDeleteStreamer = null;
                    res.redirect("/streamers");
                })
                .catch(error => {
                    req.session.errorDeleteStreamer = `Erreur lors de la suppression d'un streamer. ${error.message}`;
                    res.redirect(`/streamers/${streamer._id}/delete`) 
                })
            }
        })
        .catch(error => {
            req.session.errorDeleteStreamer = `Streamer ${req.params.id} non trouvé, ${error.message}`;
            res.redirect("/streamers");
        })
    }
    catch(error) {
        console.log("Try Error Delete Streamer Page : ", error);
    }
}
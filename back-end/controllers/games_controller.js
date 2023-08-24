const Game = require("../models/Game");
const path = require("path");
const fs = require('fs');
const sharp = require('sharp');
const { body, validationResult } = require("express-validator");

const verifInputs = async (req, res) => {
    body('name', 'Le nom est obligatoire').isString().notEmpty();
    body('link', 'Le lien est obligatoire').isString().notEmpty();

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(422).json({errors : errors.array()});
    }
}

const findGames = async () => {
    return await Game.find();
}

const findGameById = async (id) => {
    return await Game.findOne({ _id: id });
}

const findGameByName = async (req) => {
    return await Game.findOne({ name: req.body.name })
}

const newGame = async (req, res) => {

    try{
        console.log(req);
        const file = req.files[0];
        const tempFilePath = path.join(__dirname, "../../front-end/public/assets/images/temp", file.originalname);
        const sanitizedName = req.body.name.replace(':', 'µ').toLowerCase().split(' ').join('-');
        const tempNewFilePath = path.join(__dirname, "../../front-end/public/assets/images/temp", `${sanitizedName}.webp`);
        const newFilePath = path.join(__dirname, "../../front-end/public/assets/images/games", `${sanitizedName}.webp`);
        
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
        
        const newGame = new Game({
            name: req.body.name,
            link: req.body.link
        });

        newGame.save()
        .then(result => {
            req.session.successCreateGame = `Le jeu ${result.name} a été créé avec succès.`;
            res.status(201).redirect("/games/create");
        })
        .catch(error => {
            req.session.errorCreateGame = `Erreur lors de la tentative de création d'un jeu, ${error.message}.`;
            res.status(500).redirect("/games/create");
        });
    }
    catch(error) {
        console.log('Erreur lors du traitement des données : ', error);
    }
}

const modifyGame = async (req, res) => {

    try{

        if(req.files.length > 0) {
            const file = req.files[0];

            const tempFilePath = path.join(__dirname, "../../front-end/public/assets/images/temp", file.originalname);
            const sanitizedName = req.body.name.replace(':', 'µ').toLowerCase().split(' ').join('-');
            const tempNewFilePath = path.join(__dirname, "../../front-end/public/assets/images/temp", `${sanitizedName}.webp`);
            const newFilePath = path.join(__dirname, "../../front-end/public/assets/images/games", `${sanitizedName}.webp`);
            
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
            await findGameById(req.params.id)
            .then(game => {
                const sanitizedName = req.body.name.replace(':', 'µ').toLowerCase().split(' ').join('-');
                const oldName = game.name.replace(':', 'µ').toLowerCase().split(' ').join('-');
                const oldFilePath = path.join(__dirname, "../../front-end/public/assets/images/games", `${oldName}.webp`);
                const newFilePath = path.join(__dirname, "../../front-end/public/assets/images/games", `${sanitizedName}.webp`);
    
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
        
        const modifyGame = {
            name: req.body.name,
            link: req.body.link
        };

        await Game.updateOne({ _id: req.params.id}, { ...modifyGame})
        .then(result => {
            req.session.successUpdateGame = `Le jeu ${req.body.name} a été mis à jour avec succès.`;
            res.status(201).redirect(`/games/${req.params.id}/update`);
        })
        .catch(error => {
            req.session.errorUpdateGame = `Erreur lors de la tentative de modification d'un jeu, ${error.message}.`;
            res.status(500).redirect(`/games/${req.params.id}/update`);
        });
    }
    catch(error) {
        console.log('Erreur lors du traitement des données : ', error);
    }
}

exports.listGames = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            res.status(200).redirect("/");
        }

        await findGames()
        .then(games => {
            games.sort((a, b) => {
                if(a.name < b.name) { return -1 }
                else if(a.name > b.name) { return 1 }
                else { return 0 }
            });

            const title = "Liste des jeux";
            const successDeleteGame = req.session.successDeleteGame ? req.session.successDeleteGame : null;
            const errorGame = req.session.errorGame ? req.session.errorGame : null;

            res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/games/list-games.ejs"), { title, games, errorGame, successDeleteGame });
        })
        .catch(error => console.log(error))

    }
    catch(error) {
        console.log("Try Error List Game Page : ", error);
    }
}

exports.createGame = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        const title = "Créer un jeu";
        const errorCreateGame = req.session.errorCreateGame ? req.session.errorCreateGame : null;
        const successCreateGame = req.session.successCreateGame ? req.session.successCreateGame : null;
        res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/games/create-game.ejs"), { title, errorCreateGame, successCreateGame });
    }
    catch(error) {
        console.log("Try Error Create Game Page : ", error);
    }
}

exports.createConfirmGame = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        verifInputs(req, res);

        await findGameByName(req)
        .then(game => {
            if(game) {
                req.session.errorCreateGame = `Le jeu ${game.date} existe déjà`;
                res.status(401).redirect("/games/create");
            } else {
                newGame(req, res);
            }
        })
        .catch(error => {
            req.session.errorCreateGame = `Erreur lors de la recherche d'un jeu identique, ${error.message}.`;
            res.status(500).redirect("/games/create");
        })
    }
    catch(error) {
        console.log("Try Error Create Game Page : ", error);
    }
}

exports.updateGame = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        await findGameById(req.params.id)
        .then(game => {
            if(game) {
                const title = "Mettre à jour un jeu";
                const errorUpdateGame = req.session.errorUpdateGame ? req.session.errorUpdateGame : null;
                const successUpdateGame = req.session.successUpdateGame ? req.session.successUpdateGame : null;
                res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/games/update-game.ejs"), { title, game, errorUpdateGame, successUpdateGame });
            } else {
                req.session.errorGame = `Jeu inexistant`;
                res.status(401).redirect('/games');
            }
        })
        .catch(error => {
            req.session.errorGame = `Erreur Mise à jour jeu`;
            console.log(error);
            res.status(401).redirect('/games');
        })      
    }
    catch(error) {
        console.log("Try Error Update Game Page : ", error);
    }
}

exports.updateConfirmGame = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            res.status(200).redirect("/");
        }

        verifInputs(req, res);

        await findGameById(req.params.id)
        .then(game => {
            if(game) {
                modifyGame(req, res);
            } else {
                req.session.errorGame = `Jeu ${req.params.id} inexistant`;
                res.status(401).redirect(`/games`);
            }
        })
        .catch(error => {
            req.session.errorGame = `Erreur lors de la recherche d'un jeu, ${error.message}.`;
            res.status(500).redirect("/games");
        })       
    }
    catch(error) {
        console.log("Try Error Update Game Page : ", error);
    }
}

exports.deleteGame = async (req, res, next) => {
    try {
        const title = "Suppression d'un jeu";

        await findGameById(req.params.id)
        .then(game => {
            if(!game) { 
                req.session.errorGame = `Jeu ${req.params.id} non trouvé`;
                req.session.successDeleteGame = null;
                res.redirect("/games");
            } else {
                const errorDeleteGame = req.session.errorDeleteGame ? req.session.errorDeleteGame : null;
                res.status(200).render(path.join(__dirname, "../../front-end/pages/admin/games/delete-game.ejs"), { title, game, errorDeleteGame });
            }
        })
        .catch(error => {
            req.session.successDeleteGame = null;
            req.session.errorGame = `Jeu ${req.params.id} non trouvé, ${error.message}`;
            res.redirect("/games");
        })
    }
    catch(error) {
        console.log("Try Error Delete Game Page : ", error);
    }
}

exports.deleteConfirmGame = async (req, res, next) => {
    try {        
        await findGameById(req.params.id)
        .then(game => {
            if(!game) {
                req.session.errorGame = `Jeu ${req.params.id} non trouvé`;
                req.session.successDeleteGame = null;
                res.redirect("/games");
            } else {
                game.deleteOne({ _id: req.params.id })
                .then(() => {
                    req.session.successDeleteGame = `Jeu ${game.name} supprimé avec succès.`;
                    req.session.errorGame = null;
                    res.redirect("/games");
                })
                .catch(error => {
                    req.session.errorDeleteGame = `Erreur lors de la suppression d'un jeu. ${error.message}`;
                    res.redirect(`/games/${game._id}/delete`) 
                })
            }
        })
        .catch(error => {
            req.session.errorGame = `Jeu ${req.params.id} non trouvé, ${error.message}`;
            res.redirect("/games");
        })
    }
    catch(error) {
        console.log("Try Error Delete Game Page : ", error);
    }
}
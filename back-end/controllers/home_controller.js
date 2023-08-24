const Streamer = require("../models/Streamer");
const Historic = require("../models/Historic");
const bcrypt = require('bcrypt');
const path = require("path");

const findStreamers = async () => {
    return await Streamer.find();
}

const findHistorics = async () => {
    return await Historic.find();
}

exports.homeRender = async (req, res, next) => {
    try {
        const title = "Accueil";
        const streamers = await findStreamers();
        const historics = await findHistorics();    
        res.status(200).render(path.join(__dirname, "../../front-end/pages/index.ejs"), { title, streamers, historics });        
    }
    catch(error) {
        console.log("Try Error Find Home : ", error);
    }
}
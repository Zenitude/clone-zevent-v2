const Game = require("../models/Game");
const path = require("path");

const findGames = async () => {
    return await Game.find();
}

exports.clipsRender = async (req, res, next) => {
    try {
        const title = "Les clips";
        const games = await findGames();  
        res.status(200).render(path.join(__dirname, "../../front-end/pages/clips.ejs"), { title, games });        
    }
    catch(error) {
        console.log("Try Error Find Clips : ", error);
    }
}
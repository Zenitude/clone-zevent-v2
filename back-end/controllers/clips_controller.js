const path = require("path");

exports.clipsRender = async (req, res, next) => {
    try {
        const title = "Du 9 au 11 septembre 2022";
        res.status(200).render(path.join(__dirname, "../../front-end/pages/clips.ejs"), { title });        
    }
    catch(error) {
        console.log("Try Error Find Clips : ", error);
    }
}
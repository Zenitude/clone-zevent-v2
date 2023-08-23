const path = require("path");

exports.associationsRender = async (req, res, next) => {
    try {
        const title = "Les associations";
        
        res.status(200).render(path.join(__dirname, "../../front-end/pages/associations.ejs"), { title });        
    }
    catch(error) {
        console.log("Try Error Find Associations : ", error);
    }
}
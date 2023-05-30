const path = require("path");
const fs = require("fs");

exports.shopRender = async (req, res, next) => {
    try {
        const title = "Du 9 au 11 septembre 2022";
        const datas = fs.readFileSync(path.join(__dirname, '../utils/database/shop.json'), 'utf-8');
        const products = await JSON.parse(datas);
        res.status(200).render(path.join(__dirname, "../../front-end/pages/shop.ejs"), { title, products });        
    }
    catch(error) {
        console.log("Try Error Find Shop : ", error);
    }
}
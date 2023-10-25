const path = require("path");
const fs = require("fs");

exports.shopRender = async (req, res, next) => {
    try { 
        const datas = fs.readFileSync(path.join(__dirname, '../utils/database/shop.json'), 'utf-8');
        const products = await JSON.parse(datas);
        res.status(200).json(products);      
    }
    catch(error) {
        console.log("Try Error Find Shop : ", error);
    }
}
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res, next) => {
    fs.readFile('../front-end/index.ejs', 'utf-8', (error, data) => {
        if(error) {
            console.log(`Error Read Home page : ${error}`);
            console.log(__dirname)
            res.status(500).json({message: `Erreur Lecture Page Accueil`});
        } else {
            const title = 'Du 9 au 11 septembre 2022';
            const content = data;
            res.status(200).render(path.join(__dirname, '../../front-end/pages/components/layout.ejs'), { title, content });
        }
    });
})

module.exports = router;
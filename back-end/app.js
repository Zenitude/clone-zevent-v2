const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const homeRoutes = require('./routes/home');
// const clipsRoutes = require('./routes/clips');
// const associationsRoutes = require('./routes/associations');
// const shopRoutes = require('./routes/shop');

app.use(morgan("dev"));

app.use('/images', express.static(path.join(__dirname, "../front-end/public/assets/images")));
app.use('/styles', express.static(path.join(__dirname, "../front-end/public/styles/css/")));
app.use('/scripts', express.static(path.join(__dirname, "../front-end/public/scripts/")));

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/', homeRoutes);

app.use((req, res, next) => {
    const title = 'Du 9 au 11 juin 2022';
    fs.readFile('../front-end/pages/error.ejs', 'utf-8', (error, data) => {
        if(error) {
            console.log(`Erreur Lecture Error page : ${error}`)
            res.status(500).json({message: 'Erreur lors de la lecture de la page Erreur 404'})
        }

        const content = data;
        res.status(200).render(path.join(__dirname, '../front-end/pages/components/layout.ejs'), {title, content});

    });
    
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Site disponible à l'adresse suivante : http://${process.env.HOST}:${process.env.PORT ? process.env.PORT : 3000}`);
});
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { dateMiddleware } = require("./middlewares/date");

dotenv.config();
const app = express();

// app.use(express.urlencoded({extended:true}))
// app.use(express.json());

const homeRoutes = require('./routes/home');
const associationsRoutes = require('./routes/associations');
const clipsRoutes = require('./routes/clips');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/error');

app.use(dateMiddleware);
app.use(morgan("dev"));

app.use("/images", express.static(path.join(__dirname, "./public/assets/images")));
app.use("/styles", express.static(path.join(__dirname, "./public/styles/css/")));
app.use("/scripts", express.static(path.join(__dirname, "./public/scripts/")));


app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.use(homeRoutes);
app.use(associationsRoutes);
app.use(clipsRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

app.listen(process.env.PORT || 3002, () => {
    console.log(`Site disponible à l'adresse suivante : http://${process.env.HOST ? process.env.HOST : 'localhost'}:${process.env.PORT ? process.env.PORT : 3000}`);
});


const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const { dateMiddleware } = require("./utils/middlewares/date");
const connectDb = require("./utils/database/database");

dotenv.config();
const app = express();

// app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json());
app.use(methodOverride("_method"));
app.use(multer().any());
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY_AUTH,
    resave: false,
    saveUninitialized: false
}))

const homeRoutes = require("./routes/home");
const associationsRoutes = require("./routes/associations");
const clipsRoutes = require("./routes/clips");
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const streamersRoutes = require('./routes/streamers');
const historicsRoutes = require('./routes/historics');
const usersRoutes = require('./routes/users');

connectDb();

app.use(dateMiddleware);
app.use(morgan("dev"));

app.use("/images", express.static(path.join(__dirname, "../front-end/public/assets/images")));
app.use("/styles", express.static(path.join(__dirname, "../front-end/public/styles/css/")));
app.use("/scripts", express.static(path.join(__dirname, "../front-end/public/scripts/")));

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
app.use(adminRoutes);
app.use(streamersRoutes);
app.use(historicsRoutes);
app.use(usersRoutes);

app.use((req, res, next) => {
    try{
        const title = "Erreur 404";
        res.status(200).render(path.join(__dirname, "../front-end/pages/error.ejs"), {title});    
    }
    catch(error) {
        console.log("Error Try Page Error : ", error)
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Site disponible à l'adresse suivante : http://${process.env.HOST}:${process.env.PORT ? process.env.PORT : 3000}`);
});


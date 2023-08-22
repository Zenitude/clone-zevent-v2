
const formidable = require('formidable');  
 
routeprincipale.post('/image', (req, res, next) => {
    const form = new formidable.IncomingForm();  
    form.parse(req);
    form.uploadDir = '/public/Dicos/img';
    form.on('fileBegin', function (name, file) {
        console.log(__dirname + '/public/Dicos/img/' + file.name);
        file.path = __dirname + '/public/Dicos/img/' + file.name;    
    });  
    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name);
    });
    return res.send("Ok");
});

form.parse(req, async (err, fields, files) => {
    if (err) {
        // Gérer l'erreur de l'upload
        return res.status(500).send('Erreur lors de l\'upload du fichier.');
    }

    const file = files.file.path;

    // Conversion en WebP
    const convertedWebpPath = path.join(__dirname, '../../front-end/public/assets/images/streamers', 'temp.webp');

    await sharp(file)
    .webp({ quality: 80 })
    .toFile(convertedWebpPath);

    const sanitizedPseudo = fields.pseudo.toLowerCase().split(' ').join('-');
    const webpFilename = sanitizedPseudo + '.webp';
    const webpPath = path.join(__dirname, '../../front-end/public/assets/images/streamers', webpFilename);

    if (await fileExists(webpPath)) {
        await fs.unlink(webpPath);
    }

    await fs.rename(convertedWebpPath, webpPath);

    const newStreamer = new Streamer({
        name: fields.pseudo,
        twitch: fields.channel
    });

    newStreamer.save()
    .then(result => {
        req.session.successCreateStreamer = `Streamer ${result.name} créé avec succès.`;
        res.status(201).redirect("/streamers/create");
    })
    .catch(error => {
        req.session.errorCreateStreamer = `Erreur lors de la tentative de création d'un streamer, ${error.message}.`;
        res.status(500).redirect("/streamers/create");
    });
});


const form = new formidable.IncomingForm();
    console.log(form)
    form.options.uploadDir = '/images/streamers';
    form.uploaddir = '/images/streamers'
    form.uploadDir = '/images/streamers'

    console.log('--- avant fileBegin ---');

    form.on('fileBegin', async (name, file) => {

        file.path = path.join("/images/streamers", "temp_" + file.name); 
        console.log('path : ', file.path);
    });

    console.log('--- avant file ---');

    form.on('file', async (name, file) => {
        const convertedWebpPath = path.join("/images/streamers", "temp.webp");

        await sharp(file.path)
        .webp({ quality: 80})
        .toFile(convertedWebpPath);

        const sanitizedPseudo = req.body.pseudo.toLowerCase().split(' ').join('-');
        const webpFilename = sanitizedPseudo + ".webp";
        const webpPath = path.join("/images/streamers", webpFilename);

        if (await fileExists(webpPath)) {
            await fs.unlink(webpPath);
            console.log("--- Ancien Fichier supprimé et nouveau fichier transféré ---")
        }

        await sharp(convertedWebpPath)
        .toFile(webpPath);
        console.log('--- Nouveau fichier transféré ---');
        console.log('Uploaded ' + file.name);
    });

    form.parse(req);

    console.log('--- avant newStreamer ---');



    

        await sharp(__dirname, `../../front-end/public/assets/images/streamers/${req.files[0].originalname}`)
        .webp({ quality: 80})
        .toFile(convertedWebpPath);

        const sanitizedPseudo = req.body.pseudo.toLowerCase().split(' ').join('-');
        const webpFilename = sanitizedPseudo + ".webp";
        const webpPath = path.join(__dirname, `../../front-end/public/assets/images/streamers/${webpFilename}`);

        if (await fileExists(webpPath)) {
            await fs.unlink(webpPath);
            console.log("--- Ancien Fichier supprimé et nouveau fichier transféré ---")
        }

        await sharp(convertedWebpPath)
        .toFile(webpPath);
        console.log('--- Nouveau fichier transféré ---');
        console.log('Uploaded ' + file.name);

/*
files[0].fieldname    = 'file'
files[0].orignalname  = 'doigbyetb.webp'
files[0].encoding     = '7bit'
files[0].mimetype     = 'image/webp'
files[0].buffer       = <Buffer 52 49 46 46 ec 6a 00 00 57 45 42 50 56 50 38 58 0a 00 00 00 08 00 00 00 2b 01 00 46 01 00 56 50 38 20 ee 69 00 00 d0 3d 01 9d 01 2a 2c 01 47 01 3e 1d ... 27330 more bytes>
files[0].size         = 27380
*/



/*
    files : [
        {
            fieldname: 'file',
            originalname: 'doigbyetb.webp',
            encoding: '7bit',
            mimetype: 'image/webp',
            buffer: <Buffer 52 49 46 46 ec 6a 00 00 57 45 42 50 56 50 38 58 0a 00 00 00 08 00 00 00 2b 01 00 46 01 00 56 50 38 20 ee 69 00 00 d0 3d 01 
            9d 01 2a 2c 01 47 01 3e 1d ... 27330 more bytes>,
            size: 27380
        }
    ]
*/


/*
const path = path.join(__dirname, `../../front-end/public/assets/images/streamers/")
const file = req.files[0].originalname
req.files[0].originalname = 'temp_' + file;

fs.access(path, (err) => {
    if(err) {
        fs.mkdirSync(path)
    }
})

const convertedWebpPath = path.join(__dirname, `../../front-end/public/assets/images/streamers/temp.webp`);

if(files[0].mimetype !== 'image/webp') {
    await sharp(__dirname, `../../front-end/public/assets/images/streamers/temp_${file}`)
    .webp({ quality: 80})
    .toFile(convertedWebpPath);
}

const sanitizedPseudo = req.body.pseudo.toLowerCase().split(' ').join('-');
const webpFilename = sanitizedPseudo + ".webp";
const webpPath = path.join(__dirname, `../../front-end/public/assets/images/streamers/${webpFilename}`);

if (await fileExists(webpPath)) {
    await fs.unlink(webpPath);
    await sharp(convertedWebpPath)
    .toFile(webpPath);
    console.log("--- Ancien Fichier supprimé et nouveau fichier transféré ---")
} else {
    await sharp(convertedWebpPath)
    .toFile(webpPath);
}
*/

/*const pathFiles = path.join(__dirname, `../../front-end/public/assets/images/streamers/`);
    const file = req.files[0].originalname
    
    req.files[0].originalname = 'temp_' + file;

    fs.access(pathFiles, (err) => {
        if(err) {
            fs.mkdirSync(path)
        }
    })

    const convertedWebpPath = path.join(__dirname, `../../front-end/public/assets/images/streamers/temp.webp`);
    const sanitizedPseudo = req.body.pseudo.toLowerCase().split(' ').join('-');
    const webpFilename = sanitizedPseudo + ".webp";
    const webpPath = path.join(__dirname, `../../front-end/public/assets/images/streamers/${webpFilename}`);
    const imagePath = path.join(__dirname, `../../front-end/public/assets/images/streamers/temp_${file}`)

    if(req.files[0].mimetype != 'image/webp') {
        await sharp(imagePath)
        .webp({ quality: 80})
        .toFile(convertedWebpPath);
    } else {
        await sharp(imagePath)
        .toFile(webpPath);
    }

    if (await fileExists(webpPath)) {
        fs.unlink(webpPath);
    }

    await sharp(imagePath)
    .toFile(webpPath);*/
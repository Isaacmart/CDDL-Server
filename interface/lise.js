const multer  = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const { abort } = require('process');
const ENV_PATH = "/usr/bin/python3";
const LISE_PATH = "/var/www/CDDL-Server/interface/LISE";
const PROJECT_PATH = "/var/www/CDDL-Server/interface"

const storage = multer.diskStorage({
    //Specifies the folder tmp as the location to store uploaded files, 
    //and to store them with their original name
    destination: function(req, file, cb) {
      cb(null, path.join(LISE_PATH, 'PDB'));
    }, 
    filename : function (req, file, cb) {
      cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage});


module.exports = (app) => {

    app.get(/^\/lise\/(?:(\d\w{3}))\/?$/i, async (req, res, next) => {
        //Connects to LISE service with a pdb file

        try {
            //Executes the LISE program 
            var id = req.params[0].toUpperCase();

            upload.single('file');

            const py = spawn(ENV_PATH, [path.join(LISE_PATH, "prep.py"), '-i', `${id}`], { timeout:60000 });
            const c = spawn(path.join(LISE_PATH, "a.out"), { timeout:60000 });

            py.stdout.on('data', (data) => {
                c.stdin.write(data);
            });

            py.stderr.on('data', (data) => {
                console.error(`py stderr: ${data}`);
            });

            py.on('close', (code) => {
                c.stdin.end();
            });

            c.stderr.on('data', (data) => {
                console.error(`c stderr: ${data}`);
            });

            c.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            c.on('exit', (code) => {
                console.log(`c process exited with code: ${code}`);
                res.download(path.join(PROJECT_PATH, `results`, `${id}_top10.pdb`), `${id}_top10.pdb`, (err) => {
                    if (err) {
                        console.log(`Error sending file: ${err}`);
                        res.end()
                    } else {
                        console.log(`Sent: ${id}.pdb`);
                    }
                });
            });

        } catch (err) {
            console.error(`Request error: ${err}`);
            res.end();
        }
    });

    app.get('/test/:id', async (req,res, next) => {
        //Test connection to server API
        res.status(200);
        console.log(req.params.id);
    });
}

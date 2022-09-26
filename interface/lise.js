const multer  = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const { abort } = require('process');
const ENV_PATH = "/usr/bin/python3";
const LISE_PATH = "/var/www/CDDL-Server/LISE";
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
            var pdb = req.params[0].toUpperCase();

            upload.single('file');

            if (run_LISE(pdb) != 2) {
                res.download(path.join(PROJECT_PATH, `results`, `${pdb}_top10.pdb`), `${pdb}_top10.pdb`, (err) => {
                    if (err) {
                        console.log(`Error sending file: ${err}`);
                        res.end()
                    } else {
                        console.log(`Sent: ${pdb}.pdb`);
                    }
                });
            }

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


function run_LISE(pdb) {
    //Executes the LISE program 

    const py = spawn(ENV_PATH, [path.join(LISE_PATH, "prep.py"), '-i', `${pdb}`], { timeout:60000 });
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
        console.log(`C process exited with code: ${code}`);
        return code;
    });

}
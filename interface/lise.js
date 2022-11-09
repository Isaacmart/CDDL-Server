const multer  = require('multer');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const { abort, pid } = require('process');
const { read } = require('fs');
const { connect } = require('http2');
const { resolve } = require('path');
const { rejects } = require('assert');
const ENV_PATH = "/Users/isaacmartinez/opt/anaconda3/envs/py3XF/bin/python3";
const LISE_PATH = "/Users/isaacmartinez/Desktop/CDDL-Server/LISE";
const PROJECT_PATH = "/Users/isaacmartinez/Desktop/CDDL-Server/interface";

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

    app.get(/^\/lise\/(?:(\d\w{3}))\/?$/i, async (req, res) => {
        //Connects to LISE service with a pdb file

        try {
            var pdb = req.params[0].toUpperCase();

            var lise_code = await run_LISE(pdb);

            if (lise_code != 2) {

                res.download(path.join(PROJECT_PATH, `results`, `${pdb}_top10.pdb`), `${pdb}_top10.pdb`, (err) => {
                    if (err) {
                        console.log(`Error sending file: ${path.join(PROJECT_PATH, `results`, `${pdb}_top10.pdb`)}`);
                        res.end();
                    } else {
                        console.log(`Sent: ${pdb}_top10.pdb`);
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

    return new Promise((resolve, reject) => {


        const py = spawn(ENV_PATH, [path.join(LISE_PATH, "prep.py"), '-i', `${pdb}`]);
    
        const c = spawn(path.join(LISE_PATH, "a.out"));

        py.stdout.on('data', (data) => {
            c.stdin.write(data);
            console.log(data.toString())
        });

        py.stderr.on('data', (data) => {
            console.log(data.toString());
        });

        c.stderr.on('data', (data) => {
            console.error(data.toString());
            //reject(c.exitCode);
        })

        c.stdout.on('data', (data) => {
            console.log(data.toString());
        });
    
        c.on('exit', (code) => {
            console.log(`C process exited with code: ${code}`);
            resolve(code);
        });


    })
}
import { Router } from 'express';
import multer from 'multer';

import { IEstado } from "../modules/pulpo/models/estado.model";
import { ILectura } from "../modules/pulpo/models/lectura.model";

export function initPulpoRouter( $: any ) {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname)
        }
      });
      
    var upload = multer({ storage: storage });
      
    var router = Router();

  // SHOW TIME UTC
    router.get('/utc/', async function (req, res, next) {
        try {
            let time = await $.pulpo.timeUTC();
            if(time == null) res.status(404).send();
            else res.send(time);
        }
        catch ( e ) {
            res.status(400).send(e);
        }
    });


    // CREATE ESTADO
    router.post('/estado/', async function (req, res, next) {
        try {
            let estado : IEstado = await $.pulpo.saveEstado({
                refPulpo: req.body.refPulpo,
                reboot: req.body.reboot,
                batery: req.body.batery,
                signal: req.body.signal,
                presion: req.body.presion,
                temperatura: req.body.temperatura,
                humedad: req.body.humedad
            });
            res.send(estado);
        }
        catch ( e ) {
            res.status(400).send(e);
        }
    });


      // SHOW PROGRAMACION
    router.get('/programacion/:refPulpo', async function (req, res, next) {
        try {
            let programacion = await $.pulpo.showProgramacion(req.body.refPulpo);
            if(programacion == undefined) res.status(404).send();
            else res.send(programacion);
        }
        catch ( e ) {
            res.status(400).send(e);
        }
    });


    // RUTA PARA EL PULPO CON MULTI-PART Y MULTER
    router.post('/lectura/:refContador', upload.single('photo'), async function (req, res, next) {

        try {
            let lectura : ILectura = await $.pulpo.saveLectura({
                path: req.file.destination + req.file.filename,
                refContador: req.body.refContador,
                data: req.body.data
            });
            res.send(lectura);
        }
        catch ( e ) {
            res.status(400).send(e);
        }

    });

    // RESTART DB
    router.get('/db/', async function (req, res, next) {

        try {
            let ok = await $.pulpo.restartDB();
            if(ok == false) res.status(404).send();
            else res.status(200).send();
        }
        catch ( e ) {
            res.status(400).send(e);
        }

    });

    return router;

    
}

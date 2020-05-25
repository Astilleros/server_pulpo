import mongoose from 'mongoose';


import moment from 'moment-timezone';
//moment.tz.setDefault("Europe/Madrid");
//let date = moment().tz("America/Toronto");
//let date = moment().tz("Europe/Madrid");
//console.log(date.utc().format());
//console.log(moment().isoWeekday());

import Pulpo, { IPulpo } from '../models/pulpo.model';
import Contador, { IContador, IContadorInput } from '../models/contador.model';
import Valvula, { IValvula } from '../models/valvula.model';
import Manometro, { IManometro } from '../models/manometro.model';
import Estado, { IEstado, IEstadoInput } from '../models/estado.model';
import Lectura, { ILectura, ILecturaInput } from '../models/lectura.model';
import Programacion, { IProgramacion, ITimeUTC } from '../models/programacion.model';


async function timeUTC() : Promise<ITimeUTC> {
    let nowUTC : moment.Moment = moment().utc();
    let date : ITimeUTC = {
        unix: nowUTC.unix(),
        dia: nowUTC.isoWeekday(),
        hora: nowUTC.hour(),
        minuto: nowUTC.minute()
    };
    return date;
}

async function showProgramacion( refPulpo : mongoose.Types.ObjectId ) : Promise<IProgramacion | undefined> {
    let objPulpo : IPulpo | null  = await Pulpo.objModel.findOne({ _id: refPulpo });
    if (objPulpo == null){
        return undefined;
    }
    let objProgramacion : IProgramacion;
    for ( let programacion of objPulpo.programaciones){
        if(moment.utc().isBetween(moment(programacion.inicio), moment(programacion.final))){
            objProgramacion = programacion;
            return objProgramacion;
        }
    }
}

async function saveEstado(objCreate: IEstadoInput) : Promise<IEstado> {

    return await Estado.objModel.create(objCreate);
}

async function saveLectura(objCreate: ILecturaInput) : Promise<ILectura> {
    return await Lectura.objModel.create(objCreate);
}


async function restartDB() : Promise<Boolean> {
    try {
        await Pulpo.objModel.deleteMany({});
        let objPulpo : IPulpo = new Pulpo.objModel({
            name: 'PName',
            user: 'PUser',
            password: 'PPassword',
            contadores: [],
            manometros: [],
            valvulas: [],
            programaciones: []
        });

        await Contador.objModel.deleteMany({});
        // Este crea un documento en la bd y en su tabla y despues lo copia al array. ( duplica)
        let objContador : IContador = await Contador.objModel.create({
            name: 'PContadorName1'
        });
        objPulpo.contadores.push(objContador);
        // Este no crea _v (no crea un documento mongoose con su propia tabla), pero si añade un documetno al array.
        objPulpo.contadores.push({
            name: 'PContadorName2'
        });

        await Valvula.objModel.deleteMany({});
        let objValvula : IValvula = await Valvula.objModel.create({
            name: 'PValvulaName'
        });
        objPulpo.valvulas.push(objContador);
        
        await Manometro.objModel.deleteMany({});
        let objManometro : IManometro = await Manometro.objModel.create({
            name: 'PManometroName'
        });
        objPulpo.manometros.push(objContador);

        await Programacion.objModel.deleteMany({});
        let objProgramacion : IProgramacion = await Programacion.objModel.create({
            data: 'JSONDATAPROGRAMACION? O ARRAY DE SUBDOCS ORDENES',
            running: true,
            inicio: new Date(),
            final: new Date()
        });
        objPulpo.programaciones.push(objContador);

        objPulpo.save();

// este no tira
        await Pulpo.objModel.updateOne(
            { _id: objPulpo._id },
            { $push: { 
                manometros: {
                        name: 'PManometroName2'
                    }
                } 
            }
         ).exec();

        await Lectura.objModel.deleteMany({});
        let objLectura : ILectura = await Lectura.objModel.create({
            path: 'PPath',
            refContador: objContador._id,
            data: 123
        });

        await Estado.objModel.deleteMany({});
        let objEstado : IEstado = await Estado.objModel.create({
            reboot: true,
            batery: 12,
            signal: 13,
            presion: 14,
            temperatura: 15,
            humedad: 16,
            refPulpo: objPulpo._id
        });
        return true;
    } catch (e) {
        return false;
    }
}



export default {
  timeUTC,
  saveEstado,
  saveLectura,
  showProgramacion,
  restartDB
};
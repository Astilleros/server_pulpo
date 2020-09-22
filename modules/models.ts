import { mongoose } from './core';


//  --------------------------------
//  -------- Inmobiliaria ----------

export interface IInmobiliaria extends mongoose.Document {
    name: string,
    description: string,
    initials: string
};

let inmobiliariaSchema : mongoose.Schema = new mongoose.Schema( {
    name: String,
    description: String,
    initials: String,
}, { timestamps: true, strict: true } );

export let Inmobiliaria : mongoose.Model<IInmobiliaria> =  mongoose.model<IInmobiliaria>('Inmobiliaria', inmobiliariaSchema);

//  --------------------------------



//  --------------------------------
//  ------ Permiso -----------------

export interface IPermiso extends mongoose.Document {
    nombre: string,
    descripcion: string,
};

let permisoSchema : mongoose.Schema = new mongoose.Schema( {
    nombre: String,
    descripcion: String,
}, { timestamps: true, strict: true } );

export let Permiso : mongoose.Model<IPermiso> =  mongoose.model<IPermiso>('Permiso', permisoSchema);

//  --------------------------------



//  --------------------------------
//  ---------- Rol -----------------

export interface IRol extends mongoose.Document {
    nombre: string,
    descripcion: string,
    arrRefPermiso:  [IPermiso],
};

let rolSchema : mongoose.Schema = new mongoose.Schema( {
    nombre: String,
    descripcion: String,
    arrRefPermiso: [permisoSchema],
}, { timestamps: true, strict: true } );

export let Rol : mongoose.Model<IRol> =  mongoose.model<IRol>('Rol', rolSchema);

//  --------------------------------



//  --------------------------------
//  ---------- Credencial --------

export interface ICredencial extends mongoose.Document {
    usuario: string,
    contrasena: string,
    arrRol: [IRol],
    arrPermiso: [IPermiso]
    refInmobiliaria: IInmobiliaria['_id']
};

let credencialSchema : mongoose.Schema = new mongoose.Schema( {
    usuario: String,
    contrasena: String,
    arrRol: [rolSchema],
    arrPermiso: [permisoSchema],
    refInmobiliaria: {
        type: mongoose.Types.ObjectId,
        ref: 'Inmobiliaria',
    },

}, { timestamps: true, strict: true } );


export let Credenciales : mongoose.Model<ICredencial> =  mongoose.model<ICredencial>('Credencial', credencialSchema);

//  --------------------------------


//  --------------------------------
//  ---------- GrupoContacto -------

export interface IGrupoContacto extends mongoose.Document {
    nombre: string,
    descripcion: string,
    refContacto: [IContacto['_id']]
};

let grupoContactoSchema : mongoose.Schema = new mongoose.Schema( {
    nombre: String,
    descripcion: String,
    refContacto: [{
        type: mongoose.Types.ObjectId,
        ref: 'Contacto',
    }],

}, { timestamps: true, strict: true } );


export let GrupoContacto : mongoose.Model<IGrupoContacto> =  mongoose.model<IGrupoContacto>('GrupoContacto', grupoContactoSchema);

//  --------------------------------



//  --------------------------------
//  ---------- Contacto ------------

export interface IContacto extends mongoose.Document {
    nombre: string,
    apellidos: string,
    iniciales: string,  
    email: string,
    descripcion: string,
    credencial?: ICredencial,
    refInmobiliaria: IInmobiliaria['_id'],
    arrGrupoContacto: [IGrupoContacto],
    //arrRefExpediente: [IExpediente['_id']]
};

let contactoSchema : mongoose.Schema = new mongoose.Schema( {
    nombre: String,
    apellidos: String,
    iniciales: String,  
    email: String,
    descripcion: String,
    credencial: credencialSchema || null,
    refInmobiliaria: {
        type: mongoose.Types.ObjectId,
        ref: 'Inmobiliaria',
    },
    arrGrupoContacto: [grupoContactoSchema],
    /*
    arrRefExpediente: {
        type: mongoose.Types.ObjectId,
        ref: 'Expediente',
    },
    */

}, { timestamps: true, strict: true } );


export let Contacto : mongoose.Model<IContacto> =  mongoose.model<IContacto>('Contacto', contactoSchema);

//  --------------------------------
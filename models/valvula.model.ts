import { Document, Model, model, Types, Schema, Query } from "mongoose";


export interface IValvula extends Document {
    name: string
};


let ValvulaSchema: Schema = new Schema({
    name: String
},{
    timestamps: true,
    autoIndex: true,
});


export default model<IValvula>('Valvula', ValvulaSchema);
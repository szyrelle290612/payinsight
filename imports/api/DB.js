import { Mongo } from 'meteor/mongo';

export default {
    Token: new Mongo.Collection('token', { idGeneration: 'MONGO' }),
    Organization: new Mongo.Collection('organization', { idGeneration: 'MONGO' }),
    Activity: new Mongo.Collection('activity', { idGeneration: 'MONGO' }),
    Payroll: new Mongo.Collection('payroll', { idGeneration: 'MONGO' }),
};
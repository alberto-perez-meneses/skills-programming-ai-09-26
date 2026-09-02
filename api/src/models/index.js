/**
 * @file Instancia Sequelize y registro de modelos.
 * @module src/models/index
 *
 * Lee `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`.
 * No llama a `sync()`: el esquema lo crea `mydb/init.sql`.
 */

const { Sequelize } = require('sequelize');
const defineUserModel = require('./user');
const defineNoteModel = require('./note');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        underscored: true,
        logging: false
    }
);

const User = defineUserModel(sequelize);
const Note = defineNoteModel(sequelize);

module.exports = {
    sequelize,
    User,
    Note
};

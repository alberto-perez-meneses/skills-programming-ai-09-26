/**
 * @file Modelo Sequelize de la tabla `notes`.
 * @module src/models/note
 */

const { DataTypes } = require('sequelize');

/**
 * Define el modelo `Note` sobre la tabla `notes`.
 *
 * @param {import('sequelize').Sequelize} sequelize Instancia de Sequelize.
 * @returns {import('sequelize').ModelStatic} Modelo `Note`.
 */
function defineNoteModel(sequelize) {
    return sequelize.define(
        'Note',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        },
        {
            tableName: 'notes',
            timestamps: true,
            underscored: true
        }
    );
}

module.exports = defineNoteModel;

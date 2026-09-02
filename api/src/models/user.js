/**
 * @file Modelo Sequelize de la tabla `users`.
 * @module src/models/user
 */

const { DataTypes } = require('sequelize');

/**
 * Define el modelo `User` sobre la tabla `users`.
 *
 * @param {import('sequelize').Sequelize} sequelize Instancia de Sequelize.
 * @returns {import('sequelize').ModelStatic} Modelo `User`.
 */
function defineUserModel(sequelize) {
    return sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: true,
                unique: true
            }
        },
        {
            tableName: 'users',
            timestamps: true,
            underscored: true
        }
    );
}

module.exports = defineUserModel;

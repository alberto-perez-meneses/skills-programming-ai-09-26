/**
 * @file Repositorio de usuarios sobre Sequelize.
 * @module src/repositories/userRepository
 *
 * @implements {import('../interfaces/userRepository').UserRepository}
 */

const { User } = require('../models');

/**
 * @typedef {import('../interfaces/user').User} UserDto
 * @typedef {import('../interfaces/userRepository').UserCreateInput} UserCreateInput
 * @typedef {import('../interfaces/userRepository').UserUpdateInput} UserUpdateInput
 */

/**
 * Convierte una instancia Sequelize a un objeto plano {@link UserDto}.
 *
 * @param {import('sequelize').Model} instance Fila de `users`.
 * @returns {UserDto}
 */
function toUserDto(instance) {
    return instance.toJSON();
}

/**
 * Lista todos los usuarios.
 *
 * @returns {Promise<UserDto[]>}
 */
async function findAll() {
    const rows = await User.findAll();
    return rows.map(toUserDto);
}

/**
 * Busca un usuario por `id`.
 *
 * @param {number} id Identificador.
 * @returns {Promise<UserDto|null>} `null` si no existe.
 */
async function findById(id) {
    const row = await User.findByPk(id);
    return row ? toUserDto(row) : null;
}

/**
 * Inserta un usuario.
 *
 * @param {UserCreateInput} data Nombre y correo opcional.
 * @returns {Promise<UserDto>}
 */
async function create(data) {
    const row = await User.create(data);
    return toUserDto(row);
}

/**
 * Actualiza un usuario por `id`.
 *
 * @param {number} id Identificador.
 * @param {UserUpdateInput} data Campos a modificar.
 * @returns {Promise<UserDto|null>} `null` si no existe.
 */
async function update(id, data) {
    const row = await User.findByPk(id);
    if (!row) {
        return null;
    }

    await row.update(data);
    return toUserDto(row);
}

/**
 * Elimina un usuario por `id`.
 *
 * @param {number} id Identificador.
 * @returns {Promise<boolean>} `false` si no existía.
 */
async function remove(id) {
    const deleted = await User.destroy({ where: { id } });
    return deleted > 0;
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    delete: remove
};

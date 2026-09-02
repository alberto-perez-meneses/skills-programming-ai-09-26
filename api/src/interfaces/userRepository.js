/**
 * @file Contrato CRUD del repositorio de usuarios.
 * @module src/interfaces/userRepository
 */

/**
 * @typedef {import('./user').User} User
 */

/**
 * Datos para crear un usuario.
 *
 * @typedef {Object} UserCreateInput
 * @property {string} name Nombre visible.
 * @property {string} [email] Correo único opcional.
 */

/**
 * Datos parciales para actualizar un usuario.
 *
 * @typedef {Object} UserUpdateInput
 * @property {string} [name] Nombre visible.
 * @property {string|null} [email] Correo único; `null` lo deja vacío.
 */

/**
 * Acceso a persistencia de usuarios.
 *
 * @typedef {Object} UserRepository
 * @property {function(): Promise<User[]>} findAll Lista todos los usuarios.
 * @property {function(number): Promise<User|null>} findById Busca por `id`; `null` si no existe.
 * @property {function(UserCreateInput): Promise<User>} create Inserta un usuario.
 * @property {function(number, UserUpdateInput): Promise<User|null>} update Actualiza por `id`; `null` si no existe.
 * @property {function(number): Promise<boolean>} delete Elimina por `id`; `false` si no existe.
 */

module.exports = {};

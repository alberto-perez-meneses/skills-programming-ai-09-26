/**
 * @file Contrato de datos de una nota persistida.
 * @module src/interfaces/note
 */

/**
 * Nota de la tabla `notes`.
 *
 * @typedef {Object} Note
 * @property {number} id Identificador numérico autoincremental.
 * @property {string} title Título de la nota.
 * @property {string|null} content Cuerpo de la nota; puede ser nulo.
 * @property {Date} createdAt Fecha de creación (`created_at`).
 * @property {Date} updatedAt Fecha de última actualización (`updated_at`).
 */

module.exports = {};

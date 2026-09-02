/**
 * @file Contrato CRUD del repositorio de notas.
 * @module src/interfaces/noteRepository
 */

/**
 * @typedef {import('./note').Note} Note
 */

/**
 * Datos para crear una nota.
 *
 * @typedef {Object} NoteCreateInput
 * @property {string} title Título de la nota.
 * @property {string} [content] Cuerpo opcional.
 */

/**
 * Datos parciales para actualizar una nota.
 *
 * @typedef {Object} NoteUpdateInput
 * @property {string} [title] Título de la nota.
 * @property {string|null} [content] Cuerpo; `null` lo deja vacío.
 */

/**
 * Acceso a persistencia de notas.
 *
 * @typedef {Object} NoteRepository
 * @property {function(): Promise<Note[]>} findAll Lista todas las notas.
 * @property {function(number): Promise<Note|null>} findById Busca por `id`; `null` si no existe.
 * @property {function(NoteCreateInput): Promise<Note>} create Inserta una nota.
 * @property {function(number, NoteUpdateInput): Promise<Note|null>} update Actualiza por `id`; `null` si no existe.
 * @property {function(number): Promise<boolean>} delete Elimina por `id`; `false` si no existe.
 */

module.exports = {};

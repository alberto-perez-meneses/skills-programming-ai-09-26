/**
 * @file Repositorio de notas sobre Sequelize.
 * @module src/repositories/noteRepository
 *
 * @implements {import('../interfaces/noteRepository').NoteRepository}
 */

const { Note } = require('../models');

/**
 * @typedef {import('../interfaces/note').Note} NoteDto
 * @typedef {import('../interfaces/noteRepository').NoteCreateInput} NoteCreateInput
 * @typedef {import('../interfaces/noteRepository').NoteUpdateInput} NoteUpdateInput
 */

/**
 * Convierte una instancia Sequelize a un objeto plano {@link NoteDto}.
 *
 * @param {import('sequelize').Model} instance Fila de `notes`.
 * @returns {NoteDto}
 */
function toNoteDto(instance) {
    return instance.toJSON();
}

/**
 * Lista todas las notas.
 *
 * @returns {Promise<NoteDto[]>}
 */
async function findAll() {
    const rows = await Note.findAll();
    return rows.map(toNoteDto);
}

/**
 * Busca una nota por `id`.
 *
 * @param {number} id Identificador.
 * @returns {Promise<NoteDto|null>} `null` si no existe.
 */
async function findById(id) {
    const row = await Note.findByPk(id);
    return row ? toNoteDto(row) : null;
}

/**
 * Inserta una nota.
 *
 * @param {NoteCreateInput} data Título y contenido opcional.
 * @returns {Promise<NoteDto>}
 */
async function create(data) {
    const row = await Note.create(data);
    return toNoteDto(row);
}

/**
 * Actualiza una nota por `id`.
 *
 * @param {number} id Identificador.
 * @param {NoteUpdateInput} data Campos a modificar.
 * @returns {Promise<NoteDto|null>} `null` si no existe.
 */
async function update(id, data) {
    const row = await Note.findByPk(id);
    if (!row) {
        return null;
    }

    await row.update(data);
    return toNoteDto(row);
}

/**
 * Elimina una nota por `id`.
 *
 * @param {number} id Identificador.
 * @returns {Promise<boolean>} `false` si no existía.
 */
async function remove(id) {
    const deleted = await Note.destroy({ where: { id } });
    return deleted > 0;
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    delete: remove
};

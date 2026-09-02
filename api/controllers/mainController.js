/**
 * @file Controladores HTTP de la API de ejemplo.
 * @module controllers/mainController
 *
 * Capa de handlers Express para tres rutas GET:
 * - {@link getHome} responde el texto fijo de bienvenida.
 * - {@link getUserById} localiza un usuario en el array en memoria `users`
 *   con `parseInt(userId, 10)` y comparación estricta de `id`.
 * - {@link reverseUserString} delega en `reverseString` de `lib/string.js`,
 *   que invierte la cadena por unidades UTF-16 (`split` / `reverse` / `join`).
 *
 * Los handlers cierran la respuesta con `res.send` / `res.status().send`
 * y no invocan `next`.
 *
 * @requires ../lib/string
 * @requires express
 *
 * @warning Sin autenticación ni autorización: los tres endpoints son públicos.
 * @warning El catálogo de usuarios está hardcodeado y se expone por ID
 *   (enumeración trivial de `1`, `2`, `3`).
 * @warning `parseInt` acepta prefijos numéricos (`"1abc"` → usuario `1`);
 *   no hay validación de formato de `id`.
 * @warning `GET /reverse/:str` no limita longitud ni sanitiza el parámetro
 *   de ruta. Cadenas muy grandes pueden degradar el proceso; valores que
 *   no sean string (`null` / `undefined`) lanzan `TypeError` no capturado.
 * @warning La inversión por code units UTF-16 puede romper graphemes y emojis
 *   (comportamiento actual de `reverseString`, no un error a corregir aquí).
 *
 * @remarks Datos estáticos en el proceso; no hay persistencia ni
 *   sincronización entre instancias.
 * @remarks Se asume que Express rellena `req.params` (`id`, `str`).
 * @remarks Se asume que `str` es un string; `null`/`undefined` lanzan
 *   `TypeError` (cubierto en `__test__/endpoints.test.js`).
 * @remarks Errores no capturados dependen del manejo por defecto de Express.
 */

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Usuario del catálogo en memoria (no exportado).
 * @typedef {Object} User
 * @property {number} id Identificador numérico.
 * @property {string} name Nombre visible.
 */

const reverseString = require('../lib/string').reverseString;

/**
 * Catálogo estático de usuarios usado por {@link getUserById}.
 * No forma parte de la API pública del módulo.
 * @type {User[]}
 * @private
 */
const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
];

/**
 * Handler de `GET /`. Envía el saludo fijo `"Hello World!"`.
 *
 * @param {Request} req Petición Express (no se leen parámetros).
 * @param {Response} res Respuesta Express; cuerpo de texto, estado 200 implícito.
 * @param {NextFunction} [next] Contrato de middleware; no se invoca.
 * @returns {void}
 * @example
 * // GET /
 * // → "Hello World!"
 */
function getHome(req, res) {
    res.send('Hello World!');
}

/**
 * Handler de `GET /about/:id`. Busca un usuario por `req.params.id`.
 *
 * Convierte el parámetro con `parseInt(..., 10)` y compara con `===`
 * contra `user.id`. Si no hay coincidencia, responde 404.
 *
 * @param {Request} req Petición Express; usa `req.params.id`.
 * @param {Response} res Respuesta Express: objeto {@link User} o
 *   `{ error: "User not found" }` con estado 404.
 * @param {NextFunction} [next] Contrato de middleware; no se invoca.
 * @returns {void}
 * @example
 * // GET /about/1 → { id: 1, name: "Alice" }
 * // GET /about/999 → 404 { error: "User not found" }
 */
function getUserById(req, res) {
    const userId = req.params.id;
    const user = users.find(user => user.id === parseInt(userId, 10));

    if (!user) {
        res.status(404).send({ error: "User not found" });
        return;
    }

    res.send(user);
}

/**
 * Handler de `GET /reverse/:str`. Invierte `req.params.str` y devuelve
 * original e invertido.
 *
 * @param {Request} req Petición Express; usa `req.params.str` (debe ser string).
 * @param {Response} res Respuesta Express; JSON `{ original, reversed }`,
 *   estado 200 implícito.
 * @param {NextFunction} [next] Contrato de middleware; no se invoca.
 * @returns {void}
 * @example
 * // GET /reverse/hello → { original: "hello", reversed: "olleh" }
 */
function reverseUserString(req, res) {
    const str = req.params.str;
    const reversed = reverseString(str);

    res.send({ original: str, reversed: reversed });
}

module.exports = {
    getHome,
    getUserById,
    reverseUserString
};

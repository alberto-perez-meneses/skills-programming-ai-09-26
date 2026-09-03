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


/**
 * Handler de `GET /async/:id`.
 *
 * Simula una operación asíncrona que tarda 1 segundo
 * antes de devolver la información del usuario.
 *
 * @param {Request} req Petición Express; usa `req.params.id`.
 * @param {Response} res Respuesta Express.
 * @returns {void}
 *
 * @example
 * // GET /async/1
 * // → después de 1 segundo:
 * // { id: 1, name: "Alice" }
 */
function getUserAsync(req, res) {
    const userId = req.params.id;

    setTimeout(() => {
        const user = users.find(
            user => user.id === parseInt(userId, 10)
        );

        if (!user) {
            res.status(404).send({
                error: "User not found"
            });
            return;
        }

        res.send(user);
    }, 1000);
}

/**
 * Contador de intentos para cada usuario.
 * Solo utilizado para fines demostrativos de testing.
 *
 * @type {Object.<string, number>}
 */
const retryAttempts = {};

/**
 * Handler de `GET /retry/:id`.
 *
 * Simula un servicio inestable que falla las primeras N peticiones
 * y posteriormente devuelve correctamente el usuario.
 *
 * @param {Request} req Petición Express.
 * @param {Response} res Respuesta Express.
 * @returns {void}
 *
 * @example
 * // GET /retry/1?failures=2
 *
 * // Intento 1 → 503
 * // Intento 2 → 503
 * // Intento 3 → 200 { id: 1, name: "Alice" }
 */
function getUserWithRetry(req, res) {
    const userId = req.params.id;
    const failures = parseInt(req.query.failures, 10) || 0;

    retryAttempts[userId] = (retryAttempts[userId] || 0) + 1;

    const currentAttempt = retryAttempts[userId];

    if (currentAttempt <= failures) {
        res.status(503).send({
            error: 'Service temporarily unavailable',
            attempt: currentAttempt
        });
        return;
    }

    const user = users.find(
        user => user.id === parseInt(userId, 10)
    );

    if (!user) {
        res.status(404).send({
            error: 'User not found'
        });
        return;
    }

    res.send({
        ...user,
        attempt: currentAttempt
    });
}

/**
 * Handler de `GET /products/sort`.
 *
 * Recibe una lista de precios y devuelve los precios ordenados
 * de menor a mayor.
 *
 * @param {Request} req Petición Express.
 * @param {Response} res Respuesta Express.
 * @returns {void}
 *
 * @example
 * // GET /products/sort?prices=30,10,50,20
 * //
 * // {
 * //   original: [30, 10, 50, 20],
 * //   sorted: [10, 20, 30, 50]
 * // }
 */
function sortProductPrices(req, res) {
    const prices = req.query.prices;

    if (!prices) {
        res.status(400).send({
            error: 'prices parameter is required'
        });
        return;
    }

    const numbers = prices
        .split(',')
        .map(Number);

    if (numbers.some(Number.isNaN)) {
        res.status(400).send({
            error: 'All prices must be numbers'
        });
        return;
    }

    const sorted = [...numbers].sort((a, b) => a - b);

    res.send({
        original: numbers,
        sorted
    });
}


function reverseUserString(req, res) {
    const str = req.params.str;
    const reversed = reverseString(str);

    res.send({ original: str, reversed: reversed });
}

async function reverseUserStringHttp(req, res) {
    const str = req.params.str;
    const port = process.env.PORT || 3000;
    const baseUrl = process.env.REVERSE_UPSTREAM_BASE_URL || `http://127.0.0.1:${port}`;
    const url = `${baseUrl}/reverse/${encodeURIComponent(str)}`;

    try {
        const upstreamResponse = await fetch(url);
        const payload = await upstreamResponse.json();

        if (!upstreamResponse.ok) {
            res.status(502).send({
                error: 'Reverse upstream returned an error',
                status: upstreamResponse.status
            });
            return;
        }

        res.send(payload);
    } catch (error) {
        res.status(502).send({
            error: 'Reverse upstream is unavailable'
        });
    }
}

module.exports = {
    getHome,
    getUserById,
    reverseUserString,
    reverseUserStringHttp,
    getUserAsync,
    getUserWithRetry
};

const {
    getHome,
    getUserById,
    reverseUserString,
    reverseUserStringHttp,
    getUserAsync
} = require('../controllers/mainController');

function createResponse() {
    const response = {
        send: jest.fn()
    };

    response.status = jest.fn().mockReturnValue(response);
    return response;
}

describe('getHome', () => {
    test('envía el saludo esperado', () => {
        const response = createResponse();

        getHome({}, response);

        expect(response.send).toHaveBeenCalledWith('Hello World!');
    });
});

describe('getUserById', () => {
    test('envía el usuario cuando el identificador existe', () => {
        const response = createResponse();

        getUserById({ params: { id: '1' } }, response);

        expect(response.status).not.toHaveBeenCalled();
        expect(response.send).toHaveBeenCalledWith({ id: 1, name: 'Alice' });
    });

    test('acepta el prefijo numérico que parseInt reconoce', () => {
        const response = createResponse();

        getUserById({ params: { id: '1abc' } }, response);

        expect(response.send).toHaveBeenCalledWith({ id: 1, name: 'Alice' });
    });

    test.each([
        ['un identificador inexistente', '999'],
        ['un identificador vacío', ''],
        ['un identificador nulo', null],
        ['un identificador ausente', undefined],
        ['un identificador Unicode', 'ñ'],
        ['un identificador emoji', '😀']
    ])('responde 404 para %s', (_, id) => {
        const response = createResponse();

        getUserById({ params: { id } }, response);

        expect(response.status).toHaveBeenCalledWith(404);
        expect(response.send).toHaveBeenCalledWith({ error: 'User not found' });
    });
});

describe('reverseUserString', () => {
    test('envía la cadena original y su versión invertida', () => {
        const response = createResponse();

        reverseUserString({ params: { str: 'hello' } }, response);

        expect(response.send).toHaveBeenCalledWith({
            original: 'hello',
            reversed: 'olleh'
        });
    });

    test('conserva los campos vacíos al invertir una cadena vacía', () => {
        const response = createResponse();

        reverseUserString({ params: { str: '' } }, response);

        expect(response.send).toHaveBeenCalledWith({ original: '', reversed: '' });
    });

    test('invierte caracteres Unicode BMP', () => {
        const response = createResponse();

        reverseUserString({ params: { str: 'mañana' } }, response);

        expect(response.send).toHaveBeenCalledWith({
            original: 'mañana',
            reversed: 'anañam'
        });
    });

    test('invierte un emoji por sus unidades UTF-16 actuales', () => {
        const response = createResponse();

        reverseUserString({ params: { str: '😀' } }, response);

        expect(response.send).toHaveBeenCalledWith({
            original: '😀',
            reversed: '\uDE00\uD83D'
        });
    });

    test.each([
        ['una cadena nula', null],
        ['una cadena ausente', undefined]
    ])('lanza TypeError para %s', (_, str) => {
        const response = createResponse();

        expect(() => reverseUserString({ params: { str } }, response)).toThrow(TypeError);
    });
});

describe('reverseUserStringHttp', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
        delete process.env.REVERSE_UPSTREAM_BASE_URL;
    });

    test('llama al endpoint reverse y propaga su payload', async () => {
        const response = createResponse();
        const payload = { original: 'hello world', reversed: 'dlrow olleh' };
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => payload
        });

        process.env.REVERSE_UPSTREAM_BASE_URL = 'http://127.0.0.1:3000';

        await reverseUserStringHttp({ params: { str: 'hello world' } }, response);

        expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:3000/reverse/hello%20world');
        expect(response.status).not.toHaveBeenCalled();
        expect(response.send).toHaveBeenCalledWith(payload);
    });

    test('responde 502 cuando falla la llamada al upstream', async () => {
        const response = createResponse();
        global.fetch = jest.fn().mockRejectedValue(new Error('network failure'));

        process.env.REVERSE_UPSTREAM_BASE_URL = 'http://127.0.0.1:3000';

        await reverseUserStringHttp({ params: { str: 'hello' } }, response);

        expect(response.status).toHaveBeenCalledWith(502);
        expect(response.send).toHaveBeenCalledWith({
            error: 'Reverse upstream is unavailable'
        });
    });
});

describe('getUserAsync', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('envía el usuario después de 1 segundo', async () => {
        const response = createResponse();

        getUserAsync({ params: { id: '1' } }, response);

        expect(response.send).not.toHaveBeenCalled();
        expect(response.status).not.toHaveBeenCalled();

        await jest.advanceTimersByTimeAsync(999);
        expect(response.send).not.toHaveBeenCalled();

        await jest.advanceTimersByTimeAsync(1);
        expect(response.status).not.toHaveBeenCalled();
        expect(response.send).toHaveBeenCalledWith({ id: 1, name: 'Alice' });
    }, 2000);

    test('responde 404 después de 1 segundo cuando el identificador no existe', async () => {
        const response = createResponse();

        getUserAsync({ params: { id: '999' } }, response);

        expect(response.send).not.toHaveBeenCalled();

        await jest.advanceTimersByTimeAsync(1000);

        expect(response.status).toHaveBeenCalledWith(404);
        expect(response.send).toHaveBeenCalledWith({ error: 'User not found' });
    }, 2000);

    test.each([
        ['un identificador vacío', ''],
        ['un identificador nulo', null]
    ])('responde 404 después de 1 segundo para %s', async (_, id) => {
        const response = createResponse();

        getUserAsync({ params: { id } }, response);

        await jest.advanceTimersByTimeAsync(1000);

        expect(response.status).toHaveBeenCalledWith(404);
        expect(response.send).toHaveBeenCalledWith({ error: 'User not found' });
    }, 2000);
});

describe('getUserWithRetry', () => {
    let getUserWithRetry;

    beforeEach(() => {
        jest.resetModules();
        ({ getUserWithRetry } = require('../controllers/mainController'));
    });

    function getStatus(response) {
        if (response.status.mock.calls.length > 0) {
            return response.status.mock.calls[0][0];
        }

        return 200;
    }

    function requestUntilSuccess(handler, req, maxAttempts) {
        const request = jest.fn((requestPayload, response) => {
            handler(requestPayload, response);
        });

        const responses = [];

        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
            const response = createResponse();
            request(req, response);
            responses.push(response);

            if (getStatus(response) === 200) {
                break;
            }
        }

        return { request, responses };
    }

    test('falla dos veces con 503 y tiene éxito en el tercer intento', () => {
        const req = { params: { id: '1' }, query: { failures: '2' } };
        const { request, responses } = requestUntilSuccess(getUserWithRetry, req, 5);
        const [res1, res2, res3] = responses;

        expect(request).toHaveBeenCalledTimes(3);
        expect(responses).toHaveLength(3);

        expect(res1.status).toHaveBeenCalledWith(503);
        expect(res1.send).toHaveBeenCalledTimes(1);
        expect(res1.send).toHaveBeenCalledWith({
            error: 'Service temporarily unavailable',
            attempt: 1
        });

        expect(res2.status).toHaveBeenCalledWith(503);
        expect(res2.send).toHaveBeenCalledTimes(1);
        expect(res2.send).toHaveBeenCalledWith({
            error: 'Service temporarily unavailable',
            attempt: 2
        });

        expect(res3.status).not.toHaveBeenCalled();
        expect(res3.send).toHaveBeenCalledTimes(1);
        expect(res3.send).toHaveBeenCalledWith({
            id: 1,
            name: 'Alice',
            attempt: 3
        });
    });
});

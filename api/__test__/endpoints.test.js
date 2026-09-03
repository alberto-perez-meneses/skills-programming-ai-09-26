const {
    getHome,
    getUserById,
    reverseUserString
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
        // Arrange
        const request = {};
        const response = createResponse();

        // Act
        getHome(request, response);

        // Assert
        expect(response.send).toHaveBeenCalledWith('Hello World!');
    });
});

describe('getUserById', () => {
    test('envía el usuario cuando el identificador existe', () => {
        // Arrange
        const request = { params: { id: '1' } };
        const response = createResponse();

        // Act
        getUserById(request, response);

        // Assert
        expect(response.status).not.toHaveBeenCalled();
        expect(response.send).toHaveBeenCalledWith({ id: 1, name: 'Alice' });
    });

    test('acepta el prefijo numérico que parseInt reconoce', () => {
        // Arrange
        const request = { params: { id: '1abc' } };
        const response = createResponse();

        // Act
        getUserById(request, response);

        // Assert
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
        // Arrange
        const request = { params: { id } };
        const response = createResponse();

        // Act
        getUserById(request, response);

        // Assert
        expect(response.status).toHaveBeenCalledWith(404);
        expect(response.send).toHaveBeenCalledWith({ error: 'User not found' });
    });
});

describe('reverseUserString', () => {
    test('envía la cadena original y su versión invertida', () => {
        // Arrange
        const request = { params: { str: 'hello' } };
        const response = createResponse();

        // Act
        reverseUserString(request, response);

        // Assert
        expect(response.send).toHaveBeenCalledWith({
            original: 'hello',
            reversed: 'olleh'
        });
    });

    test('conserva los campos vacíos al invertir una cadena vacía', () => {
        // Arrange
        const request = { params: { str: '' } };
        const response = createResponse();

        // Act
        reverseUserString(request, response);

        // Assert
        expect(response.send).toHaveBeenCalledWith({ original: '', reversed: '' });
    });

    test('invierte caracteres Unicode BMP', () => {
        // Arrange
        const request = { params: { str: 'mañana' } };
        const response = createResponse();

        // Act
        reverseUserString(request, response);

        // Assert
        expect(response.send).toHaveBeenCalledWith({
            original: 'mañana',
            reversed: 'anañam'
        });
    });

    test('invierte un emoji por sus unidades UTF-16 actuales', () => {
        // Arrange
        const request = { params: { str: '😀' } };
        const response = createResponse();

        // Act
        reverseUserString(request, response);

        // Assert
        expect(response.send).toHaveBeenCalledWith({
            original: '😀',
            reversed: '\uDE00\uD83D'
        });
    });

    test.each([
        ['una cadena nula', null],
        ['una cadena ausente', undefined]
    ])('lanza TypeError para %s', (_, str) => {
        // Arrange
        const request = { params: { str } };
        const response = createResponse();

        // Act
        const action = () => reverseUserString(request, response);

        // Assert
        expect(action).toThrow(TypeError);
    });
});

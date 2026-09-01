const request = require('supertest');
const app = require('../index'); 

describe('API Endpoints', () => {
    
    
    test('GET / debe retornar Hello World!', async () => {
        const response = await request(app).get('/');
        
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello World!');
    });

    test('GET /about/:id debe retornar un usuario existente (Alice)', async () => {
        const response = await request(app).get('/about/1');
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ id: 1, name: 'Alice' });
    });

    test('GET /about/:id debe retornar 404 si el usuario no existe', async () => {
        const response = await request(app).get('/about/999');
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "User not found" });
    });

    test('GET /about/:id debe retornar JSON', async () => {
        const response = await request(app).get('/about/2');
        
        expect(response.type).toBe('application/json');
        expect(response.body.name).toBe('Bob');
    });

    test('GET /reverse/:str debe retornar el texto invertido', async () => {
        const response = await request(app).get('/reverse/hello');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ original: 'hello', reversed: 'olleh' });
    });
});
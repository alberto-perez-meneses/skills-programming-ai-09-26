const { whatPartOfDay } = require('../lib/time');

describe('whatPartOfDay', () => {
    describe('identifica horario de luz', () => {
        test.each([
            [7],
            [12],
            [17]
        ])('retorna Daylight para la hora %s', (hour) => {
            // Arrange
            const expected = 'Daylight';

            // Act
            const result = whatPartOfDay(hour);

            // Assert
            expect(result).toBe(expected);
        });
    });

    describe('identifica horario nocturno', () => {
        test.each([
            [0],
            [3],
            [6],
            [18],
            [23]
        ])('retorna Night para la hora %s', (hour) => {
            // Arrange
            const expected = 'Night';

            // Act
            const result = whatPartOfDay(hour);

            // Assert
            expect(result).toBe(expected);
        });
    });

    describe('maneja horas fuera de rango', () => {
        test.each([
            [-1],
            [25.3],
            [8.5],
            ["8.6"],
            ["8"],
            [25]
        ])('retorna Undetermined para la hora %s', (hour) => {
            // Arrange
            const expected = 'Undetermined';

            // Act
            const result = whatPartOfDay(hour);

            // Assert
            expect(result).toBe(expected);
        });
    });

    describe('bordes y validación extra (mutation testing)', () => {
        test.each([
            [6.99],
            [17.99],
            [7.1],
            [NaN],
            [null],
            [undefined],
            [true],
            ['']
        ])('Undetermined para entrada no entera o inválida: %s', (hour) => {
            expect(whatPartOfDay(hour)).toBe('Undetermined');
        });

        test('7 es Daylight (mata >= 7 → > 7)', () => {
            expect(whatPartOfDay(7)).toBe('Daylight');
        });

        test('6 es Night (mata >= 7 → >= 6 o < 7 relajado)', () => {
            expect(whatPartOfDay(6)).toBe('Night');
        });

        test('17 es Daylight (mata <= 17 → < 17)', () => {
            expect(whatPartOfDay(17)).toBe('Daylight');
        });

        test('18 es Night (mata <= 17 → <= 18)', () => {
            expect(whatPartOfDay(18)).toBe('Night');
        });

        test('0 es Night (mata hour < 0 → hour <= 0)', () => {
            expect(whatPartOfDay(0)).toBe('Night');
        });

        test('23 es Night (mata hour > 23 → hour >= 23)', () => {
            expect(whatPartOfDay(23)).toBe('Night');
        });
    });
});

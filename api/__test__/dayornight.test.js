const { whatPartOfDay } = require('../lib/time');

describe('whatPartOfDay', () => {
    describe('identifica horario de luz', () => {
        test.each([
            [14], 
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
});

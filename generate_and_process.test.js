const { generateRandomRecord } = require('./generate_and_process');

describe('generateRandomRecord', () => {
    test('debe generar un registro con las propiedades correctas', () => {
        const record = generateRandomRecord(1);

        expect(record).toHaveProperty('id', 1);
        expect(record).toHaveProperty('order_id');
        expect(record).toHaveProperty('customer_id');
        expect(record).toHaveProperty('total');
        expect(record).toHaveProperty('fecha');

        expect(typeof record.id).toBe('number');
        expect(typeof record.order_id).toBe('number');
        expect(typeof record.customer_id).toBe('number');
        expect(typeof record.total).toBe('number');
        expect(typeof record.fecha).toBe('string');

        // Verificar formato de fecha YYYY-MM-DD
        expect(record.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);

        // Verificar que total sea float
        expect(record.total).toBeGreaterThanOrEqual(0);
        expect(record.total).toBeLessThanOrEqual(1000);
    });

    test('debe generar IDs únicos para diferentes llamadas', () => {
        const record1 = generateRandomRecord(1);
        const record2 = generateRandomRecord(2);

        expect(record1.id).toBe(1);
        expect(record2.id).toBe(2);
    });
});
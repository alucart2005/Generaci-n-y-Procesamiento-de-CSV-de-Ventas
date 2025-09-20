const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Función para generar un registro aleatorio
function generateRandomRecord(id) {
    const order_id = Math.floor(Math.random() * 1000000) + 1;
    const customer_id = Math.floor(Math.random() * 100000) + 1;
    const total = (Math.random() * 1000).toFixed(2); // float con 2 decimales
    const fecha = new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]; // YYYY-MM-DD
    return { id, order_id, customer_id, total: parseFloat(total), fecha };
}

module.exports = { generateRandomRecord };

// Función para escribir el CSV con 1M registros
async function generateCSV(filename, numRecords) {
    const csvWriter = createCsvWriter({
        path: filename,
        header: [
            { id: 'id', title: 'id' },
            { id: 'order_id', title: 'order_id' },
            { id: 'customer_id', title: 'customer_id' },
            { id: 'total', title: 'total' },
            { id: 'fecha', title: 'fecha' }
        ]
    });

    const records = [];
    for (let i = 1; i <= numRecords; i++) {
        records.push(generateRandomRecord(i));
        if (i % 10000 === 0) {
            console.log(`Generados ${i} registros...`);
        }
    }

    await csvWriter.writeRecords(records);
    console.log(`CSV generado: ${filename}`);
}

// Función para procesar el CSV y calcular estadísticas
function processCSV(inputFilename, outputFilename) {
    const groups = new Map();

    fs.createReadStream(inputFilename)
        .pipe(csv())
        .on('data', (row) => {
            const date = new Date(row.fecha);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Meses de 1 a 12
            const key = `${year}-${month.toString().padStart(2, '0')}`;

            if (!groups.has(key)) {
                groups.set(key, {
                    count: 0,
                    sum: 0,
                    sumSq: 0,
                    min: Infinity,
                    max: -Infinity
                });
            }

            const group = groups.get(key);
            const total = parseFloat(row.total);
            group.count++;
            group.sum += total;
            group.sumSq += total * total;
            if (total < group.min) group.min = total;
            if (total > group.max) group.max = total;
        })
        .on('end', () => {
            const results = [];
            for (const [key, stats] of groups) {
                const mean = stats.sum / stats.count;
                const variance = (stats.sumSq / stats.count) - (mean * mean);
                const stdDev = Math.sqrt(variance);
                results.push({
                    year_month: key,
                    num_ventas: stats.count,
                    maximo: stats.max,
                    minimo: stats.min,
                    media: mean.toFixed(2),
                    desviacion_tipica: stdDev.toFixed(2)
                });
            }

            const csvWriter = createCsvWriter({
                path: outputFilename,
                header: [
                    { id: 'year_month', title: 'year_month' },
                    { id: 'num_ventas', title: 'num_ventas' },
                    { id: 'maximo', title: 'maximo' },
                    { id: 'minimo', title: 'minimo' },
                    { id: 'media', title: 'media' },
                    { id: 'desviacion_tipica', title: 'desviacion_tipica' }
                ]
            });

            csvWriter.writeRecords(results).then(() => {
                console.log(`CSV procesado: ${outputFilename}`);
            });
        });
}

// Ejecutar el programa
async function main() {
    const inputCSV = 'data/ventas.csv';
    const outputCSV = 'data/estadisticas_ventas.csv';
    const numRecords = 1000000;

    console.log('Generando CSV con datos aleatorios...');
    await generateCSV(inputCSV, numRecords);

    console.log('Procesando CSV...');
    processCSV(inputCSV, outputCSV);
}

if (require.main === module) {
    main().catch(console.error);
}
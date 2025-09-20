const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Función para procesar el CSV de ejemplo y calcular estadísticas
function processExampleCSV(inputFilename, outputFilename) {
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
                console.log('Resultados:');
                results.forEach(result => {
                    console.log(`${result.year_month}: Ventas=${result.num_ventas}, Max=${result.maximo}, Min=${result.minimo}, Media=${result.media}, StdDev=${result.desviacion_tipica}`);
                });
            });
        });
}

// Ejecutar el procesamiento del ejemplo
console.log('Procesando CSV de ejemplo...');
processExampleCSV('data/ejemplo_ventas.csv', 'data/ejemplo_estadisticas.csv');
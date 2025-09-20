// Elementos del DOM
const csvFileInput = document.getElementById('csvFile');
const fileNameSpan = document.getElementById('fileName');
const processBtn = document.getElementById('processBtn');
const resultsSection = document.getElementById('resultsSection');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const resultsTable = document.getElementById('resultsTable');
const resultsBody = document.getElementById('resultsBody');
const totalRecordsSpan = document.getElementById('totalRecords');
const totalPeriodsSpan = document.getElementById('totalPeriods');
const exportBtn = document.getElementById('exportBtn');

// Variables globales
let csvData = [];
let processedResults = [];

// Event listeners
csvFileInput.addEventListener('change', handleFileSelection);
processBtn.addEventListener('click', processCSV);
exportBtn.addEventListener('click', exportResults);

// Manejar selección de archivo
function handleFileSelection(event) {
    const file = event.target.files[0];

    if (file) {
        fileNameSpan.textContent = file.name;
        processBtn.disabled = false;
        hideError();
    } else {
        fileNameSpan.textContent = 'Ningún archivo seleccionado';
        processBtn.disabled = true;
    }
}

// Procesar CSV
async function processCSV() {
    const file = csvFileInput.files[0];

    if (!file) {
        showError('Por favor selecciona un archivo CSV');
        return;
    }

    showLoading();

    try {
        const text = await readFileAsText(file);
        csvData = parseCSV(text);

        if (csvData.length === 0) {
            throw new Error('El archivo CSV está vacío o no tiene datos válidos');
        }

        processedResults = calculateStatistics(csvData);
        displayResults(processedResults, csvData.length);

        hideLoading();
        showResults();

    } catch (error) {
        hideLoading();
        showError('Error al procesar el archivo: ' + error.message);
    }
}

// Leer archivo como texto
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Error al leer el archivo'));
        reader.readAsText(file);
    });
}

// Parsear CSV
function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
        throw new Error('El CSV debe tener al menos una fila de encabezados y una fila de datos');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];

    // Verificar que tenga las columnas necesarias
    const requiredColumns = ['id', 'fecha', 'total'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
        throw new Error(`Faltan las siguientes columnas: ${missingColumns.join(', ')}`);
    }

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                let value = values[index].trim();

                // Convertir tipos de datos
                if (header === 'id' || header === 'order_id' || header === 'customer_id') {
                    value = parseInt(value) || 0;
                } else if (header === 'total') {
                    value = parseFloat(value) || 0;
                }

                row[header] = value;
            });
            data.push(row);
        }
    }

    return data;
}

// Calcular estadísticas
function calculateStatistics(data) {
    const groups = new Map();

    data.forEach(row => {
        const date = new Date(row.fecha);
        if (isNaN(date.getTime())) {
            throw new Error(`Fecha inválida en fila con ID ${row.id}: ${row.fecha}`);
        }

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
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
        const total = row.total;
        group.count++;
        group.sum += total;
        group.sumSq += total * total;
        if (total < group.min) group.min = total;
        if (total > group.max) group.max = total;
    });

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

    // Ordenar por fecha
    results.sort((a, b) => a.year_month.localeCompare(b.year_month));

    return results;
}

// Mostrar resultados
function displayResults(results, totalRecords) {
    totalRecordsSpan.textContent = totalRecords.toLocaleString();
    totalPeriodsSpan.textContent = results.length;

    resultsBody.innerHTML = '';

    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.year_month}</td>
            <td>${result.num_ventas}</td>
            <td>${result.maximo}</td>
            <td>${result.minimo}</td>
            <td>${result.media}</td>
            <td>${result.desviacion_tipica}</td>
        `;
        resultsBody.appendChild(row);
    });
}

// Exportar resultados
function exportResults() {
    if (processedResults.length === 0) {
        showError('No hay resultados para exportar');
        return;
    }

    const csvContent = [
        'year_month,num_ventas,maximo,minimo,media,desviacion_tipica',
        ...processedResults.map(row =>
            `${row.year_month},${row.num_ventas},${row.maximo},${row.minimo},${row.media},${row.desviacion_tipica}`
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'estadisticas_ventas.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Funciones de UI
function showLoading() {
    loading.style.display = 'block';
    resultsSection.style.display = 'none';
    hideError();
}

function hideLoading() {
    loading.style.display = 'none';
}

function showResults() {
    resultsSection.style.display = 'block';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}
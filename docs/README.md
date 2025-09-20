# Programa de Generación y Procesamiento de CSV de Ventas

Este programa en JavaScript genera un archivo CSV con 1,000,000 de registros de ventas aleatorios y luego procesa ese archivo para calcular estadísticas agrupadas por año y mes.

## Estructura del Proyecto

```
/
├── src/                 # Código fuente
│   ├── generate_and_process.js
│   └── ejemplo_procesar.js
├── test/                # Tests
│   └── generate_and_process.test.js
├── data/                # Archivos de datos
│   ├── ventas.csv
│   ├── estadisticas_ventas.csv
│   ├── ejemplo_ventas.csv
│   └── ejemplo_estadisticas.csv
├── docs/                # Documentación
│   └── README.md
├── package.json
└── node_modules/
```

## Campos del CSV de Entrada

- `id`: Identificador único (int)
- `order_id`: ID de la orden (int)
- `customer_id`: ID del cliente (int)
- `total`: Total de la venta (float)
- `fecha`: Fecha de la venta (datetime en formato YYYY-MM-DD)

## Campos del CSV de Salida

- `year_month`: Año y mes en formato YYYY-MM
- `num_ventas`: Número de ventas en ese período
- `maximo`: Valor máximo del total
- `minimo`: Valor mínimo del total
- `media`: Media del total
- `desviacion_tipica`: Desviación típica del total

## Instalación

1. Clona el repositorio.
2. Instala las dependencias:

```bash
npm install
```

## Uso

### Interfaz Web (Recomendado)
Abre `index.html` en tu navegador web para usar la interfaz gráfica:

1. **Subir archivo**: Haz clic en "Seleccionar archivo CSV" y elige tu archivo
2. **Procesar**: Haz clic en "Procesar CSV" para calcular las estadísticas
3. **Ver resultados**: Los resultados se mostrarán en una tabla organizada
4. **Descargar**: Usa "Descargar CSV de Resultados" para guardar los resultados

**Características de la interfaz web:**
- Procesamiento en el navegador (sin subir datos al servidor)
- Interfaz moderna y responsiva
- Validación de archivos CSV
- Vista previa de estadísticas
- Exportación directa de resultados

### Línea de Comandos

#### Programa Principal (1M registros)
```bash
npm start
```

Esto generará:
- `data/ventas.csv`: Archivo con 1M registros aleatorios
- `data/estadisticas_ventas.csv`: Archivo con estadísticas agrupadas

#### Ejemplo (10 registros)
```bash
npm run ejemplo
```

Esto procesará `data/ejemplo_ventas.csv` y generará `data/ejemplo_estadisticas.csv`

#### Tests
```bash
npm test
```

### Formato del CSV de Entrada
El archivo CSV debe tener las siguientes columnas (case-insensitive):
- `id`: Identificador único (número)
- `fecha`: Fecha en formato YYYY-MM-DD
- `total`: Monto de la venta (número decimal)
- Opcionales: `order_id`, `customer_id`

## Requisitos

- Node.js
- Librerías: csv-parser, csv-writer, jest (para tests)

## Notas

- El programa maneja archivos grandes sin cargar todo en memoria gracias al streaming.
- Las fechas se generan aleatoriamente entre 2020 y 2024.
- Los valores totales son floats aleatorios entre 0 y 1000.
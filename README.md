# Programa de Generación y Procesamiento de CSV de Ventas

Este programa en JavaScript genera un archivo CSV con 1,000,000 de registros de ventas aleatorios y luego procesa ese archivo para calcular estadísticas agrupadas por año y mes.

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

Ejecuta el programa:

```bash
node generate_and_process.js
```

Esto generará:
- `ventas.csv`: Archivo con 1M registros aleatorios
- `estadisticas_ventas.csv`: Archivo con estadísticas agrupadas

## Requisitos

- Node.js
- Librerías: csv-parser, csv-writer

## Notas

- El programa maneja archivos grandes sin cargar todo en memoria gracias al streaming.
- Las fechas se generan aleatoriamente entre 2020 y 2024.
- Los valores totales son floats aleatorios entre 0 y 1000.
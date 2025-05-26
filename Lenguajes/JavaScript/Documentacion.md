# Documentación del Generador de Folios (JavaScript)

Este módulo proporciona una implementación en JavaScript para generar folios secuenciales alfanuméricos en el formato `LETRAS + NÚMEROS`, como `A00001`, `Z99999`, `AA00001`, etc.

## Instalación

1. Copia el archivo `GeneradorFolio.js` en tu proyecto
2. Importa las funciones según necesites:

```javascript
const { generarSiguienteFolio, generarSiguienteNumeracion, incrementarLetras } = require('./GeneradorFolio.js');
```

## API

El módulo exporta tres funciones principales:

### `generarSiguienteFolio(opciones)`

Genera el siguiente folio disponible basado en el último utilizado.

**Parámetros:**

-   `opciones` (Objeto):
    -   `obtenerUltimoFolio` (Función): Función asíncrona que devuelve el último folio
    -   `verificarExistencia` (Función): Función asíncrona para verificar si un folio ya existe
    -   `folioInicial` (String, opcional): Folio inicial si no existe ninguno (por defecto 'A00001')

**Retorna:**

-   (Promise<String>): El nuevo folio generado

### `generarSiguienteNumeracion(folioActual)`

Genera el siguiente folio en la secuencia.

**Parámetros:**

-   `folioActual` (String): El folio actual desde el cual generar el siguiente

**Retorna:**

-   (String): El siguiente folio en la secuencia

### `incrementarLetras(letras)`

Incrementa la parte alfabética del folio.

**Parámetros:**

-   `letras` (String): La parte alfabética del folio a incrementar

**Retorna:**

-   (String): La siguiente secuencia alfabética

## Ejemplos de uso

### Uso básico

```javascript
const { generarSiguienteNumeracion } = require('./GeneradorFolio.js');

console.log(generarSiguienteNumeracion('A00001')); // A00002
console.log(generarSiguienteNumeracion('A99999')); // B00001
console.log(generarSiguienteNumeracion('Z99999')); // AA00001
```

### Uso con MongoDB

```javascript
const { generarSiguienteFolio } = require('./GeneradorFolio.js');
const miModelo = require('./miModelo'); // Tu modelo de Mongoose u otro ODM

async function obtenerNuevoFolio() {
	const nuevoFolio = await generarSiguienteFolio({
		obtenerUltimoFolio: async () => {
			const doc = await miModelo.findOne().sort({ folio: -1 }).lean();
			return doc ? doc.folio : null;
		},
		verificarExistencia: async (folio) => {
			return (await miModelo.findOne({ folio }).lean()) !== null;
		},
	});

	return nuevoFolio;
}
```

### Uso con una lista en memoria

```javascript
const { generarSiguienteFolio } = require('./GeneradorFolio.js');

async function ejemploSimple() {
	// Simulando una lista de folios existentes
	const foliosExistentes = ['A00001', 'A00002', 'A00003'];
	let ultimoFolio = foliosExistentes[foliosExistentes.length - 1];

	const nuevoFolio = await generarSiguienteFolio({
		obtenerUltimoFolio: async () => ultimoFolio,
		verificarExistencia: async (folio) => foliosExistentes.includes(folio),
	});

	return nuevoFolio; // Debería ser 'A00004'
}
```

## Detalles de implementación

-   El formato del folio es `[LETRAS][NÚMEROS]` donde:
    -   `LETRAS` es una secuencia de letras mayúsculas (A-Z)
    -   `NÚMEROS` es una secuencia de 5 dígitos (00001-99999)
-   Cuando los números llegan a 99999, se incrementa la parte alfabética
-   El incremento alfabético sigue un sistema de "acarreo" similar a la aritmética decimal
-   Si el formato del folio no es válido, se lanza un error

## Pruebas

Se incluye un archivo de pruebas `Prueba.js` que demuestra el uso de todas las funciones:

```bash
# Ejecutar las pruebas
node Prueba.js
```

El archivo de pruebas incluye:

-   Pruebas básicas para la generación de secuencias
-   Pruebas de incremento de letras
-   Pruebas asíncronas para la generación de folios con diferentes configuraciones
-   Ejemplos de manejo de colisiones

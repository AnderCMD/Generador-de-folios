# Documentación del Generador de Folios (TypeScript)

Este módulo proporciona una implementación en TypeScript para generar folios secuenciales alfanuméricos en el formato `LETRAS + NÚMEROS`, como `A00001`, `Z99999`, `AA00001`, etc.

## Instalación

1. Copia el archivo `GeneradorFolio.ts` en tu proyecto
2. Importa las funciones según necesites:

```typescript
import { generarSiguienteFolio, generarSiguienteNumeracion, incrementarLetras } from './GeneradorFolio';
```

## API

El módulo exporta tres funciones principales y una interfaz:

### Interfaz `OpcionesGeneradorFolio`

```typescript
interface OpcionesGeneradorFolio {
	/** Función que retorna el último folio usado */
	obtenerUltimoFolio: () => Promise<string | null>;
	/** Función para verificar si un folio ya existe */
	verificarExistencia?: (folio: string) => Promise<boolean>;
	/** Folio inicial si no existe ninguno */
	folioInicial?: string;
}
```

### `generarSiguienteFolio(opciones: OpcionesGeneradorFolio): Promise<string>`

Genera el siguiente folio disponible basado en el último utilizado.

**Parámetros:**

-   `opciones`: Objeto de tipo `OpcionesGeneradorFolio`

**Retorna:**

-   Promise con el nuevo folio generado

### `generarSiguienteNumeracion(folioActual: string | null): string`

Genera el siguiente folio en la secuencia.

**Parámetros:**

-   `folioActual`: El folio actual desde el cual generar el siguiente, o null

**Retorna:**

-   El siguiente folio en la secuencia

### `incrementarLetras(letras: string): string`

Incrementa la parte alfabética del folio.

**Parámetros:**

-   `letras`: La parte alfabética del folio a incrementar

**Retorna:**

-   La siguiente secuencia alfabética

## Ejemplos de uso

### Uso básico

```typescript
import { generarSiguienteNumeracion } from './GeneradorFolio';

console.log(generarSiguienteNumeracion('A00001')); // A00002
console.log(generarSiguienteNumeracion('A99999')); // B00001
console.log(generarSiguienteNumeracion('Z99999')); // AA00001
```

### Uso con MongoDB y Mongoose

```typescript
import { generarSiguienteFolio } from './GeneradorFolio';
import { Model } from 'mongoose';
import { MiDocumento } from './tipos';

async function obtenerNuevoFolio(modelo: Model<MiDocumento>): Promise<string> {
	const nuevoFolio = await generarSiguienteFolio({
		obtenerUltimoFolio: async () => {
			const doc = await modelo.findOne().sort({ folio: -1 }).lean();
			return doc ? doc.folio : null;
		},
		verificarExistencia: async (folio) => {
			return (await modelo.findOne({ folio }).lean()) !== null;
		},
	});

	return nuevoFolio;
}
```

### Uso con una lista en memoria

```typescript
import { generarSiguienteFolio } from './GeneradorFolio';

async function ejemploSimple(): Promise<string> {
	// Simulando una lista de folios existentes
	const foliosExistentes: string[] = ['A00001', 'A00002', 'A00003'];
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
-   El código incluye validación de tipos estricta gracias a TypeScript
-   Se lanza un error si el formato del folio no es válido

## Pruebas

Se incluye un archivo de pruebas `Prueba.ts` que demuestra el uso de todas las funciones:

```bash
# Compilar TypeScript (requiere typescript instalado)
tsc Prueba.ts

# Ejecutar las pruebas
node Prueba.js
```

El archivo de pruebas incluye:

-   Pruebas básicas para la generación de secuencias
-   Pruebas de incremento de letras
-   Pruebas asíncronas para la generación de folios con diferentes configuraciones
-   Ejemplos de manejo de tipos y errores que muestra las ventajas del sistema de tipos de TypeScript

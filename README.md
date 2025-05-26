# Generador-Folios

Módulo para generar folios secuenciales alfanuméricos en múltiples lenguajes de programación, útil para sistemas de facturación, tickets, inventarios y cualquier aplicación que requiera identificadores únicos legibles. Sigue el formato:

```
A00001 → A00002 → ... → A99999 → B00001 → ... → Z99999 → AA00001 → AB00001 → ... → ZZ99999 → AAA00001 → ...
```

## 📌 Propósito

Este repositorio proporciona implementaciones reutilizables para generar folios únicos y ordenados, útiles para:

-   Sistemas de tickets y atención al cliente
-   Sistemas de facturación e inventarios
-   Documentos legales y administrativos
-   Control de expedientes o archivos
-   Cualquier sistema que requiera identificadores únicos legibles por humanos
-   Aplicaciones donde se necesite una secuencia ordenada de códigos

## 📚 Tecnologías / Lenguajes

Actualmente implementado en:

-   ✅ JavaScript (con soporte para ES6+ y Node.js)
-   ✅ Python (con soporte para async/await y tipado)
-   ✅ TypeScript (con tipos estáticos completos)

Características por lenguaje:

| Lenguaje   | Versión mínima | Características especiales                      |
| ---------- | -------------- | ----------------------------------------------- |
| JavaScript | ES6+           | Async/await, CommonJS, desestructuración        |
| TypeScript | 4.0+           | Interfaces, tipado estático, genéricos          |
| Python     | 3.7+           | Async/await, anotaciones de tipo, typing module |

## 🧠 Lógica del Folio

Cada folio consta de dos partes:

```
[Prefijo de letras] + [Número con ceros a la izquierda]
```

-   Prefijo: A-Z, AA-ZZ, AAA-ZZZ... (secuencia alfabética)
-   Número: Rango de 00001 a 99999 (5 dígitos)

Al alcanzar `Z99999`, el sistema incrementa el prefijo como en un sistema de base 26 con letras (tipo Excel):

-   `A99999` → `B00001` (incrementa la letra cuando el número llega al máximo)
-   `Z99999` → `AA00001` (añade una letra cuando se agota el alfabeto)
-   `ZZ99999` → `AAA00001` (incrementa letras con acarreo, similar a sistema numérico)

## 🛠️ Estructura del repositorio

```
Generador-Folios/
├── Lenguajes/
│   ├── JavaScript/
│   │   ├── GeneradorFolio.js      # Implementación en JavaScript
│   │   ├── Prueba.js              # Archivo de pruebas para JavaScript
│   │   └── Documentacion.md       # Documentación específica para JavaScript
│   ├── Python/
│   │   ├── GeneradorFolio.py      # Implementación en Python
│   │   ├── Prueba.py              # Archivo de pruebas para Python
│   │   └── Documentacion.md       # Documentación específica para Python
│   └── TypeScript/
│       ├── GeneradorFolio.ts      # Implementación en TypeScript
│       ├── Prueba.ts              # Archivo de pruebas para TypeScript
│       └── Documentacion.md       # Documentación específica para TypeScript
├── generadorFolio.js              # Versión principal en JavaScript
├── Prueba.js                      # Script de pruebas
└── README.md                      # Documentación general
```

Cada carpeta de lenguaje contiene:

-   Implementación completa del generador de folios
-   Archivo de pruebas con ejemplos de uso
-   Documentación específica para ese lenguaje

## 📋 API (JavaScript)

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

## ▶️ Ejemplo de uso

Cada implementación tiene sus propios ejemplos detallados en su documentación específica:

-   [Ejemplos en JavaScript](Lenguajes/JavaScript/Documentacion.md#ejemplos-de-uso)
-   [Ejemplos en TypeScript](Lenguajes/TypeScript/Documentacion.md#ejemplos-de-uso)
-   [Ejemplos en Python](Lenguajes/Python/Documentacion.md#ejemplos-de-uso)

### Ejemplo básico (JavaScript)

```js
const { generarSiguienteNumeracion } = require('./Lenguajes/JavaScript/GeneradorFolio.js');

console.log(generarSiguienteNumeracion('A00001')); // A00002
console.log(generarSiguienteNumeracion('A99999')); // B00001
console.log(generarSiguienteNumeracion('Z99999')); // AA00001
```

## ✅ Características

-   Genera folios secuenciales alfanuméricos con formato personalizable
-   Incrementa automáticamente los prefijos cuando se alcanza el número límite
-   Permite establecer el número inicial y el prefijo base
-   Compatible con múltiples fuentes de datos (bases de datos, arrays, etc.)
-   Manejo inteligente de colisiones de folios (salta folios ya existentes)
-   Portado a varios lenguajes de forma consistente
-   Código reutilizable y modular
-   Incluye pruebas para verificar la funcionalidad en cada lenguaje

## 🔧 Instalación y Configuración

### JavaScript

1. Copia el archivo `Lenguajes/JavaScript/GeneradorFolio.js` en tu proyecto
2. Importa las funciones que necesites:

```js
const { generarSiguienteFolio, generarSiguienteNumeracion } = require('./GeneradorFolio');
```

Para más detalles, consulta la [documentación específica de JavaScript](Lenguajes/JavaScript/Documentacion.md).

### TypeScript

1. Copia el archivo `Lenguajes/TypeScript/GeneradorFolio.ts` en tu proyecto
2. Importa las funciones que necesites:

```typescript
import { generarSiguienteFolio, generarSiguienteNumeracion } from './GeneradorFolio';
```

Para más detalles, consulta la [documentación específica de TypeScript](Lenguajes/TypeScript/Documentacion.md).

### Python

1. Copia el archivo `Lenguajes/Python/GeneradorFolio.py` en tu proyecto
2. Importa las funciones que necesites:

```python
from GeneradorFolio import generar_siguiente_folio, generar_siguiente_numeracion
```

Para más detalles, consulta la [documentación específica de Python](Lenguajes/Python/Documentacion.md).

## 🚀 Pendientes / To-do

-   [ ] Soporte para límites personalizados (ej. hasta 999 o 99999)
-   [ ] CLI universal para generar folios desde la línea de comandos
-   [ ] API REST para usar el generador como servicio
-   [x] Test suite completo en cada lenguaje
-   [ ] Documentación con diagramas y flujos
-   [ ] Soporte para prefijos personalizados (no solo letras)
-   [ ] Implementaciones en más lenguajes (Java, C#, Go, etc.)
-   [ ] Publicación como paquetes npm/pip/otros
-   [ ] Interfaz gráfica para demostración
-   [ ] Generador de código para adaptarse a cualquier sistema

## 🧑‍💻 Autor

**Ander González** — Ingeniero en Software  
GitHub: [@AnderCMD](https://github.com/AnderCMD)

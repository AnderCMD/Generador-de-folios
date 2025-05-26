# Documentación del Generador de Folios (Python)

Este módulo proporciona una implementación en Python para generar folios secuenciales alfanuméricos en el formato `LETRAS + NÚMEROS`, como `A00001`, `Z99999`, `AA00001`, etc.

## Instalación

1. Copia el archivo `GeneradorFolio.py` en tu proyecto
2. Asegúrate de tener Python 3.7+ instalado (para soporte de async/await)
3. Importa las funciones según necesites:

```python
from GeneradorFolio import generar_siguiente_folio, generar_siguiente_numeracion, incrementar_letras
```

## API

El módulo proporciona tres funciones principales:

### `generar_siguiente_folio(obtener_ultimo_folio, verificar_existencia=None, folio_inicial="A00001")`

Genera el siguiente folio disponible basado en el último utilizado.

**Parámetros:**

-   `obtener_ultimo_folio` (Callable): Función asíncrona que retorna el último folio usado
-   `verificar_existencia` (Callable, opcional): Función asíncrona para verificar si un folio ya existe
-   `folio_inicial` (str, opcional): Folio inicial si no existe ninguno (por defecto 'A00001')

**Retorna:**

-   `str`: El nuevo folio generado

### `generar_siguiente_numeracion(folio_actual)`

Genera el siguiente folio en la secuencia.

**Parámetros:**

-   `folio_actual` (str, opcional): El folio actual desde el cual generar el siguiente

**Retorna:**

-   `str`: El siguiente folio en la secuencia

**Lanza:**

-   `ValueError`: Si el formato del folio es inválido

### `incrementar_letras(letras)`

Incrementa la parte alfabética del folio.

**Parámetros:**

-   `letras` (str): La parte alfabética del folio a incrementar

**Retorna:**

-   `str`: La siguiente secuencia alfabética

## Ejemplos de uso

### Uso básico

```python
from GeneradorFolio import generar_siguiente_numeracion

print(generar_siguiente_numeracion("A00001"))  # A00002
print(generar_siguiente_numeracion("A99999"))  # B00001
print(generar_siguiente_numeracion("Z99999"))  # AA00001
```

### Uso con MongoDB (motor)

```python
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from GeneradorFolio import generar_siguiente_folio

async def obtener_nuevo_folio():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.mi_base_datos
    coleccion = db.mi_coleccion

    nuevo_folio = await generar_siguiente_folio(
        obtener_ultimo_folio=lambda: coleccion.find_one(
            sort=[("folio", -1)]
        ),
        verificar_existencia=lambda folio: coleccion.find_one({"folio": folio})
    )

    return nuevo_folio

# Para ejecutar la función
# folio = asyncio.run(obtener_nuevo_folio())
```

### Uso con una lista en memoria

```python
import asyncio
from GeneradorFolio import generar_siguiente_folio

async def ejemplo_simple():
    # Simulando una lista de folios existentes
    folios_existentes = ["A00001", "A00002", "A00003"]
    ultimo_folio = folios_existentes[-1]

    nuevo_folio = await generar_siguiente_folio(
        obtener_ultimo_folio=lambda: ultimo_folio,
        verificar_existencia=lambda folio: folio in folios_existentes
    )

    return nuevo_folio  # Debería ser 'A00004'

# Para ejecutar la función
# folio = asyncio.run(ejemplo_simple())
```

## Uso con SQLAlchemy

```python
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import sessionmaker
from GeneradorFolio import generar_siguiente_folio

async def obtener_nuevo_folio_sql():
    engine = create_async_engine("sqlite+aiosqlite:///database.db")
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        nuevo_folio = await generar_siguiente_folio(
            obtener_ultimo_folio=async lambda: (
                await session.execute(
                    select(MiModelo.folio).order_by(MiModelo.folio.desc()).limit(1)
                )
            ).scalar(),
            verificar_existencia=async lambda folio: (
                await session.execute(
                    select(MiModelo).filter(MiModelo.folio == folio).limit(1)
                )
            ).scalar() is not None
        )

        return nuevo_folio
```

## Detalles de implementación

-   El formato del folio es `[LETRAS][NÚMEROS]` donde:
    -   `LETRAS` es una secuencia de letras mayúsculas (A-Z)
    -   `NÚMEROS` es una secuencia de 5 dígitos (00001-99999)
-   Utiliza expresiones regulares para validar el formato del folio
-   Está implementado con soporte completo para async/await
-   Incluye anotaciones de tipo para mejor documentación y compatibilidad con IDEs
-   El incremento alfabético sigue un sistema de "acarreo" similar a la aritmética decimal

## Pruebas

Se incluye un archivo de pruebas `Prueba.py` que demuestra el uso de todas las funciones:

```bash
# Ejecutar las pruebas
python Prueba.py
```

El archivo de pruebas incluye:

-   Pruebas básicas para la generación de secuencias
-   Pruebas de incremento de letras
-   Pruebas asíncronas para la generación de folios con diferentes configuraciones
-   Ejemplos de manejo de colisiones y errores

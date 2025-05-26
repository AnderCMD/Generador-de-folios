#!/usr/bin/env python3
# Archivo de pruebas para el generador de folios en Python
import asyncio
from GeneradorFolio import generar_siguiente_folio, generar_siguiente_numeracion, incrementar_letras

# Pruebas básicas
print('=== Pruebas de generar_siguiente_numeracion ===')
print(f"A00001 -> {generar_siguiente_numeracion('A00001')}")  # A00002
print(f"A99999 -> {generar_siguiente_numeracion('A99999')}")  # B00001
print(f"Z99999 -> {generar_siguiente_numeracion('Z99999')}")  # AA00001
print(f"AA99999 -> {generar_siguiente_numeracion('AA99999')}")  # AB00001
print(f"ZZ99999 -> {generar_siguiente_numeracion('ZZ99999')}")  # AAA00001

# Pruebas de incremento de letras
print('\n=== Pruebas de incrementar_letras ===')
print(f"A -> {incrementar_letras('A')}")  # B
print(f"Z -> {incrementar_letras('Z')}")  # AA
print(f"AA -> {incrementar_letras('AA')}")  # AB
print(f"AZ -> {incrementar_letras('AZ')}")  # BA
print(f"ZZ -> {incrementar_letras('ZZ')}")  # AAA

# Pruebas asíncronas
async def probar_generador_folio():
    print('\n=== Pruebas de generar_siguiente_folio ===')
    
    # Simulando una colección de folios en memoria
    folios_existentes = ["A00001", "A00002", "A00004", "A00005"]
    
    # Caso 1: Con verificación de existencia
    nuevo_folio1 = await generar_siguiente_folio(
        obtener_ultimo_folio=lambda: folios_existentes[-1],
        verificar_existencia=lambda folio: folio in folios_existentes
    )
    print(f"Siguiente folio (con verificación): {nuevo_folio1}")  # A00006
    
    # Caso 2: Sin verificación de existencia
    nuevo_folio2 = await generar_siguiente_folio(
        obtener_ultimo_folio=lambda: "A00010",
    )
    print(f"Siguiente folio (sin verificación): {nuevo_folio2}")  # A00011
    
    # Caso 3: Colección vacía
    nuevo_folio3 = await generar_siguiente_folio(
        obtener_ultimo_folio=lambda: None,
        folio_inicial="B00001"
    )
    print(f"Primer folio (colección vacía): {nuevo_folio3}")  # B00001

    # Caso 4: Manejo de excepciones
    try:
        # Provocar un error de formato
        await generar_siguiente_folio(
            obtener_ultimo_folio=lambda: "X12345",  # Formato correcto pero no cumple con la expresión regular
        )
    except ValueError as e:
        print(f"Error capturado correctamente: {e}")
    
# Ejecutar las pruebas asíncronas
asyncio.run(probar_generador_folio())

import re
from typing import Callable, Optional, Dict, Any, List, Union


# Genera el siguiente folio basado en el último folio registrado
async def generar_siguiente_folio(
    obtener_ultimo_folio: Callable[[], Any],
    verificar_existencia: Optional[Callable[[str], Any]] = None,
    folio_inicial: str = "A00001"
) -> str:
    # Obtener el último folio registrado
    ultimo_folio = await obtener_ultimo_folio()
    
    # Generar el siguiente folio
    nuevo_folio = generar_siguiente_numeracion(ultimo_folio or folio_inicial)
    
    # Verificar que el folio no exista ya (en caso de colisiones)
    if verificar_existencia:
        while await verificar_existencia(nuevo_folio):
            nuevo_folio = generar_siguiente_numeracion(nuevo_folio)
    
    return nuevo_folio


# Genera el siguiente folio en la secuencia
def generar_siguiente_numeracion(folio_actual: Optional[str]) -> str:
    if not folio_actual:
        return "A00001"
    
    coincidencia = re.match(r"^([A-Z]+)(\d{5})$", folio_actual)
    if not coincidencia:
        raise ValueError("Formato de folio inválido")
    
    letras, numeros = coincidencia.groups()
    numero = int(numeros)
    
    if numero < 99999:
        numero += 1
    else:
        numero = 1
        letras = incrementar_letras(letras)
    
    return f"{letras}{numero:05d}"


# Incrementa las letras del código alfabético
def incrementar_letras(letras: str) -> str:
    arreglo = list(reversed(letras))
    acarreo = True
    
    for i in range(len(arreglo)):
        if acarreo:
            if arreglo[i] == "Z":
                arreglo[i] = "A"
            else:
                arreglo[i] = chr(ord(arreglo[i]) + 1)
                acarreo = False
    
    if acarreo:
        arreglo.append("A")
    
    return "".join(reversed(arreglo))
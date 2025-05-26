interface OpcionesGeneradorFolio {
	/** Función que retorna el último folio usado */
	obtenerUltimoFolio: () => Promise<string | null>;
	/** Función para verificar si un folio ya existe */
	verificarExistencia?: (folio: string) => Promise<boolean>;
	/** Folio inicial si no existe ninguno */
	folioInicial?: string;
}

// Genera el siguiente folio basado en el último folio registrado en una colección
export async function generarSiguienteFolio(opciones: OpcionesGeneradorFolio): Promise<string> {
	const { obtenerUltimoFolio, verificarExistencia, folioInicial = 'A00001' } = opciones;

	// Obtener el último folio registrado
	let ultimoFolio = await obtenerUltimoFolio();

	// Generar el siguiente folio
	let nuevoFolio = generarSiguienteNumeracion(ultimoFolio || folioInicial);

	// Verificar que el folio no exista ya (en caso de colisiones)
	if (verificarExistencia) {
		while (await verificarExistencia(nuevoFolio)) {
			nuevoFolio = generarSiguienteNumeracion(nuevoFolio);
		}
	}

	return nuevoFolio;
}

// Genera el siguiente folio en la secuencia
export function generarSiguienteNumeracion(folioActual: string | null): string {
	if (!folioActual) return 'A00001';

	const coincidencia = folioActual.match(/^([A-Z]+)(\d{5})$/);
	if (!coincidencia) throw new Error('Formato de folio inválido');

	let letras = coincidencia[1];
	let numero = parseInt(coincidencia[2], 10);

	if (numero < 99999) {
		numero++;
	} else {
		numero = 1;
		letras = incrementarLetras(letras);
	}

	return `${letras}${numero.toString().padStart(5, '0')}`;
}

// Incrementa las letras del código alfabético
export function incrementarLetras(letras: string): string {
	let arreglo = letras.split('').reverse();
	let acarreo = true;

	for (let i = 0; i < arreglo.length; i++) {
		if (acarreo) {
			if (arreglo[i] === 'Z') {
				arreglo[i] = 'A';
			} else {
				arreglo[i] = String.fromCharCode(arreglo[i].charCodeAt(0) + 1);
				acarreo = false;
			}
		}
	}

	if (acarreo) arreglo.push('A');

	return arreglo.reverse().join('');
}

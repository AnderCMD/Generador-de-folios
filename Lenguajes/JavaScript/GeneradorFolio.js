// Genera el siguiente folio basado en el último folio registrado
const generarSiguienteFolio = async ({ obtenerUltimoFolio, verificarExistencia, folioInicial = 'A00001' }) => {
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
};

// Genera el siguiente folio en la secuencia
const generarSiguienteNumeracion = (folioActual) => {
	if (!folioActual) return 'A00001';

	let coincidencia = folioActual.match(/^([A-Z]+)(\d{5})$/);
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
};

// Incrementa las letras del código alfabético
const incrementarLetras = (letras) => {
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
};

// Exportar las funciones para su uso en otros módulos
module.exports = {
	generarSiguienteFolio,
	generarSiguienteNumeracion,
	incrementarLetras,
};

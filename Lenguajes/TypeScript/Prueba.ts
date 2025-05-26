// Archivo de pruebas para el generador de folios en TypeScript
import { generarSiguienteFolio, generarSiguienteNumeracion, incrementarLetras } from './GeneradorFolio';

// Pruebas básicas
console.log('=== Pruebas de generarSiguienteNumeracion ===');
console.log(`A00001 -> ${generarSiguienteNumeracion('A00001')}`); // A00002
console.log(`A99999 -> ${generarSiguienteNumeracion('A99999')}`); // B00001
console.log(`Z99999 -> ${generarSiguienteNumeracion('Z99999')}`); // AA00001
console.log(`AA99999 -> ${generarSiguienteNumeracion('AA99999')}`); // AB00001
console.log(`ZZ99999 -> ${generarSiguienteNumeracion('ZZ99999')}`); // AAA00001

// Pruebas de incremento de letras
console.log('\n=== Pruebas de incrementarLetras ===');
console.log(`A -> ${incrementarLetras('A')}`); // B
console.log(`Z -> ${incrementarLetras('Z')}`); // AA
console.log(`AA -> ${incrementarLetras('AA')}`); // AB
console.log(`AZ -> ${incrementarLetras('AZ')}`); // BA
console.log(`ZZ -> ${incrementarLetras('ZZ')}`); // AAA

// Prueba de generarSiguienteFolio (asíncrona)
async function probarGeneradorFolio(): Promise<void> {
	console.log('\n=== Pruebas de generarSiguienteFolio ===');

	// Simulando una colección de folios en memoria
	const foliosExistentes: string[] = ['A00001', 'A00002', 'A00004', 'A00005'];

	// Caso 1: Con verificación de existencia
	const nuevoFolio1 = await generarSiguienteFolio({
		obtenerUltimoFolio: async () => foliosExistentes[foliosExistentes.length - 1],
		verificarExistencia: async (folio) => foliosExistentes.includes(folio),
	});
	console.log(`Siguiente folio (con verificación): ${nuevoFolio1}`); // A00006

	// Caso 2: Sin verificación de existencia
	const nuevoFolio2 = await generarSiguienteFolio({
		obtenerUltimoFolio: async () => 'A00010',
	});
	console.log(`Siguiente folio (sin verificación): ${nuevoFolio2}`); // A00011

	// Caso 3: Colección vacía
	const nuevoFolio3 = await generarSiguienteFolio({
		obtenerUltimoFolio: async () => null,
		folioInicial: 'B00001',
	});
	console.log(`Primer folio (colección vacía): ${nuevoFolio3}`); // B00001

	// Caso 4: Manejo de errores con tipo incorrecto (solo para verificar TypeScript)
	try {
		// Este código no compilaría, pero es solo para ilustrar que TypeScript captura estos errores:
		// await generarSiguienteFolio({
		//    obtenerUltimoFolio: "esto no es una función"
		// });
		console.log('Los tipos de TypeScript previenen errores en tiempo de compilación');
	} catch (error) {
		console.error(error);
	}
}

// Ejecutar las pruebas asíncronas
probarGeneradorFolio().catch(console.error);

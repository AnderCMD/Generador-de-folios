export interface FolioOptions {
	/** Function that returns the last used folio */
	getLastFolio: () => Promise<string | null>;
	/** Optional function to verify if a folio already exists */
	checkExistence?: (folio: string) => Promise<boolean>;
	/** Initial folio if none exists. Default: 'A00001' */
	initialFolio?: string;
	/** Number of digits for the numeric part. Default: 5 */
	padding?: number;
	/** Separator between letters and numbers. Default: '' */
	separator?: string;
}

export interface SequenceConfig {
	/** Number of digits for the numeric part. Default: 5 */
	padding?: number;
	/** Separator between letters and numbers. Default: '' */
	separator?: string;
}

/**
 * Generates the next folio based on the last registered folio in a collection.
 * @param options - Configuration options.
 * @returns The next available folio string.
 */
export async function generateNextFolio(options: FolioOptions): Promise<string> {
	const { getLastFolio, checkExistence, initialFolio = 'A00001', padding = 5, separator = '' } = options;

	if (typeof getLastFolio !== 'function') {
		throw new Error('getLastFolio must be a function');
	}

	// Get the last registered folio
	let lastFolio: string | null;
	try {
		lastFolio = await getLastFolio();
	} catch (error: any) {
		throw new Error(`Failed to retrieve last folio: ${error.message}`);
	}

	// Generate the next folio
	let nextFolio = generateNextSequence(lastFolio || initialFolio, { padding, separator });

	// Verify that the folio does not already exist (in case of collisions)
	if (checkExistence) {
		if (typeof checkExistence !== 'function') {
			throw new Error('checkExistence must be a function');
		}
		let attempts = 0;
		const maxAttempts = 1000; // Prevent infinite loops
		while (await checkExistence(nextFolio)) {
			if (attempts >= maxAttempts) {
				throw new Error('Unable to generate a unique folio after multiple attempts');
			}
			nextFolio = generateNextSequence(nextFolio, { padding, separator });
			attempts++;
		}
	}

	return nextFolio;
}

/**
 * Generates the next folio in the sequence.
 * @param currentFolio - The current folio string (e.g., "A00001").
 * @param config - Configuration for parsing (padding, separator).
 * @returns The next folio string in the sequence.
 * @throws Error if the current folio format is invalid.
 */
export function generateNextSequence(currentFolio: string | null, config: SequenceConfig = {}): string {
	const { padding = 5, separator = '' } = config;

	if (!currentFolio) {
		return `A${separator}${'1'.padStart(padding, '0')}`;
	}

	// Escape separator for regex
	const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const regex = new RegExp(`^([A-Z]+)${escapedSeparator}(\\d{${padding}})$`);

	const match = currentFolio.match(regex);
	if (!match) {
		throw new Error(`Invalid folio format. Expected format: LETTERS${separator}NUMBERS (padding: ${padding})`);
	}

	let letters = match[1];
	let numberStr = match[2];
	let number = parseInt(numberStr, 10);
	const maxNumber = Math.pow(10, padding) - 1;

	if (number < maxNumber) {
		number++;
	} else {
		number = 1;
		letters = incrementLetters(letters);
	}

	return `${letters}${separator}${number.toString().padStart(padding, '0')}`;
}

/**
 * Increments the letters of the alphabetic code.
 * @param letters - The alphabetic string to increment.
 * @returns The incremented alphabetic string.
 */
export function incrementLetters(letters: string): string {
	if (!/^[A-Z]+$/.test(letters)) {
		throw new Error('Letters must contain only uppercase A-Z characters');
	}

	let arr = letters.split('').reverse();
	let carry = true;

	for (let i = 0; i < arr.length; i++) {
		if (carry) {
			if (arr[i] === 'Z') {
				arr[i] = 'A';
			} else {
				arr[i] = String.fromCharCode(arr[i].charCodeAt(0) + 1);
				carry = false;
			}
		}
	}

	if (carry) arr.push('A');

	return arr.reverse().join('');
}

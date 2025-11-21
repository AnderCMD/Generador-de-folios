/**
 * Configuration options for generating the next folio.
 * @typedef {Object} FolioOptions
 * @property {Function} getLastFolio - Function that returns the last used folio (Promise).
 * @property {Function} [checkExistence] - Optional function to check if a folio already exists (Promise).
 * @property {string} [initialFolio='A00001'] - The starting folio if no previous folio exists.
 * @property {number} [padding=5] - The number of digits for the numeric part.
 * @property {string} [separator=''] - A separator between letters and numbers (e.g., '-').
 */

/**
 * Generates the next folio based on the last registered folio.
 * @param {FolioOptions} options - Configuration options.
 * @returns {Promise<string>} The next available folio string.
 */
const generateNextFolio = async ({
	getLastFolio,
	checkExistence,
	initialFolio = 'A00001',
	padding = 5,
	separator = '',
}) => {
	if (typeof getLastFolio !== 'function') {
		throw new Error('getLastFolio must be a function');
	}

	// Get the last registered folio
	let lastFolio;
	try {
		lastFolio = await getLastFolio();
	} catch (error) {
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
};

/**
 * Generates the next folio in the sequence.
 * @param {string|null} currentFolio - The current folio string.
 * @param {Object} [config] - Configuration for parsing.
 * @param {number} [config.padding=5] - The number of digits.
 * @param {string} [config.separator=''] - The separator used.
 * @returns {string} The next folio string in the sequence.
 * @throws {Error} If the current folio format is invalid.
 */
const generateNextSequence = (currentFolio, { padding = 5, separator = '' } = {}) => {
	if (!currentFolio) {
		return `A${separator}${'1'.padStart(padding, '0')}`;
	}

	// Escape separator for regex if it contains special characters
	const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const regex = new RegExp(`^([A-Z]+)${escapedSeparator}(\\d{${padding}})$`);

	const match = currentFolio.match(regex);
	if (!match) {
		// Try to handle cases where the input might not match the new config but is valid otherwise
		// For now, strict validation ensures consistency
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
};

/**
 * Increments the letters of the alphabetic code.
 * @param {string} letters - The alphabetic string to increment.
 * @returns {string} The incremented alphabetic string.
 */
const incrementLetters = (letters) => {
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
};

module.exports = {
	generateNextFolio,
	generateNextSequence,
	incrementLetters,
};

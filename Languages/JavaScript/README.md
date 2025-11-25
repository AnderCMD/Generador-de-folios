# Folio Generator (JavaScript)

[![npm](https://img.shields.io/npm/v/folio-generator-js?label=npm&logo=npm&color=cb3837)](https://www.npmjs.com/package/folio-generator-js)
[![downloads](https://img.shields.io/npm/dm/folio-generator-js?label=downloads&logo=npm&color=cb3837)](https://www.npmjs.com/package/folio-generator-js)

A robust and flexible JavaScript library to generate sequential alphanumeric codes (folios). It supports custom padding, separators, and collision handling.

## Features

-   **Sequential Generation**: Automatically increments numbers and letters (e.g., `A00001` -> `A00002`, `A99999` -> `B00001`).
-   **Customizable Format**: Configure padding length and separators (e.g., `A-001`).
-   **Collision Handling**: Automatically checks for existing folios and skips them to ensure uniqueness.
-   **Robust Validation**: Ensures inputs match the expected format.

## Installation

```bash
npm install folio-generator-js
```

## Usage

### Basic Usage

```javascript
const { generateNextFolio } = require('folio-generator-js');

// Mock function to simulate database retrieval
const getLastFolio = async () => 'A00001';

(async () => {
	const nextFolio = await generateNextFolio({ getLastFolio });
	console.log(nextFolio); // Output: A00002
})();
```

### Advanced Usage with Configuration

```javascript
const { generateNextFolio } = require('folio-generator-js');

const getLastFolio = async () => 'A-0099';
const checkExistence = async (folio) => folio === 'A-0100'; // Simulate collision

(async () => {
	const nextFolio = await generateNextFolio({
		getLastFolio,
		checkExistence,
		padding: 4,
		separator: '-',
	});
	console.log(nextFolio); // Output: A-0101 (skips A-0100 due to collision)
})();
```

## API Reference

### `generateNextFolio(options)`

Generates the next available folio string.

**Parameters:**

-   `options` (Object): Configuration options.
    -   `getLastFolio` (Function): **Required**. A function that returns a Promise resolving to the last used folio string (or `null` if none exists).
    -   `checkExistence` (Function): _Optional_. A function that takes a folio string and returns a Promise resolving to `true` if it exists, `false` otherwise. Used to prevent duplicates.
    -   `initialFolio` (String): _Optional_. The starting folio if `getLastFolio` returns `null`. Default: `'A00001'` (or based on padding/separator).
    -   `padding` (Number): _Optional_. The number of digits for the numeric part. Default: `5`.
    -   `separator` (String): _Optional_. A character to separate letters and numbers. Default: `''` (empty string).

**Returns:**

-   `Promise<string>`: The next unique folio.

### `generateNextSequence(currentFolio, config)`

Synchronously calculates the next folio in the sequence without checking for collisions.

**Parameters:**

-   `currentFolio` (String|null): The current folio.
-   `config` (Object):
    -   `padding` (Number): Default `5`.
    -   `separator` (String): Default `''`.

**Returns:**

-   `String`: The next folio.

## License

MIT

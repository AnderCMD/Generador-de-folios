# Folio Generator (TypeScript)

[![npm](https://img.shields.io/npm/v/folio-generator-ts?label=npm&logo=npm&color=3178c6)](https://www.npmjs.com/package/folio-generator-ts)
[![downloads](https://img.shields.io/npm/dm/folio-generator-ts?label=downloads&logo=npm&color=3178c6)](https://www.npmjs.com/package/folio-generator-ts)

A robust and flexible TypeScript library to generate sequential alphanumeric codes (folios). It supports custom padding, separators, and collision handling, with full type safety.

## Features

-   **Sequential Generation**: Automatically increments numbers and letters (e.g., `A00001` -> `A00002`, `A99999` -> `B00001`).
-   **Customizable Format**: Configure padding length and separators (e.g., `A-001`).
-   **Collision Handling**: Automatically checks for existing folios and skips them to ensure uniqueness.
-   **Type Safe**: Written in TypeScript with complete type definitions.

## Installation

```bash
npm install folio-generator-ts
```

## Usage

### Basic Usage

```typescript
import { generateNextFolio } from 'folio-generator-ts';

// Mock function to simulate database retrieval
const getLastFolio = async (): Promise<string | null> => 'A00001';

(async () => {
	const nextFolio = await generateNextFolio({ getLastFolio });
	console.log(nextFolio); // Output: A00002
})();
```

### Advanced Usage with Configuration

```typescript
import { generateNextFolio } from 'folio-generator-ts';

const getLastFolio = async (): Promise<string | null> => 'A-0099';
const checkExistence = async (folio: string): Promise<boolean> => folio === 'A-0100'; // Simulate collision

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

### `generateNextFolio(options: FolioOptions): Promise<string>`

Generates the next available folio string.

**FolioOptions Interface:**

-   `getLastFolio`: `() => Promise<string | null>` (**Required**) - Returns the last used folio.
-   `checkExistence`: `(folio: string) => Promise<boolean>` (_Optional_) - Checks if a folio exists.
-   `initialFolio`: `string` (_Optional_) - Starting folio. Default: `'A00001'`.
-   `padding`: `number` (_Optional_) - Number of digits. Default: `5`.
-   `separator`: `string` (_Optional_) - Separator character. Default: `''`.

### `generateNextSequence(currentFolio: string | null, config?: SequenceConfig): string`

Synchronously calculates the next folio in the sequence.

**SequenceConfig Interface:**

-   `padding`: `number` (_Optional_) - Default `5`.
-   `separator`: `string` (_Optional_) - Default `''`.

## License

MIT

## Development

Build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

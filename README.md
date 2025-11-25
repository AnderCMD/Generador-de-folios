# Folio Generator

[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=for-the-badge&logo=github)](https://wallabyjs.com/oss/)

[![JS npm](https://img.shields.io/npm/v/folio-generator-js?label=JS%20npm&logo=npm&color=cb3837)](https://www.npmjs.com/package/folio-generator-js)
[![JS downloads](https://img.shields.io/npm/dm/folio-generator-js?label=JS%20downloads&logo=npm&color=cb3837)](https://www.npmjs.com/package/folio-generator-js)
[![TS npm](https://img.shields.io/npm/v/folio-generator-ts?label=TS%20npm&logo=npm&color=3178c6)](https://www.npmjs.com/package/folio-generator-ts)
[![TS downloads](https://img.shields.io/npm/dm/folio-generator-ts?label=TS%20downloads&logo=npm&color=3178c6)](https://www.npmjs.com/package/folio-generator-ts)

A robust, multi-language library to generate sequential alphanumeric codes (folios) like `A00001`, `A00002`, ..., `Z99999`, `AA00001`.

This repository contains production-ready implementations in:

-   [**Python**](Languages/Python)
-   [**JavaScript**](Languages/JavaScript)
-   [**TypeScript**](Languages/TypeScript)

## Features

-   **Sequential Generation**: Automatically increments numbers and letters (e.g., `A00001` -> `A00002`).
-   **Configurable Format**: Custom padding (e.g., 3 digits) and separators (e.g., `A-001`).
-   **Collision Handling**: Robust logic to check against a database and skip existing folios.
-   **Type Safety**: Full type support in TypeScript and Python.
-   **Production Ready**: Comprehensive tests and strict validation in all languages.

## Usage

Please refer to the specific language directory for detailed installation and usage instructions:

-   [Python Documentation](Languages/Python/README.md)
-   [JavaScript Documentation](Languages/JavaScript/README.md)
-   [TypeScript Documentation](Languages/TypeScript/README.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

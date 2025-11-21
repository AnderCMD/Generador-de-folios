# Folio Generator (Python)

A robust and flexible Python library to generate sequential alphanumeric codes (folios). It supports custom padding, separators, and collision handling, with full type hinting.

## Features

-   **Sequential Generation**: Automatically increments numbers and letters (e.g., `A00001` -> `A00002`, `A99999` -> `B00001`).
-   **Customizable Format**: Configure padding length and separators (e.g., `A-001`).
-   **Collision Handling**: Automatically checks for existing folios and skips them to ensure uniqueness.
-   **Type Safe**: Fully typed with Python type hints.

## Installation

```bash
pip install folio-generator
```

## Usage

### Basic Usage

```python
import asyncio
from folio_generator.generator import generate_next_folio

# Mock function to simulate database retrieval
async def get_last_folio():
    return "A00001"

async def main():
    next_folio = await generate_next_folio(get_last_folio=get_last_folio)
    print(next_folio)  # Output: A00002

if __name__ == "__main__":
    asyncio.run(main())
```

### Advanced Usage with Configuration

```python
import asyncio
from folio_generator.generator import generate_next_folio

async def get_last_folio():
    return "A-0099"

async def check_existence(folio: str) -> bool:
    return folio == "A-0100"  # Simulate collision

async def main():
    next_folio = await generate_next_folio(
        get_last_folio=get_last_folio,
        check_existence=check_existence,
        padding=4,
        separator="-"
    )
    print(next_folio)  # Output: A-0101 (skips A-0100 due to collision)

if __name__ == "__main__":
    asyncio.run(main())
```

## API Reference

### `generate_next_folio`

```python
async def generate_next_folio(
    get_last_folio: Callable[[], Awaitable[Optional[str]]],
    check_existence: Optional[Callable[[str], Awaitable[bool]]] = None,
    initial_folio: str = "A00001",
    padding: int = 5,
    separator: str = ""
) -> str
```

Generates the next available folio string.

-   `get_last_folio`: Coroutine returning the last used folio.
-   `check_existence`: Optional coroutine to check if a folio exists.
-   `initial_folio`: Starting folio if none exists.
-   `padding`: Number of digits (default 5).
-   `separator`: Separator string (default "").

### `generate_next_sequence`

```python
def generate_next_sequence(
    current_folio: Optional[str],
    padding: int = 5,
    separator: str = ""
) -> str
```

Synchronously calculates the next folio in the sequence.

## License

MIT

import re
from typing import Callable, Optional, Any, Awaitable

async def generate_next_folio(
    get_last_folio: Callable[[], Awaitable[Optional[str]]],
    check_existence: Optional[Callable[[str], Awaitable[bool]]] = None,
    initial_folio: str = "A00001",
    padding: int = 5,
    separator: str = ""
) -> str:
    """
    Generates the next folio based on the last registered folio.

    Args:
        get_last_folio: A coroutine function that returns the last used folio.
        check_existence: An optional coroutine function to check if a folio already exists.
        initial_folio: The starting folio if no previous folio exists. Defaults to "A00001".
        padding: The number of digits for the numeric part. Defaults to 5.
        separator: A separator between letters and numbers. Defaults to "".

    Returns:
        The next available folio string.

    Raises:
        ValueError: If get_last_folio is not callable.
        RuntimeError: If unable to generate a unique folio after multiple attempts.
    """
    if not callable(get_last_folio):
        raise ValueError("get_last_folio must be a callable")

    # Get the last registered folio
    try:
        last_folio = await get_last_folio()
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve last folio: {e}")

    # Generate the next folio
    next_folio = generate_next_sequence(last_folio or initial_folio, padding=padding, separator=separator)

    # Verify that the folio does not already exist (in case of collisions)
    if check_existence:
        if not callable(check_existence):
            raise ValueError("check_existence must be a callable")
        
        attempts = 0
        max_attempts = 1000
        while await check_existence(next_folio):
            if attempts >= max_attempts:
                raise RuntimeError("Unable to generate a unique folio after multiple attempts")
            next_folio = generate_next_sequence(next_folio, padding=padding, separator=separator)
            attempts += 1
    
    return next_folio


def generate_next_sequence(
    current_folio: Optional[str],
    padding: int = 5,
    separator: str = ""
) -> str:
    """
    Generates the next alphanumeric sequence for a given folio.

    Args:
        current_folio: The current folio string (e.g., "A00001").
        padding: The number of digits for the numeric part. Defaults to 5.
        separator: A separator between letters and numbers. Defaults to "".

    Returns:
        The next folio string in the sequence.

    Raises:
        ValueError: If the current folio format is invalid.
    """
    if not current_folio:
        return f"A{separator}{str(1).zfill(padding)}"
    
    escaped_separator = re.escape(separator)
    pattern = f"^([A-Z]+){escaped_separator}(\\d{{{padding}}})$"
    match = re.match(pattern, current_folio)
    
    if not match:
        raise ValueError(f"Invalid folio format. Expected format: LETTERS{separator}NUMBERS (padding: {padding})")
    
    letters, numbers = match.groups()
    number = int(numbers)
    max_number = (10 ** padding) - 1
    
    if number < max_number:
        number += 1
    else:
        number = 1
        letters = increment_letters(letters)
    
    return f"{letters}{separator}{str(number).zfill(padding)}"


def increment_letters(letters: str) -> str:
    """
    Increments the alphabetic part of the folio (e.g., "A" -> "B", "Z" -> "AA").

    Args:
        letters: The alphabetic string to increment.

    Returns:
        The incremented alphabetic string.
    
    Raises:
        ValueError: If letters contains non-uppercase alphabetic characters.
    """
    if not re.match(r"^[A-Z]+$", letters):
        raise ValueError("Letters must contain only uppercase A-Z characters")

    arr = list(reversed(letters))
    carry = True
    
    for i in range(len(arr)):
        if carry:
            if arr[i] == "Z":
                arr[i] = "A"
            else:
                arr[i] = chr(ord(arr[i]) + 1)
                carry = False
    
    if carry:
        arr.append("A")
    
    return "".join(reversed(arr))

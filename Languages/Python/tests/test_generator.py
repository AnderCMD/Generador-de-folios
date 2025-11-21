import asyncio
import sys
import os

# Add the src directory to the python path to allow importing the package
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from folio_generator import generate_next_folio

# Mock database for testing
class MockDatabase:
    def __init__(self):
        self.folios = ["A00001", "A00002"]

    async def get_last_folio(self):
        if not self.folios:
            return None
import unittest
import sys
import os
from unittest.mock import AsyncMock

# Add src directory to path so we can import the module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from folio_generator.generator import generate_next_folio, generate_next_sequence, increment_letters

class TestFolioGenerator(unittest.IsolatedAsyncioTestCase):
    
    async def test_basic_generation(self):
        # Mock get_last_folio
        get_last_folio = AsyncMock(return_value="A00001")
        
        next_folio = await generate_next_folio(get_last_folio=get_last_folio)
        self.assertEqual(next_folio, "A00002")
        print("✅ Basic Generation Passed")

    def test_sequence_logic(self):
        self.assertEqual(generate_next_sequence("A00001"), "A00002")
        self.assertEqual(generate_next_sequence("A99999"), "B00001")
        self.assertEqual(generate_next_sequence("Z99999"), "AA00001")
        print("✅ Sequence Logic Passed")

    def test_increment_letters(self):
        self.assertEqual(increment_letters("A"), "B")
        self.assertEqual(increment_letters("Z"), "AA")
        self.assertEqual(increment_letters("AZ"), "BA")
        self.assertEqual(increment_letters("ZZ"), "AAA")
        print("✅ Letter Increment Passed")

    def test_custom_padding_separator(self):
        self.assertEqual(generate_next_sequence("A-001", padding=3, separator="-"), "A-002")
        self.assertEqual(generate_next_sequence("A-999", padding=3, separator="-"), "B-001")
        print("✅ Custom Padding/Separator Passed")

    async def test_collision_handling(self):
        # Last used was A00002
        get_last_folio = AsyncMock(return_value="A00002")
        
        # A00003 exists, so it should skip to A00004
        # But let's say A00004 also exists, so A00005
        async def check_existence(folio):
            return folio in ["A00003", "A00004"]

        next_folio = await generate_next_folio(
            get_last_folio=get_last_folio,
            check_existence=check_existence
        )
        self.assertEqual(next_folio, "A00005")
        print("✅ Collision Handling Passed")

    def test_validation(self):
        with self.assertRaises(ValueError) as cm:
            generate_next_sequence("INVALID")
        self.assertIn("Invalid folio format", str(cm.exception))
        print("✅ Validation Passed")

if __name__ == "__main__":
    unittest.main()

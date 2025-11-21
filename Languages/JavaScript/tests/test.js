const { generateNextFolio, generateNextSequence, incrementLetters } = require('../src/index');
const assert = require('assert');

// Mock database
const mockDb = {
	folios: ['A00001', 'A00002'],
	getLastFolio: async () => mockDb.folios[mockDb.folios.length - 1],
	checkExistence: async (folio) => mockDb.folios.includes(folio),
	addFolio: (folio) => mockDb.folios.push(folio),
};

(async () => {
	try {
		console.log('Running tests...');

		// Test 1: Basic Generation
		const next1 = await generateNextFolio({ getLastFolio: mockDb.getLastFolio });
		assert.strictEqual(next1, 'A00003', 'Basic generation failed');
		console.log('✅ Basic Generation Passed');

		// Test 2: Sequence Logic
		assert.strictEqual(generateNextSequence('A00001'), 'A00002');
		assert.strictEqual(generateNextSequence('A99999'), 'B00001');
		assert.strictEqual(generateNextSequence('Z99999'), 'AA00001');
		console.log('✅ Sequence Logic Passed');

		// Test 3: Increment Letters
		assert.strictEqual(incrementLetters('A'), 'B');
		assert.strictEqual(incrementLetters('Z'), 'AA');
		assert.strictEqual(incrementLetters('AZ'), 'BA');
		assert.strictEqual(incrementLetters('ZZ'), 'AAA');
		console.log('✅ Letter Increment Passed');

		// Test 4: Custom Padding and Separator
		const customOptions = { padding: 3, separator: '-' };
		assert.strictEqual(generateNextSequence('A-001', customOptions), 'A-002');
		assert.strictEqual(generateNextSequence('A-999', customOptions), 'B-001');
		console.log('✅ Custom Padding/Separator Passed');

		// Test 5: Collision Handling
		mockDb.folios.push('A00004'); // Skip A00003 to force collision if we were at A00002, but let's simulate a collision
		// Let's say next is A00005, but A00005 exists
		const checkCollision = async (f) => f === 'A00005';
		const getLast = async () => 'A00004';

		const nextCollision = await generateNextFolio({
			getLastFolio: getLast,
			checkExistence: checkCollision,
		});
		assert.strictEqual(nextCollision, 'A00006', 'Collision handling failed');
		console.log('✅ Collision Handling Passed');

		// Test 6: Validation
		try {
			generateNextSequence('INVALID');
			assert.fail('Should have thrown error for invalid format');
		} catch (e) {
			assert.ok(e.message.includes('Invalid folio format'), 'Validation error message mismatch');
		}
		console.log('✅ Validation Passed');

		console.log('🎉 All tests passed!');
	} catch (error) {
		console.error('❌ Test failed:', error);
		process.exit(1);
	}
})();

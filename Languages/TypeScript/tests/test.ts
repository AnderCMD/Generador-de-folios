import { generateNextFolio, generateNextSequence, incrementLetters } from '../src/index';
import * as assert from 'assert';

// Mock database
class MockDatabase {
	public folios: string[] = ['A00001', 'A00002'];

	public getLastFolio = async (): Promise<string | null> => {
		if (this.folios.length === 0) return null;
		return this.folios[this.folios.length - 1];
	};

	public checkExistence = async (folio: string): Promise<boolean> => {
		return this.folios.includes(folio);
	};

	public addFolio = (folio: string) => {
		this.folios.push(folio);
	};
}

(async () => {
	try {
		console.log('Running TypeScript tests...');
		const db = new MockDatabase();

		// Test 1: Basic Generation
		const next1 = await generateNextFolio({ getLastFolio: db.getLastFolio });
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
		db.addFolio('A00004'); // Simulate existing folio
		// Next should be A00003 (since last was A00002), but let's assume we want next after A00002
		// Wait, db has A00001, A00002. Next is A00003.
		// Let's force a collision scenario.
		// We want next to be A00003, but A00003 exists.
		db.addFolio('A00003');

		const nextCollision = await generateNextFolio({
			getLastFolio: async () => 'A00002', // Last used was A00002
			checkExistence: db.checkExistence, // But A00003 exists in DB
		});
		// Should skip A00003 and go to A00004... but A00004 also exists (added above)
		// So should be A00005
		assert.strictEqual(nextCollision, 'A00005', 'Collision handling failed');
		console.log('✅ Collision Handling Passed');

		// Test 6: Validation
		try {
			generateNextSequence('INVALID');
			assert.fail('Should have thrown error for invalid format');
		} catch (e: any) {
			assert.ok(e.message.includes('Invalid folio format'), 'Validation error message mismatch');
		}
		console.log('✅ Validation Passed');

		console.log('🎉 All TypeScript tests passed!');
	} catch (error) {
		console.error('❌ Test failed:', error);
		process.exit(1);
	}
})();

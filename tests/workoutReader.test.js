const path = require('path');
const fs = require('fs/promises');
const { workoutCalculator, readWorkoutData } = require('../workoutReader');

const TEST_CSV_FILE = path.join(__dirname, 'test-workouts.csv');

const testCsvData = `type,minutes,calories
Running,30,300
Lifting,45,250
Cycling,60,500`;

beforeAll(async () => {
    await fs.writeFile(TEST_CSV_FILE, testCsvData);
});

afterAll(async () => {
    try {
        await fs.unlink(TEST_CSV_FILE);
    } catch (err) {
        // Suppress error
    }
});

describe('workoutCalculator', () => {
    test('reads and processes a valid CSV file', async () => {
        const result = await workoutCalculator(TEST_CSV_FILE);
        
        expect(result).not.toBeNull();
        expect(result.totalWorkouts).toBe(3);
        expect(result.totalMinutes).toBe(135); // 30 + 45 + 60
    });

    test('returns null when the file is missing', async () => {
        const result = await workoutCalculator('missing.csv');
        expect(result).toBeNull();
    });
});

describe('readWorkoutData', () => {
    test('returns the correct data structure from a CSV file', async () => {
        const data = await readWorkoutData(TEST_CSV_FILE);
        
        expect(Array.isArray(data)).toBe(true);
        expect(data).toHaveLength(3);
        
        expect(data[0]).toHaveProperty('type');
        expect(data[0]).toHaveProperty('minutes');
        expect(data[0]).toHaveProperty('calories');
        
        expect(data[0].type).toBe('Running');
        expect(data[0].minutes).toBe('30');
        expect(data[0].calories).toBe('300');
    });
});
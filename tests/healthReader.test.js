const path = require('path');
const fs = require('fs/promises');
const { healthMetricsCounter } = require('../healthReader');

const VALID_JSON_FILE = path.join(__dirname, 'test-health-valid.json');
const INVALID_JSON_FILE = path.join(__dirname, 'test-health-invalid.json');

const validTestData = [
    { "id": 1, "value": 120 },
    { "id": 2, "value": 118 },
    { "id": 3, "value": 121 }
];
const invalidTestData = '{ "id": 1, "value": 120, ';

beforeAll(async () => {
    await fs.writeFile(VALID_JSON_FILE, JSON.stringify(validTestData, null, 2));
    await fs.writeFile(INVALID_JSON_FILE, invalidTestData);
});

afterAll(async () => {
    try {
        await fs.unlink(VALID_JSON_FILE);
    } catch (err) {
        // Suppress error
    }
    try {
        await fs.unlink(INVALID_JSON_FILE);
    } catch (err) {
    }
});

describe('healthMetricsCounter', () => {
    test('reads a valid JSON file and returns the correct count', async () => {
        const result = await healthMetricsCounter(VALID_JSON_FILE);
        expect(result).toBe(validTestData.length);
    });

    test('returns null when the file is missing', async () => {
        const result = await healthMetricsCounter('missing.json');
        expect(result).toBeNull();
    });

    test('returns null when the JSON is invalid', async () => {
        const result = await healthMetricsCounter(INVALID_JSON_FILE);
        expect(result).toBeNull();
    });
});
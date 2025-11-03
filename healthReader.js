const fs = require('fs/promises');

async function healthMetricsCounter(filepath) {
    try {
        const data = await fs.readFile(filepath, 'utf8');
        const healthData = JSON.parse(data);

        let totalEntries;
        if (Array.isArray(healthData)) {
            totalEntries = healthData.length;
        } else if (healthData.entries && Array.isArray(healthData.entries)) {
            totalEntries = healthData.entries.length;
        } else {
            totalEntries = healthData.metrics.length;
        }

        console.log(`Total health entries: ${totalEntries}`);
        return totalEntries;

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`Error: File not found at path: ${filepath}`);
        } else if (error.name === 'SyntaxError') {
            console.error(`Error: Invalid JSON format in file. Please check ${filepath}`);
        } else {
            console.error(`An unknown error occurred: ${error.message}`);
        }
        return null;
    }
}

if (require.main === module) {
    healthMetricsCounter('./data/health-metrics.json');
}

module.exports = { healthMetricsCounter };
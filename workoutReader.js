const fs = require('fs');
const csv = require('csv-parser');

function readWorkoutData(filepath) {
    return new Promise((resolve, reject) => {
        const results = [];
        
        const stream = fs.createReadStream(filepath);

      
        stream.on('error', (error) => {
            reject(error);
        });

        stream.pipe(csv())
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                // This will catch CSV parsing errors
                reject(error);
            });
    });
}

async function workoutCalculator(filepath) {
    try {
        const workoutData = await readWorkoutData(filepath);
        
        const totalWorkouts = workoutData.length;
        let totalMinutes = 0;
        
        for (let i = 0; i < workoutData.length; i++) {
            const workout = workoutData[i];
            if (workout.minutes) {
                 totalMinutes += parseFloat(workout.minutes);
            }
        }

        console.log(`Total workouts: ${totalWorkouts}`);
        console.log(`Total minutes: ${totalMinutes}`);
        
        return { totalWorkouts, totalMinutes };

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`Error: File not found at path: ${filepath}`);
        } else {
            console.error(`Error processing CSV file: ${error.message}`);
        }
        return null;
    }
}

if (require.main === module) {
    workoutCalculator('./data/workouts.csv');
}

module.exports = { workoutCalculator, readWorkoutData };
require('dotenv').config();
const { healthMetricsCounter } = require('./healthReader.js');
const { workoutCalculator } = require('./workoutReader.js');

async function processFiles() {
    const userName = process.env.USER_NAME || 'User';
    const weeklyGoal = parseFloat(process.env.WEEKLY_GOAL) || 0;

    console.log(`Processing data for: ${userName}`);

    console.log('📁 Reading workout data...');
    const workoutData = await workoutCalculator('./data/workouts.csv');
    
    console.log('📁 Reading health data...');
    const healthDataEntries = await healthMetricsCounter('./data/health-metrics.json');

    console.log('\n=== SUMMARY ===');

    let totalMinutes = 0;
    if (workoutData) {
        console.log(`Workouts found: ${workoutData.totalWorkouts}`);
        console.log(`Total workout minutes: ${workoutData.totalMinutes}`);
        totalMinutes = workoutData.totalMinutes;
    } else {
        console.log('Workout data could not be processed.');
    }

    if (healthDataEntries !== null) {
        console.log(`Health entries found: ${healthDataEntries}`);
    } else {
        console.log('Health data could not be processed.');
    }
    
    console.log(`Weekly goal: ${weeklyGoal} minutes`);

    if (totalMinutes > 0 && weeklyGoal > 0) {
        if (totalMinutes >= weeklyGoal) {
            console.log(`🎉 Congratulations ${userName}! You have exceeded your weekly goal!`);
        } else {
            console.log(`Keep going ${userName}! You're almost at your weekly goal.`);
        }
    }
}

processFiles();
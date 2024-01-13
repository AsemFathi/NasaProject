// const launches = require('./launches.mongo');

const launches = new Map();

let lastFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('August 24, 2030'),
    target: 'kepler-442 b',
    customers: ['Asem Fathi', 'NASA'],
    success: true,
    upcoming: true,
};

launches.set(launch.flightNumber, launch);

function existLaunchWithId(launchId) {
    return launches.has(launchId);
}

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(launch) {
    lastFlightNumber++;
    launches.set(
        lastFlightNumber,
        Object.assign(launch, {
            flightNumber: lastFlightNumber,
            customers: ['Asem Fathi', 'NASA'],
            upcoming: true,
            success: true,
        }));
}
function AbortLaunchWithId(launchId) {
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existLaunchWithId,
    AbortLaunchWithId,
};
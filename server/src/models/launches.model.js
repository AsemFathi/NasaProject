const axios = require('axios');

const launchesDataBase = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100, //flight_number
    mission: 'Kepler Exploration X', //name
    rocket: 'Explorer IS1', //rocket.naem
    launchDate: new Date('August 24, 2030'),//date_local
    target: 'Kepler-1652 b',
    customers: ['Asem Fathi', 'NASA'], //payload.customers for each payload
    success: true, //success
    upcoming: true, //upcoming
};

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
    console.log('Downloading launch data');

    const response = await axios.post(SPACEX_API_URL,
        {
            query: {},
            options: {
                pagination: false,
                populate: [
                    {
                        path: 'rocket',
                        select: {
                            name: 1,
                        }
                    },
                    {
                        path: 'payloads',
                        select: {
                            customers: 1,
                        }
                    }
                ]
            }
        }
    );

    if (response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }
    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'], //flight_number
            mission: launchDoc['name'], //name
            rocket: launchDoc['rocket']['name'], //rocket.name
            launchDate: launchDoc['date_local'],//date_local
            customers, //payload.customers for each payload
            success: launchDoc['success'], //success
            upcoming: launchDoc['upcoming'], //upcoming
        }
        console.log(`${launch.flightNumber} ${launch.mission}`);
        await saveLaunch(launch);
    }

    //console.log(`Length ${launchDocs.length}`);

    //TODO: populate launches collection...


}


async function loadLaunchData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if (firstLaunch) {
        console.log('Launch Data already loaded.');
    }
    else {
        await populateLaunches();
    }

}

async function saveLaunch(launch) {



    await launchesDataBase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function findLaunch(filter) {
    return await launchesDataBase.findOne(filter);
}

async function existLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId,
    });
}

async function getAllLaunches() {
    return await launchesDataBase
        .find({}, { '_id': 0, '__v': 0 });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDataBase
        .findOne()
        .sort('-flightNumber');

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if (!planet) {
        throw new Error("No target planet with this name");
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customers: ['Asem Fathi', 'NASA'],
        upcoming: true,
        success: true,
    });

    await saveLaunch(newLaunch);
}

async function AbortLaunchWithId(launchId) {
    const aborted = await launchesDataBase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    existLaunchWithId,
    AbortLaunchWithId,
};
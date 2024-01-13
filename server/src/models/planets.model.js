const { parse } = require('csv-parse');
const fs = require('fs');
const planets = require('./planets.mongo');
const { count } = require('console');


function isHabitable(planet) {

    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream('data/kepler_data.csv')
            .pipe(parse({
                comment: '#',
                columns: true,
            }))

            .on('data', async (data) => {
                if (isHabitable(data)) {
                    savePlanet(data);
                }
            })
            .on('error', (err) => {
                console.log('Error');
                reject(err);
            })
            .on('end', async () => {
                const countPlanetsFound = (await getAllPlanets()).length;
                console.log(`${countPlanetsFound} habitable planets `);
                resolve();
            });
    });
}

async function getAllPlanets() {
    return await planets.find({});
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true,
        });
    }
    catch (err) {
        console.error(`Couldnot Save this planet ${err}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,

};
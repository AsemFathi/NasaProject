const { parse } = require('csv-parse');
const fs = require('fs');

const habitablePlanets = [];

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
            .on('data', (data) => {
                if (isHabitable(data)) {
                    habitablePlanets.push(data);
                }
            })
            .on('error', (err) => {
                console.log('Error');
                reject(err);
            })
            .on('end', () => {
                console.log(`${habitablePlanets.length} habitable planets `);
                resolve();
            });
    });
}

function getAllPlanets() {
    return habitablePlanets;
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,

};
const request = require('supertest');
const app = require('../../app');

describe("Test GET /launches", () => {
    test('It should response with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);

    });
});

describe("Test Post /launch", () => {

    const completeLaunchData = {
        "mission": "AFSM",
        "rocket": "AFSM 22",
        "target": "Kepler-186 f",
        "launchDate": "August 24, 2028"
    };
    const completeLaunchDataWithInvalidDate = {
        "mission": "AFSM",
        "rocket": "AFSM 22",
        "target": "Kepler-186 f",
        "launchDate": "Asem"
    };
    const launchDataWithoutDate = {
        "mission": "AFSM",
        "rocket": "AFSM 22",
        "target": "Kepler-186 f",
    };


    test('It should response with 201 created', async () => {

        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);

        const responseDate = new Date(response.body.launchDate).valueOf();
        const requestDate = new Date(completeLaunchData.launchDate).valueOf();

        expect(responseDate).toBe(requestDate);

        expect(response.body).toMatchObject(launchDataWithoutDate);

    });
    test('It should catch missing required properties', async () => {

        const response = await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch property',
        });
    });
    test('It should catch invalid dates', async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Invalid launch date',
        });
    });
});
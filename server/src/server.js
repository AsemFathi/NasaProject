const http = require('http');

const app = require('./app');

const planetsModel = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

//we put this in function because await cannot be used without async function
async function startServer() {
    await planetsModel.loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();

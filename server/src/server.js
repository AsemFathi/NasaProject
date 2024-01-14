const http = require('http');
const app = require('./app');

const planetsModel = require('./models/planets.model');
const { mongoConnect } = ('./services/mongo');

const PORT = process.env.PORT || 8000;


const server = http.createServer(app);

//we put this in function because await cannot be used without async function
async function startServer() {
    // if we wanted to use the updated greatest features of mongodb we should set this 
    await mongoConnect();
    await planetsModel.loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();

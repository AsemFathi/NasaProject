const http = require('http');

const mongoose = require('mongoose');

const app = require('./app');

const planetsModel = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://nasa-api:t4Z7hy2csTsMkLPv@cluster0.69mrmty.mongodb.net/nasa?retryWrites=true&w=majority'

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('MongoDB is ready')
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});
//we put this in function because await cannot be used without async function
async function startServer() {
    // if we wanted to use the updated greatest features of mongodb we should set this 
    await mongoose.connect(MONGO_URL);
    await planetsModel.loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();

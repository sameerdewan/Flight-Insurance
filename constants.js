module.exports = {
    infuraKey: 'https://rinkeby.infura.io/v3/421d2d13751d477088f378ceb77dd58c',
    mnemonic: 'squirrel march broom strong kick blast unique team song song assist million',
    initialAirline: "Sameer's Initial Airline",
    initialFlight: "Sameer's Initial Flight",
    getInitialFlightTime: () => {
        const flightTime = new Date(2021, 00, 01, 10, 30, 00, 0); // January 1, 2021 10:30
        const flightTimeInSeconds = flightTime / 1000;
        return flightTimeInSeconds;
    }
};

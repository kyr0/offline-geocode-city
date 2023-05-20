import { getNearestCity } from "../../dist/index.esm.js"
import { deepEqual } from "assert"

const printTimeElapsed = (startTime: [number, number]) => {
    const endTime = process.hrtime(startTime);

    // time in nano seconds
    const nanoSeconds = endTime[0] * 1e9 + endTime[1];

    // time in milli seconds
    const milliSeconds = nanoSeconds / 1e6;

    console.log(`Execution time: ${milliSeconds} ms`);
}

const startTime = process.hrtime();
const nearestCity = getNearestCity(48.3243193, 11.658644)
printTimeElapsed(startTime)

console.log('Smoke test: Neufahrn, Nearest bigger city, LatLng: [48.3243193, 11.658644] =>', nearestCity)

deepEqual(nearestCity, {
    cityName: 'Ismaning',
    countryIso2: 'DE',
    countryName: 'Germany'
})

const startTimePeking = process.hrtime();
const nearestCityPeking = getNearestCity(39.9211371, 116.39838)
printTimeElapsed(startTimePeking)

console.log('Smoke test: Peking, Forbidden Town, Nearest bigger city, LatLng: [39.9211371, 116.39838] =>', nearestCityPeking)

deepEqual(nearestCityPeking, { cityName: 'Beijing', countryIso2: 'CN', countryName: 'China' })

const startTimeMauretania = process.hrtime();
const mauretania = getNearestCity(15.0885686, -12.546833)
printTimeElapsed(startTimeMauretania)

console.log('Smoke test: Somewhere in Mauretania, Nearest bigger city, LatLng: [15.0885686, -12.546833] =>', mauretania)

deepEqual(mauretania, {
    cityName: 'Sélibaby',
    countryIso2: 'MR',
    countryName: 'Mauritania'
})

const startTimeNowhere = process.hrtime();
const middleOfNowhere = getNearestCity(9.827159, -161.538989)
printTimeElapsed(startTimeNowhere)

console.log('Smoke test: Somewhere in the ocean, LatLng: [9.827159, -161.538989] =>', middleOfNowhere)

deepEqual(middleOfNowhere, { 
    cityName: 'Sisimiut', 
    countryIso2: 'GL', 
    countryName: 'Greenland' 
})
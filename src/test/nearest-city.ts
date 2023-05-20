import { getNearestCity } from "../../dist/index.esm.js"
import { deepEqual } from "assert"

const nearestCity = getNearestCity(48.3243193, 11.658644)

console.log('Smoke test: Neufahrn, Nearest bigger city, LatLng: [48.3243193, 11.658644] =>', nearestCity)

deepEqual(nearestCity, {
    cityName: 'Ismaning',
    countryIso2: 'DE',
    countryName: 'Germany'
})

const nearestCityPeking = getNearestCity(39.9211371, 116.39838)

console.log('Smoke test: Peking, Forbidden Town, Nearest bigger city, LatLng: [39.9211371, 116.39838] =>', nearestCityPeking)

deepEqual(nearestCityPeking, { cityName: 'Beijing', countryIso2: 'CN', countryName: 'China' })

const mauretania = getNearestCity(15.0885686, -12.546833)

console.log('Smoke test: Somewhere in Mauretania, Nearest bigger city, LatLng: [15.0885686, -12.546833] =>', mauretania)

deepEqual(mauretania, {
    cityName: 'Sélibaby',
    countryIso2: 'MR',
    countryName: 'Mauritania'
})

const middleOfNowhere = getNearestCity(9.827159, -161.538989)

console.log('Smoke test: Somewhere in the ocean, LatLng: [9.827159, -161.538989] =>', middleOfNowhere)

deepEqual(middleOfNowhere, { 
    cityName: 'Sisimiut', 
    countryIso2: 'GL', 
    countryName: 'Greenland' 
})
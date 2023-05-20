<h1 align="center">offline-geocode-city</h1>

> 217 kB, tiny offline reverse geocoding library that works anywhere, browser, Node.js, web worker. High performance ([S2 cell](https://s2geometry.io/) based). Locally looks up country and nearest city, given GPS coordinates.

<h2 align="center">Features</h2>

- ✅ Reverse geocodes offline
- ✅ Works in all JS environments (browser, Node.js, service worker etc.)
- ✅ Not only Country and ISO2, but also nearest city geocoded
- ✅ Only `217 kB` nano sized (ESM, gizpped) (alternatives are ~`20 MiB`)
- ✅ World record smallest size for city reverse geocoding
- ✅ World record performance for reverse geocoding using S2 cell
- ✅ Lookup time (on M1 Max): `0.035 ms` (**!**) (direct cell hit), `0.11 ms` (2nd order range hit),  `4.87 ms` (worst case)
- ✅ Available as a simple API
- ✅ Tree-shakable and side-effect free
- ✅ First class TypeScript support

<h2 align="center">Example usage (API)</h2>

<h3 align="center">Setup</h3>

- yarn: `yarn add offline-geocode-city`
- npm: `npm install offline-geocode-city`

<h3 align="center">ESM</h3>

```ts
import { getNearestCity } from 'offline-geocode-city'

const nearestCity = getNearestCity(48.3243193, 11.658644)

deepEqual(nearestCity, {
    cityName: 'Ismaning',
    countryIso2: 'DE',
    countryName: 'Germany'
})
```

This library can be used to lookup the nearest city in-browser using the 
GeoLocation web api (offline):

```ts
const getLocation = (): Promise<GeolocationResult> =>
    new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });

const position = await getLocation()

 if (position instanceof Error) {
    console.error(position.message);
} else {

    console.log(`Latitude: ${(position.coords.latitude)}`);
    console.log(`Longitude: ${(position.coords.longitude)}`);

    const nearestCity = getNearestCity(position.coords.latitude, position.coords.longitude)

    console.log('nearestCity', nearestCity)
}
```
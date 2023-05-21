<h1 align="center">offline-geocode-city</h1>

> 217 kB, tiny offline reverse geocoding library that works anywhere, browser, Node.js, web worker. High performance ([S2 cell](https://s2geometry.io/) based). Locally looks up country and nearest city, given GPS coordinates.

<h2 align="center">Features</h2>

- ✅ Reverse geocodes offline
- ✅ Works in all JS environments (browser, Node.js, service worker etc.)
- ✅ Not only Country and ISO2, but also nearest city geocoded
- ✅ Only `217 kB` nano sized (ESM, gizpped) (alternatives are ~`20 MiB`)
- ✅ Smallest library size for city reverse geocoding on NPM
- ✅ Best performance for reverse geocoding using S2 cell on NPM
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

<h3 align="center">License</h3>

The license (MIT) of this library applies to the program code, not the data.

This library makes use of [S2 cell](https://github.com/google/s2geometry) geometry. S2 cell geometry is originally licensed under Apache-2.0 license.

The specific [implementation used here](https://www.npmjs.com/package/s2-geometry) is licensed under the terms of MIT or Apache-2.0 license.

<h3 align="center">Geocoded location data</h3>

The "United Nations Code for Trade and Transport Locations" is commonly more known as "UN/LOCODE". Although managed and maintained by the UNECE, it is the product of a wide collaboration in the framework of the joint trade facilitation effort undertaken within the United Nations.

Initiated within the UNECE Working Party on Trade Facilitation, UN/LOCODE is based on a code structure set up by UN/ECLAC and a list of locations originating in UN/ESCAP, developed in UNCTAD in co-operation with transport organisations like IATA and the ICS and with active contributions from national governments and commercial bodies. Its first issue in 1981 provided codes to represent the names of some 8.000 locations in the world.

Currently, UN/LOCODE includes over 103,034 locations in 249 countries and territories. It is used by most major shipping companies, by freight forwarders and in the manufacturing industry around the world. It is also applied by national governments and in trade related activities, such as statistics where it is used by the European Union, by the UPU for certain postal services, etc
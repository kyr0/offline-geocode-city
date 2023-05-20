import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"
import { parse } from 'csv-parse'
import lzTs from 'lz-ts';
const { compressToURI } = lzTs;

import { CountryIso2, BaseData, BaseDataRow } from "./interfaces"

import s2geo from 's2-geometry';
const { S2 } = s2geo;

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const csvParser = parse({
  delimiter: ',',
  quote: '"'
})

interface CountryLookupMapIso2 {
    [code: string]: CountryIso2
}

export const transformCountryListIso2ToCodeLookupMap = (countriesList: Array<Array<string>>): CountryLookupMapIso2 => {
    const countryMapIso2: CountryLookupMapIso2 = {}
    countriesList.forEach((country: Array<string>, index: number) => {
        countryMapIso2[country[0]] = {
            code: country[0],
            name: country[1],
            index
        }
    })
    return countryMapIso2
}

export const getRawCityCountryList = async(countryMapIso2: CountryLookupMapIso2, citiesAndCountries: string, minPopulation: number = 15000): Promise<BaseData> => {
    return new Promise((resolve) => {
        const data: BaseData = []
        csvParser.on('readable', function(){
            let record;
            while ((record = csvParser.read()) !== null) {
                const [cityNameAscii,,lat,lng,,iso2,,,capital,population,] = record
                // all major cities of the world, population >= minPopulation 
                // and all capital cities, even if < minPopulation
                const latFloat = parseFloat(lat)
                const lngFloat = parseFloat(lng)

                if ((parseInt(population) >= minPopulation || capital) && latFloat && lngFloat) {
                    data.push([
                        S2.latLngToKey(latFloat, lngFloat, 8),
                        cityNameAscii,
                        countryMapIso2[iso2].index,
                    ]);
                }
            }
        });

        csvParser.on('end', async() => {

            // pre-sort by country primary key
            data.sort((a: BaseDataRow, b: BaseDataRow) => {
                return (a[2] as number) - (b[2] as number)
            })
            resolve(data)
        });
        csvParser.write(citiesAndCountries)
        csvParser.end()
    })
}

export const encodeData = (rows: BaseData) => {
    let data = ''
    let currentCountryCode: number|null = null
    rows.forEach((row, index) => {
        const nextRow = rows[index+1]
        data += `${row[0]}${row[1]}\n`
        if (nextRow && nextRow[2]) {
            if (currentCountryCode === null || (nextRow && nextRow[2] !== currentCountryCode)) {
                data += `${nextRow[2]}\n`
                currentCountryCode = nextRow[2] as number
            }
        }
    })
    return data
}

export const compressBaseData = (rows: BaseData): string => compressToURI(encodeData(rows))

;(async() => {

    // countries
    const countriesList = JSON.parse(
        readFileSync(resolve(__dirname, '../data/countriesIso2.json'), { encoding: 'utf8' })
    ).map((countryIso2: CountryIso2) => ([countryIso2.code, countryIso2.name]))

    writeFileSync(resolve(__dirname, '../src/gen/baseDataCountries.ts'), `
    export const BASE_DATA_COUNTRIES = \`${compressBaseData(countriesList)}\`;
    `)

    // cities
    const baseDataCities = await getRawCityCountryList(
        transformCountryListIso2ToCodeLookupMap(countriesList),
        readFileSync(resolve(__dirname, '../data/worldcities.csv'), { encoding: 'utf8' })
    )
    writeFileSync(resolve(__dirname, '../src/gen/baseDataCities.ts'), `
    export const BASE_DATA_CITIES = \`${compressBaseData(baseDataCities)}\`;
    `)
})()


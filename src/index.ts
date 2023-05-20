import lzTs from 'lz-ts';
const { decompressFromURI } = lzTs;
import { BASE_DATA_CITIES } from "./gen/baseDataCities";
import { BASE_DATA_COUNTRIES } from "./gen/baseDataCountries";
import { BaseData, BaseDataRow, ReverseGeocodeResult } from "./interfaces";
import s2geo from 's2-geometry';
const { S2 } = s2geo;

const getRowsFromEncodedBaseData = (input: string) => input.split('\n')

interface CellCityMap {
    [cellId: string]: BaseDataRow
}

export const decodeBaseDataCities = (encodedBaseDataCities: string, baseDataCities: BaseData): CellCityMap => {
    const rows: Array<string> = getRowsFromEncodedBaseData(encodedBaseDataCities)
    const baseDataRows: CellCityMap = {}
    let currentCountyIndex = 1
    rows.forEach(row => {

        const cellId = row.substring(0, 10)

        if (cellId.length < 10) {
            currentCountyIndex = parseInt(cellId)
            return
        }
        baseDataRows[cellId] = [
            row.substring(10),
            baseDataCities[currentCountyIndex as number][0],
            baseDataCities[currentCountyIndex as number][1]
        ]
    })
    return baseDataRows
}

export const decodeBaseDataCountries = (encodedBaseDataCountries: string): BaseData => {
    const rows: Array<string> = getRowsFromEncodedBaseData(encodedBaseDataCountries)
    const baseDataRows: BaseData = []
    rows.forEach(row => {
        baseDataRows.push([
            row.substring(0, 2),
            row.substring(2)
        ])
    })
    return baseDataRows
}

export const getBaseDataCountries = () => decodeBaseDataCountries(decompressFromURI(BASE_DATA_COUNTRIES))
export const getBaseDataCities = () => decodeBaseDataCities(decompressFromURI(BASE_DATA_CITIES), getBaseDataCountries())

const CELL_CITY_MAP = getBaseDataCities()

interface GeoPoint {
    lat: number;
    lng: number;
}

function toRadian(degree: number): number {
    return degree * Math.PI / 180;
}

function toDegree(radian: number): number {
    return radian * 180 / Math.PI;
}

function getPointsInRadius(center: GeoPoint): GeoPoint[] {
    let radius = 27; // in km
    let numSlices = 8;
    let points: GeoPoint[] = [];

    for (let i = 0; i < numSlices; i++) {
        let bearing = i * 360 / numSlices;
        let newPoint = getDestinationPoint(center, radius, bearing);
        points.push(newPoint);
    }

    return points;
}

function getDestinationPoint(startPoint: GeoPoint, distance: number, bearing: number): GeoPoint {
    const R = 6371; // Earth radius in km
    const distanceAsRadian = distance / R; // distance as radian
    const bearingAsRadian = toRadian(bearing);

    let lat1 = toRadian(startPoint.lat);
    let lon1 = toRadian(startPoint.lng);

    let lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceAsRadian) + Math.cos(lat1) * Math.sin(distanceAsRadian) * Math.cos(bearingAsRadian));
    let lon2 = lon1 + Math.atan2(Math.sin(bearingAsRadian) * Math.sin(distanceAsRadian) * Math.cos(lat1), Math.cos(distanceAsRadian) - Math.sin(lat1) * Math.sin(lat2));

    // Normalize lon2 within -180 to +180 degree range
    lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

    return { lat: toDegree(lat2), lng: toDegree(lon2) };
}

export const getNearestCity = (lat: number, lng: number): ReverseGeocodeResult => {

    const localCell = S2.latLngToKey(lat, lng, 8)

    if (CELL_CITY_MAP[localCell]) {
        const [cityName, countryIso2, countryName] = CELL_CITY_MAP[localCell] as any
        return {
            cityName,
            countryIso2,
            countryName,
        }
    } 
   
    const neighbors = S2.latLngToNeighborKeys(lat, lng, 8);

    for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];

        if (CELL_CITY_MAP[neighbor]) {
            const [cityName, countryIso2, countryName] = CELL_CITY_MAP[neighbor] as any
            
            return {
                cityName,
                countryIso2,
                countryName,
            }
        }
    }

    for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        // no match, range deep
        const neighborLatLng = S2.keyToLatLng(neighbor);
        return getNearestCity(neighborLatLng.lat, neighborLatLng.lng);
    }
}

export type LatLngValue = number | string;
export type BaseDataRow = Array<LatLngValue>
export type BaseData = Array<BaseDataRow>

export type Coordinates = {
    lat: LatLngValue,
    lng: LatLngValue
};

export interface CountryIso2 {
    index: number // 49
    name: string // Germany
    code: string // DE
}

export interface ReverseGeocodeResult {
    cityName: string;
    countryIso2: string;
    countryName: string;
}
export interface CountryFeature {
  type: 'Feature';
  properties: {
    ISO_A3: string;
    NAME: string;
    ADMIN: string;
    POP_EST: number;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface MapState {
  selectedCountry: string | null;
  hoveredCountry: string | null;
  viewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
}

export interface CountryData {
  iso_code: string;
  name: string;
  capital: string;
  population: number;
  gdp_usd: number;
  flag_url: string;
}

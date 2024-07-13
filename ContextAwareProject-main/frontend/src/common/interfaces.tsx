import { Feature } from "ol";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";

export interface HouseData {
    geom_casa: string,
    id_casa: number,
    punteggio: string
}

export interface PoiData {
    id: number,
    name: string;
    longitude: number;
    latitude: number;
}

export interface PoiData2 {
    id: string;
    longitudine: string;
    latitudine: string;
    name: string;
}

export interface LayerInfo {
    layerName: string,
    layerIcon: string,
    layerColor: string,
    layer: VectorLayer<Feature<Point>>
}

export interface zoneWithScore {
    geom_area: string,
    id_area: number,
    nome: string,
    punteggio: string
}

export interface ZoneData {
    wkb_geometry:string,
    nomezona:string
}

export interface AddPoI{
    name: string;
    coordinates: {
        lon: number;
        lat: number;
    };
}

export interface Address { 
    properties: { 
        lon: number; 
        lat: number; 
        address_line1: string; 
        address_line2: string; 
    }
}

export interface MoranData {
    geometry: {
        coordinates: any[];
    };
    properties: {
        value_local_moran: string;
        name: string;
        value: number;
        value_local_moran_p_sim: number;
    };
}

export interface PredictionDataBack{
    Luogo: string,
    Data: string,
    ["Prezzo previsto"]: number
}

export interface predictionData {
    date: string;
    price: number;
}
// import libreria openlayer
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useEffect, useState } from "react";
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Style, Icon } from 'ol/style';
import Circle from 'ol/style/Circle'

// import componenti shadecn
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import { LocateFixed, Heart } from "lucide-react";

// import componenti react
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


interface PoiData {
    name: string;
    longitude: number;
    latitude: number;
}

function Isocrone() {

    const [map,setMap] = useState(null);
    const [geoData, setGeoData] =  useState(null);
    const [dataPOI, setDataPOI] =  useState([]);
  

    // variabili globali
    // - mappa in ol    
    // - coordinate centro bologna
    const bolognaCenter = {
        lon_lat: fromLonLat([11.3394883, 44.4938134]),
        zoom: 14
    }
    

    // creazione della mappa
    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        });

        const mapInstance = new Map({
            target: "map",
            layers: [osmLayer],
            view: new View({
                center: bolognaCenter.lon_lat,
                zoom: bolognaCenter.zoom,
            }),
        });

        setMap(mapInstance);

        return () => {
            if (mapInstance) {
                mapInstance.setTarget(null);
            }
        };
    }, []);

    useEffect(() => {
        fetch('http://localhost:4000/isochrones', {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {

            //console.log(data);
            setGeoData(data);
            
        })
        .catch(error => {
            console.error('Errore nella fetch:', error);
        });
    }, []);

    useEffect(() => {
        fetch('http://localhost:4000/Poi', {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {

            //console.log(data);
            setDataPOI(data);
            
        })
        .catch(error => {
            console.error('Errore nella fetch:', error);
        });
    }, []);

    useEffect(() => {
        if (!map) return;
  
        if(geoData){

            const vectorSource = new VectorSource({
                features: new GeoJSON().readFeatures(geoData, {
                    featureProjection: 'EPSG:3857'
                })
            });

             // Create a vector layer from the vector source
             const vectorLayer = new VectorLayer({
                source: vectorSource,
                style: new Style({
                    fill: new Fill({
                        color: 'rgba(0, 150, 255, 0.5)'
                    }),
                    stroke: new Stroke({
                        color: '#0000FF',
                        width: 2
                    })
                })
            });

            // Aggiungi il livello vettoriale alla mappa
            map.addLayer(vectorLayer);

            dataPOI.forEach((dataArray: PoiData[]) => {
                dataArray.forEach((item: PoiData) => {
                    const coordinates = fromLonLat([item.longitude, item.latitude]);
                    
                    // Verifica se le coordinate del punto sono all'interno della geometria dell'isocrone
                    const pointFeature = new Feature({
                        geometry: new Point(coordinates),
                    });
            
                    // Verifica l'intersezione delle coordinate con la geometria dell'isocrone
                    let isInside = false;
                    vectorSource.getFeatures().forEach((feature) => {
                        if (feature.getGeometry().intersectsCoordinate(coordinates)) {
                            isInside = true;
                        }
                    });
            
                    if (isInside) {
                        const style = new Style({
                            image: new Icon({
                                src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                                scale: 0.5,
                            }),
                        });
                        pointFeature.setStyle(style);
            
                        // Aggiungi la feature Point direttamente alla VectorSource della geometria dell'isocrone
                        vectorSource.addFeature(pointFeature);
                    }
                });
            });
            
        }
        
    }, [map, geoData,dataPOI]);

    // funzioni movimento sulla mappa
    function centerBologna() {
        if(map){
            let point = new Point(bolognaCenter.lon_lat);


            map.getView().fit(point, {
                padding: [100, 100, 100, 100],
                maxZoom: bolognaCenter.zoom,
                duration: 1000
            });
        }

    }

    return (

        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
                <div style={{ height: '100%', width: '100%' }} id="map" className="map-container relative" >
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-5 left-5 z-10"
                        onClick={centerBologna}>
                        <LocateFixed className="h-4 w-4" />
                    </Button>
                </div>
            </ResizablePanel>

            <ResizableHandle />
    

            <ResizablePanel minSize={10} maxSize={20} className="flex flex-col justify-between">
                <div className="flex flex-row m-1">
                    <Button variant="secondary" className="m-auto"><Heart /></Button>
                    <Button className="m-auto flex-1">Cerca</Button>
                </div>
            </ResizablePanel>

        </ResizablePanelGroup>
    )
}

export default Isocrone;
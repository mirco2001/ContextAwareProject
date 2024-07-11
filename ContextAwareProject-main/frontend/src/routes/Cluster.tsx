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
import Text from 'ol/style/Text.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Style, Icon,  RegularShape } from 'ol/style';
import Circle from 'ol/style/Circle'
import WKB from "ol/format/WKB";

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
    const [cluster,setCluster] = useState(null);

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
        fetch('http://localhost:4000/datiCluster', {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {
            setCluster(data);
        })
        .catch(error => {
            console.error('Errore nella fetch:', error);
        });
    }, []);    


    const getColor = (score: number, min: number, max: number) => {
        const red = { r: 184, g: 42, b: 29 };
        const yellow = { r: 176, g: 176, b: 18 };
        const green = { r: 58, g: 140, b: 46 };

        if (max === min) return { r: 58, g: 140, b: 46 };

        let normalizedScore = (score - min) / (max - min);

        let r, g, b;
        if (normalizedScore < 0.5) {
            normalizedScore *= 2;
            r = Math.round(red.r + normalizedScore * (yellow.r - red.r));
            g = Math.round(red.g + normalizedScore * (yellow.g - red.g));
            b = Math.round(red.b + normalizedScore * (yellow.b - red.b));
        } else {
            normalizedScore = (normalizedScore - 0.5) * 2;
            r = Math.round(yellow.r + normalizedScore * (green.r - yellow.r));
            g = Math.round(yellow.g + normalizedScore * (green.g - yellow.g));
            b = Math.round(yellow.b + normalizedScore * (green.b - yellow.b));
        }
        return { r: r, g: g, b: b };
    }

    useEffect(() => {
        if (!map) return;
        if(!cluster) return;
        const wkbParser = new WKB();
        const vectorSource = new VectorSource();

        var min = Number.MAX_VALUE; // Inizializza min con il massimo valore possibile
        var max = Number.MIN_VALUE; // Inizializza max con il minimo valore possibile

        cluster.forEach(({ centroide, cid, punteggio }) => {
            if (parseInt(punteggio) < min) {
                min = parseInt(punteggio);
            }
            if (parseInt(punteggio) > max) {
                max = parseInt(punteggio);
            }
        });

        cluster.forEach(({ centroide, cid, punteggio }) => {
            const feature = new Feature({
                geometry: wkbParser.readGeometry(centroide, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: map.getView().getProjection(),
                }),
            });

            feature.setProperties({
                cid,
                punteggio,
            });
            let value = getColor(parseInt(punteggio), min, max);
            let color = "rgba(" + value.r + ", " + value.g + "," + value.b + ", 0.5)";
            const style = [
                new Style({
                    image: new RegularShape({
                        points: 4,  
                        radius: 80,  
                        angle: Math.PI / 4,  
                        fill: new Fill({
                           color: color,
                        }),
                        stroke: new Stroke({
                            color: color,
                            width: 2 
                        }),
                    })
                }),
                new Style({
                    image: new Icon({
                        src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtcGluIj48cGF0aCBkPSJNMTIgMTd2NSIvPjxwYXRoIGQ9Ik05IDEwLjc2YTIgMiAwIDAgMS0xLjExIDEuNzlsLTEuNzguOUEyIDIgMCAwIDAgNSAxNS4yNFYxNmExIDEgMCAwIDAgMSAxaDEyYTEgMSAwIDAgMCAxLTF2LS43NmEyIDIgMCAwIDAtMS4xMS0xLjc5bC0xLjc4LS45QTIgMiAwIDAgMSAxNSAxMC43NlY3YTEgMSAwIDAgMSAxLTEgMiAyIDAgMCAwIDAtNEg4YTIgMiAwIDAgMCAwIDQgMSAxIDAgMCAxIDEgMXoiLz48L3N2Zz4=',
                        scale: 1.2,
                    }),
                }),
                new Style({
                    text: new Text({
                        text: 'Punteggio: ' + punteggio, 
                        font: 'bold 12px Arial',
                        fill: new Fill({
                            color: '#000000'
                        }),
                        stroke: new Stroke({
                            color: '#ffffff',
                            width: 3
                        }),
                        offsetY: 40
                    })
                })
            ];
            
            feature.setStyle(style);

            vectorSource.addFeature(feature);
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        map.addLayer(vectorLayer);


    }, [map,cluster]);

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
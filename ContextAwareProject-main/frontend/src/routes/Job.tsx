// import libreria openlayer
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useEffect, useState } from "react";
import { Map, View } from 'ol';
import { fromLonLat, transform } from 'ol/proj';
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

function WorkerPath() {

    const [map,setMap] = useState(null);
    const [points, setPoints] = useState([]);
    const [distance, setDistance] = useState(null);
    const [time, setTime] = useState(null);

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
        if(!map) return;

        map.on("singleclick", (evt) => {

        const coordinates = evt.coordinate;

        const convertedCoordinates = transform(coordinates, 'EPSG:3857', 'EPSG:4326');

        setPoints((prevPoints) => [...prevPoints, convertedCoordinates]);

        const feature = new Feature({
            geometry: new Point(coordinates),
        });

        const style = new Style({
            image: new Icon({
                src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                scale: 0.5,
            }),
        });

        feature.setStyle(style);

        const vectorSource = new VectorSource({
            features: [feature],
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });
        
        map.addLayer(vectorLayer);

        })

    }, [map]);


    function computeRoute() {

        if(points.length <= 1) return;

        const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"; //specificare se in macchina o altro e implementare la possibilità di resettare la ricerca o cancellare marker ??
        const headers = {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Content-Type': 'application/json',
          'Authorization': '5b3ce3597851110001cf6248162e7ecb62784b71836d89d90e7548bf'
        };
        
    
        const pointsObj = JSON.stringify({ points });


        let jsonObj = JSON.parse(pointsObj);

        let coordinates = jsonObj.points;

        const body = JSON.stringify({coordinates});
        
        fetch(url, {
          method: 'POST',
          headers: headers,
          body: body
        })
        .then(response => {
          return response.json();
        })
        .then(data => {

          data.features.map(i=>{
            setDistance(i.properties.summary.distance);
            setTime(i.properties.summary.duration/60);
          }); 

          const vectorLayer = new VectorLayer({   
            source: new VectorSource({
                features: new GeoJSON().readFeatures(data, {
                    featureProjection: 'EPSG:3857'
                })
            }),
            style: new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 3,
                }),
            }),
        });

        map.addLayer(vectorLayer);
        })
        .catch(error => {
          console.error('Error:', error);
        });

    }

  
    
        

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
                <div style={{ height: '100%', width: '100%' }} id="map" className="map-container relative">
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
                    <Button onClick={()=>computeRoute()}> Calcola il percorso </Button>
                    {time &&  distance && (
                        <div className="m-1">
                            <p>Durata in minuti: {time.toFixed(2)}</p>
                            <p>Distanza in metri: {distance}</p>
                        </div>
                    )}
                </div>
            </ResizablePanel>

        </ResizablePanelGroup>
    )
}

export default WorkerPath;
// import libreria openlayer
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useEffect, useState } from "react";
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';

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

function HouseVisualization() {

    const navigate = useNavigate();
    const [map,setMap] = useState(null);
    const [dataPOI, setDataPOI] =  useState([]);
    const [activeLayers, setActiveLayers] = useState<boolean[]>([]); 
    const [layers, setLayers] = useState<VectorLayer[][]>([]);
  

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
        //console.log(dataPOI);
        if (!map) return;
        // console.log(poiLayer)
            
       /* const createFeaturesFromData = (dataArray: PoiData[][]): Feature[] => {
            let features: Feature[] = [];
        
            dataArray.forEach(array => {
                const arrayFeatures = array.map(item => {
                    const coordinates = fromLonLat([item.longitude, item.latitude]);
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
                    return feature;
                });
        
                features = features.concat(arrayFeatures);
            });
        
            return features;
        };
            
    
            const features = createFeaturesFromData(dataPOI);
    
            const vectorSource = new VectorSource({
                features: features,
            });
    
            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });
            */
            const newLayers = dataPOI.map((dataArray: PoiData[], index: number) => {
                const arrayLayers = dataArray.map((item: PoiData) => {
                    const coordinates = fromLonLat([item.longitude, item.latitude]);
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
    
                    return new VectorLayer({
                        source: vectorSource,
                    });
                });
    
                return arrayLayers;
            });

            setLayers(newLayers);

    }, [map, dataPOI]);

    /*useEffect(() => {

        if (!map) return;

        if (!poiLayer) {
            const poiCoordinates = fromLonLat([11.34518, 44.49441]);
            const poiFeature = new Feature({
                geometry: new Point(poiCoordinates),
            });

            const poiStyle = new Style({
                image: new Icon({
                    src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                    scale: 0.1,
                }),
            });

            poiFeature.setStyle(poiStyle);

            const vectorSource = new VectorSource({
                features: [poiFeature],
            });

            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });

            setPoiLayer(vectorLayer);
        }

        if (showPoi && poiLayer) {
            map.addLayer(poiLayer);
        } else if (poiLayer) {
            map.removeLayer(poiLayer);
        }
    }, [showPoi, map, poiLayer]);*/

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

    const handleCheckboxChange = (index: number) => {
        setActiveLayers((prevState: boolean[]) => {
            const newState = [...prevState];
            newState[index] = !newState[index];

            if(layers[index]){
                if (newState[index]) {
                    layers[index].forEach((layer: any) => map.addLayer(layer));
                } else {
                    layers[index].forEach((layer: any) => map.removeLayer(layer));
                }
    
            }
        
            return newState;
        });
    };


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

            {/* <Checkbox id="checkbox1" onClick={() => { setShowPoi(!showPoi) }} />
            <label
                htmlFor="checkbox1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Visualizza PoI
            </label>  */}

            <div>
                {dataPOI.map((dataArray: PoiData[], index: number) => (
                    <div key={index}>
                        <Checkbox 
                            id={`checkbox${index}`} 
                            checked={activeLayers[index]}
                            onClick={() => handleCheckboxChange(index)} 
                        />
                        <label
                            htmlFor={`checkbox${index}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {`Visualizza Layer ${dataArray[0].name}`}
                        </label>
                    </div>
                ))}
            </div>
    

            <ResizablePanel minSize={10} maxSize={20} className="flex flex-col justify-between">
                <div className="flex flex-row m-1">
                    <Button variant="secondary" className="m-auto"><Heart /></Button>
                    <Button className="m-auto flex-1">Cerca</Button>
                </div>
            </ResizablePanel>

        </ResizablePanelGroup>
    )
}

export default HouseVisualization;
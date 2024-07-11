// import libreria openlayer
import { OSM } from "ol/source";
import { useEffect, useState } from "react";
import { Feature, Map as MapOl, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON.js';

// import componenti shadecn
import { Button } from "@/components/ui/button"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
    Card,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { LocateFixed, Heart } from "lucide-react";

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';

// import componenti react
import { Link } from "react-router-dom";
import { Geometry, Polygon } from "ol/geom";

import UserProfile from '../UserProfile.ts'
import VectorSource from "ol/source/Vector";

import "./HomePage.css"

import AddressSearch from "@/components/myComponents/AddressSearch.tsx";
import ZoneSearch from "@/components/myComponents/ZoneSearch.tsx";
import GeofenceSearch from "@/components/myComponents/GeofenceSearch.tsx";
import MapMoran from "@/components/myComponents/MapMoran.tsx";
import MapPrediction from "@/components/myComponents/MapPrediction.tsx";
import {geofenceNormalStyle} from "@/common/geofenceStyles.tsx";
import { moveMapTo } from "@/lib/utils.ts";
import MapBestZone from "@/components/myComponents/MapBestZone.tsx";

function MapSearch(props: any) {

    // ======== VARIABILI GLOBALI ========
    // - mappa in ol  
    const [map, setMap] = useState<MapOl>();

    const [layer, setLayer] = useState<VectorLayer<Feature<Geometry>>>();

    const [featuresInfo, setFeaturesInfo] = useState<Feature<Geometry>[]>([])

    // - coordinate centro bologna
    const bolognaCenter = {
        lon_lat: [11.3394883, 44.4938134],
        zoom: 14
    }
    // ===================================

    // creazione della mappa
    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        });

        const mapInstance = new MapOl({
            target: "map",
            layers: [osmLayer],
            view: new View({
                center: fromLonLat(bolognaCenter.lon_lat),
                zoom: bolognaCenter.zoom,
            }),
        });

        setMap(mapInstance);


        let vectorSource = new VectorSource()
        let vectorLayer = new VectorLayer({
            source: vectorSource,
            style: geofenceNormalStyle,
        })
        setLayer(vectorLayer);

        return () => {
            if (mapInstance)
                mapInstance.setTarget(undefined);
        }
    }, []);

    function circleToPolygon(circle, sides: number) {
        const geometry = circle.getGeometry();

        if (!geometry)
            return

        const center = geometry.getCenter();
        const radius = geometry.getRadius();
        const points = [];

        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            const x = center[0] + radius * Math.cos(angle);
            const y = center[1] + radius * Math.sin(angle);
            points.push([x, y]);
        }
        points.push(points[0]); // chiudi il poligono

        return new Feature(new Polygon([points]));
    }

    // funzione invio dei dati
    function searcFromInfo() {
        let features: Feature<Geometry>[];

        // controllo il tipo di ricerca che si sta effettuando
        if (props.searchType != "zone") {
            // prendo il layer e se è presente estraggo la sua sorgente
            if (!layer)
                return;

            let vSource: VectorSource = layer.getSource();

            if (!vSource)
                return;

            // prendo tutte le feature presenti nella sorgente
            features = vSource.getFeatures();

            // nel caso in cui sto effettuando una ricerca per indirizzo
            // converto il cerchio in un poligono
            if (props.searchType == "address")
                features = [circleToPolygon(features[0], 64)];
        }
        else
            features = featuresInfo; // se sto cercando per zona dovrò prendere i dati dalla lista delle zone
        // e non dalla sorgente del layer


        if (!features)
            return;

        // converto le feature in GeoJSON indicando i "dati sulla proiezione"
        var writer = new GeoJSON();
        var geojsonStr = writer.writeFeatures(features, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });

        fetch('http://localhost:4000/datiSearch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                geom: geojsonStr,
            }),
        });

        window.location.href = "/house";
    }

    useEffect(() => {
        // se la mappa non è definita o non sono stati recuperati i dati sulle zone
        // non effettuo operazioni
        if (!map)
            return;

        // se un nuovo layer È STATO definito lo aggiungo alla mappa
        if (layer) {

            map.removeLayer(layer);
            map.addLayer(layer);
            return;
        }
    }, [map, layer]);


    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>

            {/* h-fit flex flex-col absolute left-1 top-1/2 transform -translate-y-1/2 z-10 */}

                <Tabs defaultValue="selezione" className="w-full h-full relative">
                    <TabsList className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10">
                        <TabsTrigger value="selezione" onClick={() => {
                            map?.setTarget(undefined)
                            map?.setTarget("map")
                            map?.updateSize()

                        }}>
                            Selezione
                        </TabsTrigger>
                        <TabsTrigger value="moran">
                            Moran
                        </TabsTrigger>
                        <TabsTrigger value="prediction">
                            Predizione
                        </TabsTrigger>
                        <TabsTrigger value="bestZone">
                            Zona Migliore
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="selezione" className="w-full h-full ">
                        <div style={{ height: '100%', width: '100%' }} id="map" className="map-container" />
                    </TabsContent>
                    <TabsContent value="moran" className="w-full h-full ">
                        <MapMoran
                            bolognaCenter={bolognaCenter}
                        />
                    </TabsContent>
                    <TabsContent value="prediction" className="w-full h-full ">
                        <MapPrediction
                            bolognaCenter={bolognaCenter}
                        />
                    </TabsContent>
                    <TabsContent value="bestZone" className="w-full h-full ">
                        <MapBestZone
                            bolognaCenter={bolognaCenter}
                        />
                    </TabsContent>
                </Tabs>


                <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-5 left-5 z-10"
                    onClick={() => moveMapTo(bolognaCenter.lon_lat, bolognaCenter.zoom, map)}>
                    <LocateFixed className="h-4 w-4" />
                </Button>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel minSize={12} maxSize={25} className="flex flex-col justify-between">
                <Card className="mx-4 px-4 py-8">
                    {
                        props.searchType == "zone" && <ZoneSearch
                            map={map}
                            layer={layer}
                            featuresInfo={featuresInfo}
                            setFeaturesInfo={setFeaturesInfo}
                        />
                    }

                    {
                        props.searchType == "draw" && <GeofenceSearch
                            map={map}
                            layer={layer}
                        />
                    }

                    {
                        props.searchType == "address" && <AddressSearch
                            map={map}
                            layer={layer}
                        />
                    }
                </Card>
                <div className="flex flex-row mx-3 my-6 h-[8%]">

                    <Link to='../form' className="flex-none">
                        <Button variant="secondary" className="mr-4 h-full"><Heart /></Button>
                    </Link>

                    <Link to='../house' className="flex-1">
                        <Button className="h-full w-full" onClick={() => searcFromInfo()}>Cerca</Button>
                    </Link>
                </div>
            </ResizablePanel>

        </ResizablePanelGroup>
    )
}

export default MapSearch;
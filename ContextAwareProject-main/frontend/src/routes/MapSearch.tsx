// import libreria openlayer
import { OSM } from "ol/source";
import { useEffect, useState } from "react";
import { Feature, Map as MapOl, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';
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
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";

// import componenti react
import { Link } from "react-router-dom";
import { Geometry, Polygon } from "ol/geom";

import UserProfile from '../UserProfile.ts'
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";

import "./HomePage.css"
import { Coordinate } from "ol/coordinate";

import AddressSearch from "@/components/myComponents/AddressSearch.tsx";
import ZoneSearch from "@/components/myComponents/ZoneSearch.tsx";
import GeofenceSearch from "@/components/myComponents/GeofenceSearch.tsx";
import MapMoran from "@/components/myComponents/MapMoran.tsx";

function MapSearch(props: any) {

    // ======== VARIABILI GLOBALI ========
    // - mappa in ol  
    const [map, setMap] = useState<MapOl>();

    const [layer, setLayer] = useState<VectorLayer<Feature<Geometry>>>();

    const [featuresInfo, setFeaturesInfo] = useState<Feature<Geometry>[]>([])


    // - stile geofence selezionate
    const geofenceDeleteStyle = new Style({
        fill: new Fill({
            color: 'rgba(255, 99, 71, 0.6)',
        }),
        stroke: new Stroke({
            color: 'rgba(255, 99, 71, 0.8)',
            width: 2,
        }),
    });

    const geofenceNormalStyle = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.5)',
        }),
        stroke: new Stroke({
            color: 'rgb(0, 0, 0)',
            width: 2,
        }),
        image: new Icon({
            anchor: [0.5, 1],
            src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1hcC1waW4iPjxwYXRoIGQ9Ik0yMCAxMGMwIDYtOCAxMi04IDEycy04LTYtOC0xMmE4IDggMCAwIDEgMTYgMFoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIzIi8+PC9zdmc+'
        })
    });

    const geofenceHlightStyle = new Style({
        fill: new Fill({
            color: 'rgba(0, 0, 0, 0.6)',
        }),
        stroke: new Stroke({
            color: 'rgb(0, 0, 0)',
            width: 2,
        }),
    });

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


    // funzioni movimento sulla mappa
    function moveMapTo(position: Coordinate, zoom: number) {
        if (!map)
            return;

        let point = new Point(fromLonLat(position));

        map.getView().fit(point, {
            padding: [100, 100, 100, 100],
            maxZoom: zoom,
            duration: 1000
        });
    }

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

        fetch('http://localhost:4000/datiForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                geom: geojsonStr,
                formData: UserProfile.getServicesPreference(),
            }),
        });

        // invio i dati
        console.log(UserProfile.getServicesPreference(), geojsonStr);
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



                <Tabs defaultValue="selezione" className="w-full h-full relative">
                    <TabsList className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
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
                    </TabsList>

                    <TabsContent value="selezione" className="w-full h-full ">
                        <div style={{ height: '100%', width: '100%' }} id="map" className="map-container" />
                    </TabsContent>
                    <TabsContent value="moran" className="w-full h-full ">
                        <MapMoran
                            bolognaCenter={bolognaCenter}
                            geofenceNormalStyle={geofenceNormalStyle}
                        />
                    </TabsContent>
                </Tabs>


                <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-5 left-5 z-10"
                    onClick={() => moveMapTo(bolognaCenter.lon_lat, bolognaCenter.zoom)}>
                    <LocateFixed className="h-4 w-4" />
                </Button>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel minSize={12} maxSize={25} className="flex flex-col justify-between">
                <Card className="mx-4 px-4 py-8">
                    {
                        props.searchType == "zone" && <ZoneSearch
                            geofenceNormalStyle={geofenceNormalStyle}
                            geofenceHlightStyle={geofenceHlightStyle}
                            map={map}
                            layer={layer}
                            featuresInfo={featuresInfo}
                            setFeaturesInfo={setFeaturesInfo}
                        />
                    }

                    {
                        props.searchType == "draw" && <GeofenceSearch
                            geofenceNormalStyle={geofenceNormalStyle}
                            geofenceDeleteStyle={geofenceDeleteStyle}
                            map={map}
                            layer={layer}
                        />
                    }

                    {
                        props.searchType == "address" && <AddressSearch
                            geofenceNormalStyle={geofenceNormalStyle}
                            map={map}
                            layer={layer}
                            moveMapTo={moveMapTo}
                        />
                    }
                </Card>
                <div className="flex flex-row mx-3 my-6 h-[8%]">

                    <Link to='../form'>
                        <Button variant="secondary" className="mr-4 h-full"><Heart /></Button>
                    </Link>

                    <Button className="h-full flex-1" onClick={() => searcFromInfo()}>Cerca</Button>
                </div>
            </ResizablePanel>

        </ResizablePanelGroup>
    )
}

export default MapSearch;
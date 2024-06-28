// import libreria openlayer
import { OSM } from "ol/source";
import { useEffect, useState } from "react";
import { Feature, Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';

// import componenti shadecn
import { Button } from "@/components/ui/button"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"


import ZoneSearch from "@/components/myComponents/ZoneComponent.tsx";

import { LocateFixed, Heart } from "lucide-react";

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";

// import componenti react
import { Link } from "react-router-dom";
import { Geometry, SimpleGeometry } from "ol/geom";

import UserProfile from '../UserProfile.ts'
import GeofenceSearch from "@/components/myComponents/GeofenceComponent.tsx";
import AddressSearch from "@/components/myComponents/AddressSearch.tsx";
import VectorSource from "ol/source/Vector";



function MapSearch(props: any) {

    const [map, setMap] = useState<Map>();
    const [layer, setLayer] = useState<VectorLayer<Feature<Geometry>>>();

    const [featuresInfo, setFeaturesInfo] = useState<Feature<Geometry>[]>([])

    // ======== VARIABILI GLOBALI ========
    // - mappa in ol  

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
            color: 'rgba(99, 179, 237, 0.6)',
        }),
        stroke: new Stroke({
            color: '#2F4F4F',
            width: 3,
        }),
    });

    const geofenceHlightStyle = new Style({
        fill: new Fill({
            color: '#EEE',
        }),
        stroke: new Stroke({
            color: '#3399CC',
            width: 2,
        }),
    });

    // - coordinate centro bologna
    const bolognaCenter = {
        lon_lat: fromLonLat([11.3394883, 44.4938134]),
        zoom: 14
    }
    // ===================================

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


        let vectorSource = new VectorSource()
        let vectorLayer = new VectorLayer({
            source: vectorSource,
        })
        setLayer(vectorLayer);

        return () => {
            if (mapInstance)
                mapInstance.setTarget(undefined);
        }
    }, []);


    // funzioni movimento sulla mappa
    function centerBologna() {
        if (!map)
            return;

        let point = new Point(bolognaCenter.lon_lat);

        map.getView().fit(point, {
            padding: [100, 100, 100, 100],
            maxZoom: bolognaCenter.zoom,
            duration: 1000
        });
    }

    // funzione invio dei dati
    function searcFromInfo() {
        let features: Feature<Geometry>[];

        if (props.searchType != "zone") {
            if (!layer)
                return;

            let vSource: VectorSource = layer.getSource();

            if (!vSource)
                return;

            features = vSource.getFeatures();
        }
        else
            features = featuresInfo;


        console.log(features);

        if (!features)
            return;

        var geometries: Array<any> = [];

        features.forEach(feature => {
            var featGeometry = feature.getGeometry()

            if (featGeometry == undefined)
                return;

            if (featGeometry instanceof SimpleGeometry)
                geometries.push(featGeometry.getCoordinates());
        });

        console.log(UserProfile.getServicesPreference(), geometries);
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



    // metodi di ricerca
    // - ricerca tramite zona



    // - ricerca tramite geofence


    return (

        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
                <div style={{ height: '100%', width: '100%' }} id="map" className="map-container" />
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-5 left-5 z-10"
                    onClick={centerBologna}>
                    <LocateFixed className="h-4 w-4" />
                </Button>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel minSize={12} maxSize={25} className="flex flex-col justify-between">
                {
                    props.searchType == "zone" && <ZoneSearch
                        geofenceNormalStyle={geofenceNormalStyle}
                        geofenceHlightStyle={geofenceHlightStyle}
                        map={map}
                        layer={layer}
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
                    />
                }
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
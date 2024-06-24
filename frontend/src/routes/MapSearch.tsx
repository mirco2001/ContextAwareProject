// import libreria openlayer
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useEffect } from "react";
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';

// import componenti shadecn
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


function MapSearch() {

    const { state } = useLocation();
    const navigate = useNavigate();

    // variabili globali
    // - mappa in ol    
    var map: Map;
    // - coordinate centro bologna
    const bolognaCenter = {
        lon_lat: fromLonLat([11.3394883, 44.4938134]),
        zoom: 14
    }
    // - tipo di ricerca che si è richiesta
    const { searchType } = state;

    // creazione della mappa
    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        });

        map = new Map({
            target: "map",
            layers: [osmLayer],
            view: new View({
                center: bolognaCenter.lon_lat,
                zoom: bolognaCenter.zoom,
            }),
        });

        return () => map.setTarget(undefined)
    }, []);

    // funzioni movimento sulla mappa
    function centerBologna() {
        let point = new Point(bolognaCenter.lon_lat);


        map.getView().fit(point, {
            padding: [100, 100, 100, 100],
            maxZoom: bolognaCenter.zoom,
            duration: 1000
        });
    }

    function switchSearch() {
        switch (searchType) {
            case "zone":
                return zoneSearch();
            case "draw":
                return geofenceSearch();
            case "address":
                return addressSearch();
        }

        return (<></>);
    }

    // metodi di ricerca
    // - ricerca tramite zona
    function zoneSearch() {
        return 1;
    }
    // - ricerca tramite geofence
    function geofenceSearch() {
        return 2;
    }
    // - ricerca tramite indirizzo
    function addressSearch() {
        return 3;
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
                {switchSearch()}
                <div className="flex flex-row m-1">
                    <Button variant="secondary" className="m-auto"><Heart /></Button>
                    <Button className="m-auto flex-1">Cerca</Button>
                </div>
            </ResizablePanel>

        </ResizablePanelGroup>
    )
}

export default MapSearch;
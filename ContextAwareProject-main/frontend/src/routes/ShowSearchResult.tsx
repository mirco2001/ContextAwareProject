import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"


import { LocateFixed } from "lucide-react"

import { Map as MapOl, View } from 'ol';
import { fromLonLat } from "ol/proj"
import { Point } from "ol/geom"
import { useEffect, useState } from "react"
import { Coordinate } from "ol/coordinate"
import TileLayer from "ol/layer/Tile"
import { OSM } from "ol/source"

import PoiToggleList from "@/components/myComponents/PoiToggleList"



function SearchResult() {

    const [map, setMap] = useState<MapOl>();


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

        return () => {
            if (mapInstance) {
                mapInstance.setTarget(undefined);
            }
        };
    }, []);

    useEffect(() => {
        fetch('http://localhost:4000/datiForm', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {

                console.log(data);
                
            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });
    }, []);

    const bolognaCenter = {
        lon_lat: [11.3394883, 44.4938134],
        zoom: 14
    }

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

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
                <div style={{ height: '100%', width: '100%' }} id="map" className="map-container"/>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-5 left-5 z-10"
                    onClick={() => moveMapTo(bolognaCenter.lon_lat, bolognaCenter.zoom)}>
                    <LocateFixed className="h-4 w-4" />
                </Button>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel minSize={10} maxSize={20} className="flex flex-col justify-around px-6">
                <PoiToggleList map={map} />
            </ResizablePanel>

        </ResizablePanelGroup>
    )
}

export default SearchResult;
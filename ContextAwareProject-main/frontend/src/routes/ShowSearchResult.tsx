import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"


import { LocateFixed } from "lucide-react"

import { Feature, Map as MapOl, View } from 'ol';
import { fromLonLat } from "ol/proj"
import { Point, Polygon } from "ol/geom"
import { useEffect, useState } from "react"
import { Coordinate } from "ol/coordinate"
import TileLayer from "ol/layer/Tile"
import { OSM } from "ol/source"

import PoiToggleList from "@/components/myComponents/PoiToggleList"
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Fill, Stroke, Style } from "ol/style";



// ns no valore
// HH prezzo alto
const HHstyle = new Style({
    fill: new Fill({
        color: 'rgba(255, 99, 71, 0.6)',
    }),
    stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.8)',
        width: 2,
    })
})
// HL prezzo alto neighboor basso
const HLstyle = new Style({
    fill: new Fill({
        color: 'rgba(255,255,51, 0.6)',
    }),
    stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.8)',
        width: 2,
    })
})


function SearchResult() {

    const [map, setMap] = useState<MapOl>();

    const [moranData, setMoranData] = useState();


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
        fetch('http://localhost:4000/moranData', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {

                setMoranData(data);

            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });
        fetch('http://localhost:4000/moranIndex', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data);
            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });
    }, []);


    useEffect(() => {
        if (!moranData)
            return;

        let features: Feature[] = []

        moranData.features.forEach(element => {

            let coordinateBlock = element.geometry.coordinates[0];

            const convertedCoordinates = coordinateBlock.map(coord => fromLonLat(coord));

            // Crea un poligono
            const polygon = new Polygon([convertedCoordinates]);

            console.log(polygon.getCoordinates());

            // Crea una feature con il poligono
            const polygonFeature = new Feature(polygon);

            console.log(element.properties.value_local_moran);
            

            switch (element.properties.value_local_moran) {
                case "HL":
                    polygonFeature.setStyle(HLstyle)
                    break;
                case "HH":
                    polygonFeature.setStyle(HHstyle)
                    break;

            }



            features.push(polygonFeature)
        });

        let source = new VectorSource({
            features: features
        })

        let laysa = new VectorLayer({
            source: source
        })

        map?.addLayer(laysa)

        // map.addLayer(newLayer);

    }, [moranData]);


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
                <div style={{ height: '100%', width: '100%' }} id="map" className="map-container" />
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
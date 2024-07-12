import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { Map as MapOl, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from 'ol/style/Text.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon, RegularShape } from 'ol/style';
import WKB from "ol/format/WKB";


// import componenti react
import { useEffect, useState } from "react";


import { getColor } from "@/lib/utils";


function MapClusters(props: any) {

    const [map, setMap] = useState<MapOl | undefined>(undefined);
    const [cluster, setCluster] = useState(null);

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
                center: fromLonLat(props.bolognaCenter.lon_lat),
                zoom: props.bolognaCenter.zoom,
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
                console.log(data);
                
            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });
    }, []);

    useEffect(() => {
        if (!map || !cluster) return;

        if (map.getAllLayers().length > 1)
            return

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


    }, [map, cluster]);

    return (
        <div style={{ height: '100%', width: '100%' }} id="map" className="map-container relative" >
        </div>
    )

}

export default MapClusters;
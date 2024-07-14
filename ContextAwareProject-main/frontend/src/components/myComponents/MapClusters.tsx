import TileLayer from "ol/layer/Tile";
import { OSM, XYZ } from "ol/source";
import { Map as MapOl } from 'ol';
import Feature from 'ol/Feature';
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from 'ol/style/Text.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon, RegularShape } from 'ol/style';
import WKB from "ol/format/WKB";


// import componenti react
import { useEffect, useRef, useState } from "react";


import { getColor } from "@/lib/utils";
import { attributions, key } from "@/common/keys";

interface clusterInfo {
    cid: number,
    centroide:string,
    punteggio: string
}


function MapClusters(props: any) {

    const [map, setMap] = useState<MapOl | null>(null);
    const [tileLayer, setTilelayer] = useState<TileLayer<any>>();
    const [cluster, setCluster] = useState<clusterInfo[]|null>(null);

    const OSM_source = useRef(new OSM());
    const aerial_source = useRef(new XYZ({
        attributions: attributions,
        url: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + key,
        tileSize: 512,
        maxZoom: 20,
    }));

    // creazione della mappa
    useEffect(() => {
        const tileLayerInstance = new TileLayer({
            preload: Infinity,
            source: getTileProvider(props.tileProvider),
        });

        setTilelayer(tileLayerInstance)

        const mapInstance = new MapOl({
            target: "map",
            layers: [tileLayerInstance],
            view: props.mapView,
        });

        setMap(mapInstance);

        return () => {
            if (mapInstance) {
                mapInstance.setTarget(undefined);
            }
        };
    }, []);

    useEffect(() => {
        if (!props.tileProvider)
            return;

        tileLayer?.setSource(getTileProvider(props.tileProvider));

    }, [props.tileProvider]);


    function getTileProvider(provider: string) {

        switch (provider) {
            case "osm":
                return OSM_source.current;
            case "aerial":
                return aerial_source.current;
            default:
                return OSM_source.current;
        }
    }

    useEffect(() => {
        fetch('http://backend:4000/datiCluster', {
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

    useEffect(() => {
        if (!map || !cluster) return;

        if (map.getAllLayers().length > 1)
            return

        const wkbParser = new WKB();
        const vectorSource = new VectorSource();

        var min = Number.MAX_VALUE; // Inizializza min con il massimo valore possibile
        var max = Number.MIN_VALUE; // Inizializza max con il minimo valore possibile

        cluster.forEach((element:clusterInfo) => {

            if (parseInt(element.punteggio) < min) {
                min = parseInt(element.punteggio);
            }
            if (parseInt(element.punteggio) > max) {
                max = parseInt(element.punteggio);
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
// import libreria openlayer
import { Feature } from 'ol';
import { fromLonLat } from "ol/proj"
import { Geometry } from "ol/geom"
import { useEffect, useRef, useState } from "react"
import { OSM, XYZ } from "ol/source"
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import { Map as MapOl, View } from 'ol';
import TileLayer from "ol/layer/Tile";
import { Pixel } from 'ol/pixel';
import WKB from 'ol/format/WKB';
import { FeatureLike } from 'ol/Feature';

// import componenti shadecn
import {
    Card
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { getColor } from "@/lib/utils";
import { coloredStyleWithName, normalStyleWithName } from '@/common/geofenceStyles';
import { zoneWithScore } from '@/common/interfaces';
import { attributions, key } from '@/common/keys';

function MapBestZone(props: any) {

    // === DICHIARAZIONE DEGLLE VARIABILI STATE ===
    // - per la gestione della mappa e dei suoi layer
    const [mapBestZone, setMapBestZone] = useState<MapOl>();
    const [tileLayer, setTilelayer] = useState<TileLayer<any>>();
    const [zonesLayer, setZonesLayer] = useState<VectorLayer<Feature<Geometry>> | undefined>(undefined);

    const OSM_source = useRef(new OSM());
    const aerial_source  = useRef(new XYZ({
        attributions: attributions,
        url: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + key,
        tileSize: 512,
        maxZoom: 20,
    }));

    const [datiZone, setDatiZone] = useState<zoneWithScore[]>();

    const [scoreLimits, setScoreLimits] = useState<[number, number]>()

    const info = document.getElementById('info');

    let lastFeature: FeatureLike | undefined;
    const [zoneName, setZoneName] = useState<string | undefined>(undefined)
    const [zoneScore, setZoneScore] = useState<number | undefined>(undefined)


    // creazione della mappa
    useEffect(() => {
        const tileLayerInstance = new TileLayer({
            preload: Infinity,
            source: getTileProvider(props.tileProvider),
        });

        setTilelayer(tileLayerInstance)

        const mapInstance = new MapOl({
            target: "mapBestZone",
            layers: [tileLayerInstance],
            view: props.mapView,
        });

        setMapBestZone(mapInstance);

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
        // recupero i dati delle zone
        fetch('http://localhost:4000/getAree', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {
                setDatiZone(data.infoaree);
            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });

    }, [])


    useEffect(() => {
        if (!mapBestZone || !datiZone)
            return;

        if (mapBestZone.getAllLayers().length > 1)
            return;
       

        let maxScore: number, minScore: number;
        maxScore = minScore = parseInt(datiZone[0].punteggio);

        let vSource = new VectorSource();

        const format = new WKB();

        datiZone.forEach((element: zoneWithScore) => {

            const feature = format.readFeature(element.geom_area, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            feature.setStyle(normalStyleWithName(element.nome));

            feature.set('name', element.nome);
            feature.set('score', element.punteggio);

            if (maxScore < parseInt(element.punteggio))
                maxScore = parseInt(element.punteggio);

            if (minScore > parseInt(element.punteggio))
                minScore = parseInt(element.punteggio)

            vSource.addFeature(feature);
        });

        let vLayer = new VectorLayer({
            source: vSource
        })

        mapBestZone.addLayer(vLayer);
        setScoreLimits([minScore, maxScore]);
        setZonesLayer(vLayer);
    }, [datiZone])


    useEffect(() => {
        if (!zonesLayer || !scoreLimits)
            return;

        let features = zonesLayer?.getSource()?.getFeatures();

        features?.forEach((feature: Feature) => {

            let color = getColor(feature.get("score"), scoreLimits[0], scoreLimits[1])



            let colorString = "rgba(" + color.r + "," + color.g + "," + color.b + ", 0.6)";

            feature.setStyle(coloredStyleWithName(feature.get("name"), colorString))
        });

    }, [zonesLayer, scoreLimits]);




    useEffect(() => {
        if (!mapBestZone)
            return;

        info.style.visibility = 'hidden';

        mapBestZone.on('pointermove', function (evt) {
            if (!info)
                return;

            if (evt.dragging) {
                info.style.visibility = 'hidden';
                lastFeature = undefined;
                return;
            }


            const pixel = mapBestZone.getEventPixel(evt.originalEvent);
            displayFeatureInfo(pixel, evt.originalEvent.target);

        });

    }, [mapBestZone]);

    const displayFeatureInfo = function (pixel: Pixel, target) {
        if (!info || !mapBestZone)
            return;

        const feature = target.closest('.ol-control')
            ? undefined
            : mapBestZone.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            });
        if (feature) {
            info.style.left = pixel[0] + 'px';
            info.style.top = pixel[1] + 'px';

            if (lastFeature != feature) {

                info.style.visibility = 'visible';

                setZoneName(feature.get("name"));
                setZoneScore(feature.get("score"));


            }
        } else {
            info.style.visibility = 'hidden';
        }

        lastFeature = feature;
    };




    return (
        <div className="h-full w-full relative">

            <div style={{ height: '100%', width: '100%' }}
                id="mapBestZone"
                className="map-container"
                onMouseOut={() => {
                    if (info)
                        info.style.visibility = 'hidden';
                }}>

                <Card id="info" className='flex flex-col justify-around p-4 z-10 absolute pointer-events-none space-y-2'>

                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Zona {zoneName}
                    </h3>

                    <Separator />

                    <div className='flex flex-row justify-between items-baseline'>
                        <span>Punteggio </span>
                        <p className="text-xl text-muted-foreground"> {zoneScore} </p>
                    </div>

                </Card>

            </div>



            <Card className='absolute bottom-5 right-5 px-4 py-2 flex flex-col space-y-4 w-[15%]'>

                <span className='text-center'>Punteggio delle zone</span>

                <Separator />

                <div className='flex flex-row space-x-2 py-2'>
                    <span>{scoreLimits ? scoreLimits[0] : 0} pt</span>
                    <Card className='h-6 flex-1 bg-gradient-to-r from-[rgb(58,140,46)] via-[rgb(176,176,18)] to-[rgb(184,42,29)]' />
                    <span>{scoreLimits ? scoreLimits[1] : 0} pt</span>
                </div>

            </Card>

        </div>
    )
}

export default MapBestZone;
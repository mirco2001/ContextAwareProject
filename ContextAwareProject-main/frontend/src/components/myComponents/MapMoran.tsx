import { Feature } from 'ol';
import { fromLonLat } from "ol/proj"
import { Polygon } from "ol/geom"
import { useEffect, useState } from "react"
import { OSM } from "ol/source"
import { Fill, Stroke, Style } from "ol/style"
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import TextOl from 'ol/style/Text.js';

import { Map as MapOl, View } from 'ol';
import TileLayer from "ol/layer/Tile";

import {
    Card
} from "@/components/ui/card"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import { Coordinate } from 'ol/coordinate';
import { FeatureLike } from 'ol/Feature';


// LL prezzo basso vicino basso
const LLstyle = new Style({
    fill: new Fill({
        color: 'rgba(98,144,195, 0.6)',
    }),
    stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.8)',
        width: 2,
    })
})
// LH prezzo basso vicino alto
const LHstyle = new Style({
    fill: new Fill({
        color: 'rgba(119,186,153, 0.6)',
    }),
    stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.8)',
        width: 2,
    })
})
// HL prezzo alto vicino basso
const HLstyle = new Style({
    fill: new Fill({
        color: 'rgba(247,184,1, 0.6)',
    }),
    stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.8)',
        width: 2,
    })
})
// HH prezzo alto vicino alto
const HHstyle = new Style({
    fill: new Fill({
        color: 'rgba(255, 99, 71, 0.6)',
    }),
    stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.8)',
        width: 2,
    })
})

function MapMoran(props: any) {
    const info = document.getElementById('info');

    const [mapMoran, setMapMoran] = useState<MapOl>();

    const [moranData, setMoranData] = useState();

    const [moranIndex, setMoranIndex] = useState<number>();
    const [pValue, setPvalue] = useState<number>();

    const [zoneAveragePrice, setZoneAveragePrice] = useState<number>();
    const [pValueLocal, setPvalueLocal] = useState<number>();

    let lastFeature: FeatureLike | undefined;

    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        });

        const mapInstance = new MapOl({
            target: "mapMoran",
            layers: [osmLayer],
            view: new View({
                center: fromLonLat(props.bolognaCenter.lon_lat),
                zoom: props.bolognaCenter.zoom,
            }),
        });

        setMapMoran(mapInstance);

        return () => {
            if (mapInstance) {
                mapInstance.setTarget(undefined);
            }
        };
    }, []);

    useEffect(() => {
        if (!mapMoran)
            return;

        mapMoran.on('pointermove', function (evt) {
            if (!info)
                return;

            if (evt.dragging) {
                info.style.visibility = 'hidden';
                lastFeature = undefined;
                return;
            }


            const pixel = mapMoran.getEventPixel(evt.originalEvent);
            displayFeatureInfo(pixel, evt.originalEvent.target);

        });

    }, [mapMoran]);

    const displayFeatureInfo = function (pixel, target) {
        if (!info || !mapMoran)
            return;

        const feature = target.closest('.ol-control')
            ? undefined
            : mapMoran.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            });
        if (feature) {
            info.style.left = pixel[0] + 'px';
            info.style.top = pixel[1] + 'px';

            if (lastFeature != feature) {

                info.style.visibility = 'visible';


                setZoneAveragePrice(feature.get('price'));
                setPvalueLocal(feature.get('local_p_sim'));

            }
        } else {
            info.style.visibility = 'hidden';
        }

        lastFeature = feature;
    };

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
                setMoranIndex(data["Moran's I"])
                setPvalue(data["p-value simulated"])
            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });
    }, []);

    useEffect(() => {
        if (!moranData || mapMoran == undefined)
            return;

        if (mapMoran.getLayers().getLength() > 1)
            return;


        let features: Feature[] = []

        moranData.features.forEach(element => {

            let coordinateBlock = element.geometry.coordinates[0];

            const convertedCoordinates = coordinateBlock.map((coord: Coordinate) => fromLonLat(coord));

            // Crea un poligono
            const polygon = new Polygon([convertedCoordinates]);

            // Crea una feature con il poligono
            const polygonFeature = new Feature(polygon);

            let featureStyle: Style;

            switch (element.properties.value_local_moran) {
                case "LL":
                    featureStyle = LLstyle;
                    break;
                case "LH":
                    featureStyle = LHstyle;
                    break;
                case "HL":
                    featureStyle = HLstyle;
                    break;
                case "HH":
                    featureStyle = HHstyle;
                    break;

                default:
                    featureStyle = props.geofenceNormalStyle;
            }

            let newStyle: Style = featureStyle.clone();

            let zoneNameText: TextOl = new TextOl({
                text: element.properties.name,
                font: 'bold 12px Arial',
                fill: new Fill({
                    color: '#000000'
                }),
                stroke: new Stroke({
                    color: '#ffffff',
                    width: 3
                })
            })

            newStyle.setText(zoneNameText)

            polygonFeature.setStyle(newStyle);

            polygonFeature.set('name', element.properties.name);
            polygonFeature.set('price', element.properties.value);
            polygonFeature.set('local_p_sim', element.properties.value_local_moran_p_sim);


            features.push(polygonFeature)
        });

        let source = new VectorSource({
            features: features
        })

        let laysa = new VectorLayer({
            source: source
        })

        mapMoran?.addLayer(laysa)

    }, [moranData]);

    return (
        <div className="h-full w-full relative">

            <div style={{ height: '100%', width: '100%' }} id="mapMoran" className="map-container">
                <Card id="info" className='flex flex-row justify-around p-2 z-10 absolute pointer-events-none space-x-2'>
                    <div className='text-center'>Prezzo Medio <p className="text-l text-muted-foreground">{zoneAveragePrice} €</p></div>

                    <div className='border' />

                    <div className='text-center'>P simulato <p className="text-l text-muted-foreground">{Math.round(pValueLocal * 1000)/10}%</p></div>
                </Card>
            </div>

            <Card className='absolute bottom-5 right-5 px-4 py-2 flex flex-col space-y-1'>
                <div className='flex flex-row justify-around'>
                    <div className='text-center'>Indice Moran <p className="text-xl text-muted-foreground">{moranIndex?.toFixed(3)}</p></div>

                    <div className='border' />

                    <div className='text-center'>P simulato <p className="text-xl text-muted-foreground">{Math.round(pValue * 1000)/10}%</p></div>
                </div>

                <Separator />

                <div className='flex space-x-8'>
                    <HoverCard>
                        <HoverCardTrigger className='flex flex-row'>LL <div className='ml-2 h-full w-6 rounded bg-[rgb(98,144,195)]'></div></HoverCardTrigger>
                        <HoverCardContent className='text-center'>
                            Zona € <br /> circondata da <br /> Zone €
                        </HoverCardContent>
                    </HoverCard>

                    <HoverCard>
                        <HoverCardTrigger className='flex flex-row'>LH <div className='ml-2 h-full w-6 rounded bg-[rgb(119,186,153)]'></div></HoverCardTrigger>
                        <HoverCardContent className='text-center'>
                            Zona € <br /> circondata da <br /> Zone €€€
                        </HoverCardContent>
                    </HoverCard>

                    <HoverCard>
                        <HoverCardTrigger className='flex flex-row'>HL <div className='ml-2 h-full w-6 rounded bg-[rgb(247,184,1)]'></div></HoverCardTrigger>
                        <HoverCardContent className='text-center'>
                            Zona €€€ <br /> circondata da <br /> Zone €
                        </HoverCardContent>
                    </HoverCard>

                    <HoverCard>
                        <HoverCardTrigger className='flex flex-row'>HH <div className='ml-2 h-full w-6 rounded bg-[rgb(255,99,71)]'></div></HoverCardTrigger>
                        <HoverCardContent className='text-center'>
                            Zona €€€ <br /> circondata da <br /> Zone €€€
                        </HoverCardContent>
                    </HoverCard>
                </div>
            </Card>

        </div>
    )
}

export default MapMoran;
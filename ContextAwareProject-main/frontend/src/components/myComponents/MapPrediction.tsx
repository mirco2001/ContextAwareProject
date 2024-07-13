// import libreria openlayer
import { Feature } from 'ol';
import { Geometry } from "ol/geom"
import { ReactElement, useEffect, useRef, useState } from "react"
import { OSM, XYZ } from "ol/source"
import { Fill, Stroke, Style } from "ol/style"
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import TextOl from 'ol/style/Text.js';
import { Map as MapOl } from 'ol';
import TileLayer from "ol/layer/Tile";
import { Pixel } from 'ol/pixel';
import WKB from 'ol/format/WKB';
import { FeatureLike } from 'ol/Feature';

// import componenti shadecn
import {
    Card
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

// import componenti mui
import { LineChart } from '@mui/x-charts/LineChart';

import { getColor } from "@/lib/utils";
import { attributions, key } from '@/common/keys';

interface predictionData {
    date: string;
    price: number;
}

let yearMin: Map<string, number>, yearMax: Map<string, number>;

function MapPrediction(props: any) {

    // === DICHIARAZIONE DEGLLE VARIABILI STATE ===
    // - per la gestione della mappa e dei suoi layer
    const [tileLayer, setTilelayer] = useState<TileLayer<any>>();    
    const [mapPrediction, setMapPrediction] = useState<MapOl>();
    const OSM_source = useRef(new OSM());
    const aerial_source  = useRef(new XYZ({
        attributions: attributions,
        url: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + key,
        tileSize: 512,
        maxZoom: 20,
    }));

    const [layer, setLayer] = useState<VectorSource<Feature<Geometry>>>();

    // per la recezione dei dati dal back
    const [zonesData, setZonesData] = useState([]);
    const [zonePrediction, setZonePrediction] = useState<Map<string, predictionData[]>>();

    // per conservare i dati sulle predizioni da mostrare
    const [predictionDate, setPredictionDate] = useState<string>();
    const [predictionDates, setPredictionDates] = useState<string[]>();
    const [predictionNumber, setPredictionNumber] = useState<number>(0);
    const [predictionMinMax, setPredictionMinMax] = useState<[number, number]>([0, 0]);

    // per la visualizzazione del pop-up con le info sulle singole zone
    const info = document.getElementById('info');
    let lastFeature: FeatureLike | undefined;
    const [prices, setPrices] = useState<ReactElement<any, any>>();

    // creazione della mappa
    useEffect(() => {
        const tileLayerInstance = new TileLayer({
            preload: Infinity,
            source: getTileProvider(props.tileProvider),
        });

        setTilelayer(tileLayerInstance)

        const mapInstance = new MapOl({
            target: "mapPrediction",
            layers: [tileLayerInstance],
            view: props.mapView,
        });

        setMapPrediction(mapInstance);

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

    // recupero dei dati dal back
    useEffect(() => {
        if (zonePrediction)
            return;

        // recupero i dati delle predizioni
        fetch('http://localhost:4000/predizione', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {

                // converto i dati dai JSON
                let parsedData = JSON.parse(data.result);

                // creo una MAP con
                // - il nome del quartiere 
                // - le predizioni del prezzo nel tempo
                let predictionMap = new Map<string, predictionData[]>();

                // creo delle MAP per registrare ad ogni
                // - "anno"
                // - l'andamento del "prezzo" (minimo e massimo)
                yearMax = new Map<string, number>()
                yearMin = new Map<string, number>()

                // vado ad analizzare tutti i record sull'andamento di tutti i prezzi
                // i record sono organizzati come:
                // - "Luogo" zona della predizione
                // - "Data" data della predizione
                // - "Prezzo previsto" il prezzo che si prevede avere nella zona indicata

                parsedData.forEach(element => {
                    if (element.Data == "2025-01-01")
                        return;

                    // mi segno le singole predizioni
                    // - la "data" della predizione 
                    // - il "prezzo" che viene predetto
                    let prediction: predictionData = { date: element.Data, price: element["Prezzo previsto"] }

                    // constrollo se ho già predizioni per il luogo 
                    if (!predictionMap.has(element.Luogo))
                        predictionMap.set(element.Luogo, [prediction])      // se è la prima volta creo una nuova voce e lo inserisco
                    else
                        predictionMap.get(element.Luogo)?.push(prediction)  // se è già presente aggiungo la predizione 


                    // controllo il prezzo "minimo" e "massimo" per una determinata data
                    if (!yearMin.has(element.Data)) {
                        yearMin.set(element.Data, element["Prezzo previsto"])
                        yearMax.set(element.Data, element["Prezzo previsto"])
                    }

                    // se il prezzo predetto e il minimo o il massimo per una determinata data me lo segno
                    if (yearMax.get(element.Data) < element["Prezzo previsto"])
                        yearMax.set(element.Data, element["Prezzo previsto"])

                    if (yearMin.get(element.Data) > element["Prezzo previsto"])
                        yearMin.set(element.Data, element["Prezzo previsto"])


                });

                // setto tutti i dati che ho parsato
                setZonePrediction(predictionMap);

                yearMin = new Map([...yearMin.entries()].sort())
                yearMax = new Map([...yearMax.entries()].sort())

                setPredictionDates([...yearMax.keys()])
                setPredictionNumber(yearMax.size)
            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });


        // recupero i dati delle zone
        fetch('http://localhost:4000/getZone', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {

                setZonesData(data)

            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });
    }, []);

    useEffect(() => {

        // controlo che:
        // - la mappa sia definita
        // - siano stati recuperati dei dati di predizione
        // - siano state recuperate le zone
        if (!mapPrediction || !zonesData.rows || !zonePrediction)
            return;

        // controllo di non aver già aggiunto dei layer alla mappa
        if (mapPrediction.getLayers().getLength() > 1)
            return;

        // dichiaro la vector source
        let vectorSource = new VectorSource()

        // dichiaro il fromato di traduzione delle geofence
        const format = new WKB();

        // per ogni riga
        zonesData.rows.forEach(element => {

            // prendo la geometria, 
            // creo una feature con essa,
            const feature = format.readFeature(element.wkb_geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            // imposto lo stile della zona sulla base del suo prezzo
            feature.setStyle(normalStyleWithName(element.nomezona, predictionDate));

            // per ogni feature setto
            // - il nome della zona che rappresenta
            feature.set('name', element.nomezona);

            // - le predizioni per i prossimi anni
            let predictions = zonePrediction?.get(getPredictionName(element.nomezona));

            predictions?.forEach((element: predictionData) => {
                feature.set(element.date, element.price);
            });

            // la aggiungo alla "vector source"
            vectorSource.addFeature(feature);
        });

        setLayer(vectorSource);

        // creo un vector layer con la source che ci siamo definiti
        let vectorLayer = new VectorLayer({
            source: vectorSource
        })

        // aggiungo il layer alla mappa
        mapPrediction?.addLayer(vectorLayer);

    }, [zonesData, zonePrediction]);

    // quando il layer con le feature viene caricato imposto i colori
    // alle predizioni del primo anno
    useEffect(() => {
        setPredictionTime(0);
    }, [layer])

    // quando la mappa viene caricato imposto il listener per visualizzare il pop-up
    // con le informazioni sulle feature evidenziate
    useEffect(() => {
        // se la mappa è stata caricata
        if (!mapPrediction)
            return;

        info.style.visibility = 'hidden';

        // a ogni movimento del mouse
        mapPrediction.on('pointermove', function (evt) {
            if (!info)
                return;

            // se è un movimento di trascinamento nascondo il pop-up
            if (evt.dragging) {
                info.style.visibility = 'hidden';
                lastFeature = undefined;
                return;
            }

            // altimenti registo posizione puntatore e lo invio alla funzione per 
            // il popolamento del pop-up
            const pixel = mapPrediction.getEventPixel(evt.originalEvent);
            displayFeatureInfo(pixel, evt.originalEvent.target);

        });

    }, [mapPrediction]);

    // funzione per caricare le informazioni su una feature nel pop-up
    const displayFeatureInfo = function (pixel: Pixel, target) {
        // contollo che mappa e pop-up siano caricati
        if (!info || !mapPrediction)
            return;

        // prendo la feature alla posizione del puntatore
        const feature = target.closest('.ol-control')
            ? undefined
            : mapPrediction.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            });

        // se tale feature è "valida"
        if (feature) {
            // sposto il pop-up nella posizione del mouse
            info.style.left = pixel[0] + 'px';
            info.style.top = pixel[1] + 'px';

            // se sto visualizzando una feature diversa dalla precedente
            if (lastFeature != feature) {

                // rendo il pop-up visibile
                info.style.visibility = 'visible';

                // carico i dati della feautre
                let pData: number[] = []
                let xLabels: string[] = []

                Object.keys(feature.getProperties()).forEach(function (key) {

                    if (key == "name" || key == "geometry")
                        return;


                    pData.push(feature.getProperties()[key])
                    xLabels.push(key.substring(0, key.indexOf("-")))
                });

                // li vado a impostare nel pop-up
                const element =
                    <div className='flex flex-col pt-4 px-4'>
                        <p className="text-center font-medium text-xl leading-none">
                            Prezzo di {feature.get("name")} nel tempo
                        </p>
                        <LineChart
                            className='m-auto'
                            width={350}
                            height={250}
                            margin={{
                                left: 50,
                                right: 30,
                                top: 60,
                                bottom: 60,
                            }}
                            series={[
                                {
                                    data: pData,
                                    color: '#e15759'
                                },
                            ]}
                            xAxis={[{ scaleType: 'point', data: xLabels }]}
                            sx={{
                                // Cambia lo stile delle etichette dell'asse Y sinistro
                                "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                                    strokeWidth: "10",
                                    fill: "#808080", // Grigio
                                },
                                // Cambia lo stile delle etichette dell'asse X inferiore
                                "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                                    strokeWidth: "10",
                                    fill: "#808080", // Grigio
                                },
                                // Stile della linea dell'asse X inferiore
                                "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                                    stroke: "#808080", // Grigio
                                },
                                // Stile della linea dell'asse Y sinistro
                                "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                                    stroke: "#808080", // Grigio
                                },
                            }}
                        />
                    </div>
                    ;



                setPrices(element);
            }
        } else {
            // altimenti nascondo il pop-up
            info.style.visibility = 'hidden';
        }

        // salvo qual'è l'ultima feature che ho visualizzato
        lastFeature = feature;
    };

    // funzione per impostare la visualizzazione della predizione su un anno nello specifico
    function setPredictionTime(i: number) {
        let minYearValue = 0;
        let maxYearValue = 0;
        let predictionDate = "2026-01-01";

        // se sono state recuperate predizioni
        if (predictionNumber > 0) {
            // carico i dati su esse
            minYearValue = [...yearMin.values()][i];
            maxYearValue = [...yearMax.values()][i];
            predictionDate = [...yearMin.keys()][i];
        }

        // imposto lo stile delle feature basandomi sui prezzi
        layer?.getFeatures().forEach(element => {
            element.setStyle(normalStyleWithName(element.get("name"), predictionDate));
        });

        // imposto i valori sulla predizione attuale
        setPredictionMinMax([minYearValue, maxYearValue]);
        setPredictionDate(predictionDate);
    }


    // metodo utilizzato per convertire i nomi 
    // da "dataset zone" ==> "dataset predizioni"
    function getPredictionName(name: string) {
        switch (name) {
            case "Borgo Panigale":
                return "Borgo Panigale";
            case "Barca":
                return "Barca";
            case "Marconi":
            case "Malpighi":
            case "Irnerio":
            case "Galvani":
                return "Centro Storico";
            case "Costa Saragozza":
                return "Costa Saragozza";
            case "Mazzini":
                return "Mazzini Fossolo";
            case "Murri":
                return "Murri";
            case "Bolognina":
                return "Navile-Bolognina";
            case "Corticella":
                return "Navile-Corticella";
            case "Lame":
                return "Navile Lame";
            case "Saffi":
                return "Saffi";
            case "San Donato":
                return "San Donato-Fiera";
            case "Colli":
                return "San Mamolo-Colli";
            case "S. Vitale":
                return "San Vitale-Massarenti";
            // case "S. Vitale":        // la geofence della zona "San Vitale" accorpa "San Vitale-Massarenti" e "Roveri"
            //     return "Roveri";     // per evitare di fare la media e contaminare la predizione torniamo solo i dati su "San Vitale-Massarenti"
            case "S. Ruffillo":
                return "Toscana-San Ruffillo";
            case "S. Viola":
                return "Santa Viola";

            default:
                return "";
        }
    }

    // funzione che restituisce il giusto stile basandosi su:
    // - zona 
    // - data
    // che gli sono stati passati  
    function normalStyleWithName(zoneName: string, date: string | undefined) {
        if (!date || !predictionDates || !zonePrediction)
            return;

        let predYear: number = predictionDates.indexOf(date);

        let yearPrediction = zonePrediction.get(getPredictionName(zoneName))[predYear];

        let value = getColor(yearPrediction?.price, yearMax.get(date), yearMin.get(date));

        let color = "rgba(" + value.r + ", " + value.g + "," + value.b + ", 0.5)";


        let newStyle: Style = new Style({
            fill: new Fill({
                color: color,
            }),
            stroke: new Stroke({
                color: 'rgb(0, 0, 0)',
                width: 2,
            })
        });


        let zoneNameText: TextOl = new TextOl({
            text: zoneName,
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

        return newStyle
    }

    return (
        <div className="h-full w-full relative">

            <div style={{ height: '100%', width: '100%' }}
                id="mapPrediction"
                className="map-container"
                onMouseOut={() => {
                    if (info)
                        info.style.visibility = 'hidden';
                }}>
                <Card id="info" className='flex flex-row justify-around p-2 z-10 absolute pointer-events-none space-x-2'>
                    {prices}
                </Card>
            </div>
            <Card className='absolute bottom-5 right-5 px-4 py-2 flex flex-col space-y-4'>
                <div className='flex items-baseline'>
                    <span className='flex align-baseline'>Data predizione </span>
                    <p className="text-xl text-muted-foreground ml-2">{predictionDate}</p>
                </div>

                <Slider defaultValue={[0]}
                    max={predictionNumber - 1}
                    step={1}
                    onValueChange={
                        (value: number[]) => {
                            setPredictionTime(value[0])
                        }
                    } />
                <Separator />

                <div className='flex flex-row space-x-2 py-2'>
                    <p className='flex flex-row'>{Math.round(predictionMinMax[0])}€</p>
                    <Card className='h-6 w-full bg-gradient-to-r from-[rgb(58,140,46)] via-[rgb(176,176,18)] to-[rgb(184,42,29)]' />
                    <p>{Math.round(predictionMinMax[1])}€</p>
                </div>
            </Card>

        </div>
    )
}

export default MapPrediction;
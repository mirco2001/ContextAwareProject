// import libreria openlayer
import { Feature} from "ol";
import TileLayer from "ol/layer/Tile";
import { transform } from "ol/proj";
import { OSM, XYZ } from "ol/source";
import { Map as MapOl } from 'ol';
import { Coordinate } from "ol/coordinate";
import { moveMapTo } from "@/lib/utils";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Geometry, Point } from "ol/geom";
import { Fill, RegularShape, Stroke, Style } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import Text from 'ol/style/Text.js';
import { Draw, Modify } from "ol/interaction";

// import libreria react
import { useState, useEffect, useRef } from "react";

// import componenti shadecn
import {
    Card
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

// import stili e icone
import { Footprints, Accessibility, Car, Bike } from "lucide-react"
import { attributions, key, openrouteservice_key } from "@/common/keys";

var waitTime = 2 * 1000; // 2 s in millis 
var lastRequestTime: Date | null = null;

function MapDailyPath(props: any) {
    // ==== variabili state globali ====

    // - per la mappa
    const [tileLayer, setTilelayer] = useState<TileLayer<any>>();
    const [mapDailyPath, setMapDailyPath] = useState<MapOl>();

    const OSM_source = useRef(new OSM());
    const aerial_source  = useRef(new XYZ({
        attributions: attributions,
        url: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + key,
        tileSize: 512,
        maxZoom: 20,
    }));

    // - punti tra cui calcolare il percorso
    const [houseCoordinates, setHouseCoordinates] = useState<Coordinate | undefined>(undefined);
    const [event, setEvent] = useState<Event>()
    const [featuresRenumbered, setFeaturesRenumbered] = useState([])

    // - layer per mostrare il percorso
    const [dailyPathLayer, setDailyPathLayer] = useState<VectorLayer<Feature<Geometry>>>();

    // - mezzo di trasporto nel percorso
    const [travelMode, setTravelMode] = useState<string>("foot-walking");

    // - statistiche del percorso
    const [distance, setDistance] = useState<number | undefined>(undefined);
    const [timeMinutes, setTimeMinutes] = useState<number | undefined>(undefined);
    const [timeSeconds, setTimeSeconds] = useState<number | undefined>(undefined);

    // - stile della linea per il percorso trai "punti giornalieri"
    let dailyLinePathStyle = new Style({
        stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.8)',
            width: 6,
            lineDash: [15, 15] //or other combinations
        })
    })

    // - stile base di un "punto giornaliero"
    let dailyPointBaseStyle: Style = new Style({
        image: new RegularShape({
            points: 8,
            radius: 18,
            fill: new Fill({
                color: 'rgba(255,255,255,0.8)',
            }),
            stroke: new Stroke({
                color: 'rgb(0, 0, 0, 0.8)',
                width: 3
            }),
        })
    })

    // metodo per generare lo stile di "punto giornaliero" numerato 
    function createDailyPointStyle(number: number) {
        var style = dailyPointBaseStyle.clone();

        let featureNumber: Text = new Text({
            text: number.toString(),
            font: 'bold 20px Arial',
            fill: new Fill({
                color: 'rgb(0, 0, 0)',
            }),
        })

        style.setText(featureNumber)

        return style;
    }

    // creazione della mappa
    // (attivata all'avvio del componente)
    useEffect(() => {
        const tileLayerInstance = new TileLayer({
            preload: Infinity,
            source: getTileProvider(props.tileProvider),
        });

        setTilelayer(tileLayerInstance)

        const mapInstance = new MapOl({
            target: "mapDailyPath",
            layers: [tileLayerInstance],
            view: props.mapView,
        });

        setMapDailyPath(mapInstance);

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


    // metodo per creare i vari layer della mappa
    // (attivato dopo che la mappa è stata impostata)
    useEffect(() => {
        if (!mapDailyPath || !props.selectedHouse)
            return;

        // estraggio le coordinate della casa selezionata
        let selectedHousePoint = props.selectedHouse.getGeometry().getCoordinates();
        let selectedHouseCoord: Coordinate = transform(selectedHousePoint, 'EPSG:3857', 'EPSG:4326');

        // sposto la mappa verso la casa
        moveMapTo(selectedHouseCoord, 16, mapDailyPath);

        // salvo le coordinate della casa 
        // (posizione iniziale e finale del percorso giornaliero)
        setHouseCoordinates(selectedHouseCoord);

        // ==== CREAZIONE LAYER ====

        // - LAYER casa
        // creo il layer in cui inserire la feature della casa selezionata
        let vectorSourceCasa = new VectorSource();
        vectorSourceCasa.addFeature(props.selectedHouse);

        let vectorLayerCasa = new VectorLayer({
            source: vectorSourceCasa,
        })

        // imposto il layer ad uno z index alto in modo che 
        // si trovi sopra gli altri layer e la casa sia visibile
        vectorLayerCasa.setZIndex(9);


        // - LAYER percorso
        // creo il layer in cui inserire la feature del percorso
        let vectorSourcePath = new VectorSource();
        vectorSourcePath.addFeature(props.selectedHouse);

        let vectorLayerPath = new VectorLayer({
            source: vectorSourcePath,
            style: dailyLinePathStyle
        })


        // - LAYER punti giornalieri
        let vectorLayer = new VectorLayer({
            source: props.dailyPointsSource,
        })


        // aggiungo i layer alla mappa
        mapDailyPath?.addLayer(vectorLayerPath);
        mapDailyPath?.addLayer(vectorLayerCasa);
        mapDailyPath.addLayer(vectorLayer);

        // imposto lo stato del layer "percorso giornaliero"
        setDailyPathLayer(vectorLayerPath);
    }, [mapDailyPath])

    // metodo per l'aggiunta delle interazioni con la mappa
    // (attivato dopo il corretto settaggio di: 
    //    - mappa 
    //    - source dei punti giornalieri)
    useEffect(() => {
        if (!props.dailyPointsSource || !mapDailyPath)
            return;

        // - INTERAZIONE disegno punti
        const draw = new Draw({
            source: props.dailyPointsSource,
            type: "Point",
        });

        draw.on('drawend', function (e) {

            //ATTENZIONE DOPPIA INTERAZIONE
            // console.log("ho disegnato");

            let actualFeatureNumber = props.dailyPointsSource.getFeatures().length + 1;

            e.feature.setStyle(createDailyPointStyle(actualFeatureNumber));
            e.feature.set("name", "Punto Su Mappa")

            props.setDailyPointsSource(props.dailyPointsSource)
        });

        mapDailyPath.addInteraction(draw);


        // - INTERAZIONE spostamento punti
        const modify = new Modify({
            source: props.dailyPointsSource
        });
        mapDailyPath.addInteraction(modify);


        // - INTERAZIONI "automatiche" 
        // -- per attivare "event" quando viene modificata la source (spostamento/cancellazione/aggiunta punti)
        props.dailyPointsSource.on('change', (e: Event) => setEvent(e));

        // -- riordinamento dei punti quando vengono cancellati punti
        props.dailyPointsSource.on('removefeature', () => {
            setFeaturesRenumbered(props.dailyPointsSource.getFeatures())
        });

        return () => {
            mapDailyPath.removeInteraction(draw)
            mapDailyPath.removeInteraction(modify)


            props.dailyPointsSource.un('change', (e: Event) => setEvent(e));
            props.dailyPointsSource.un('removefeature', () => {
                setFeaturesRenumbered(props.dailyPointsSource.getFeatures())
            });
        };
    }, [props.dailyPointsSource, mapDailyPath]);

    // metodo che riordina la numerazione dei punti di interesse
    // (attivato ogni volta che viene impostato "featuresRenumbered" che conterra le feature da "riordinare")
    useEffect(() => {
        featuresRenumbered.forEach((element: Feature, index) => {

            element.setStyle(createDailyPointStyle(index + 1));

        });

    }, [featuresRenumbered])

    // (attivato quando avvengono modifiche su:
    // - "travelMode" modalità spostamento 
    // - "houseCoordinates" coordinate della casa
    // - "event" modifiche sulla source)
    useEffect(() => {
        apiCall();

    }, [travelMode, houseCoordinates, event])

    // funzione per la chiamata all'api per il calcolo del percorso
    function apiCall() {
        if (!props.dailyPointsSource || !houseCoordinates)
            return

        // controllo che l'api non sia stata chiamata troppo recentemente 
        // (per non consumare troppe chiamate, rimuovere per eliminare limite chiamate) 
        if (lastRequestTime) {
            let now = new Date();

            if (now.getTime() - lastRequestTime.getTime() <= waitTime) {
                return;
            }
        }

        lastRequestTime = new Date();

        // creo la chiamata all'api impostando
        // - mezzo di spostamento
        const url = "https://api.openrouteservice.org/v2/directions/" + travelMode + "/geojson";

        const headers = {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            'Content-Type': 'application/json',
            'Authorization': openrouteservice_key
        };

        // - punti che voglio attraversare 
        // estraggo tutte le feature dalla source 
        let coordinates: Coordinate[] = props.dailyPointsSource?.getFeatures().map((feature: Feature<Point>) => {

            // estraggo le coordinate e le converto in un formato comprensibile dall'api
            let coordinate: Coordinate | undefined = feature.getGeometry()?.getCoordinates();

            let lonlat: Coordinate = transform(coordinate ? coordinate : [0, 0], 'EPSG:3857', 'EPSG:4326');

            return lonlat
        })

        // creo una lista di coordinate con la posizione della caso come inizio e fine del percorso
        coordinates = [
            houseCoordinates,
            ...coordinates,
            houseCoordinates
        ]

        const body = JSON.stringify({ coordinates });

        // effettuo la fetch
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        })
            .then(response => {
                return response.json();
            })
            .then(data => {

                // salvo tutti i dati sul percorso
                let travelInfo = data.features[0].properties.summary;

                // lunghezza totale in metri
                setDistance(travelInfo.distance);

                // tempo totale in minuti e secondi
                let minutes = Math.floor(travelInfo.duration / 60);
                let seconds = travelInfo.duration - minutes * 60;

                setTimeMinutes(minutes);
                setTimeSeconds(seconds);

                // il percorso effettivo
                let pathFeature = new GeoJSON().readFeatures(data, {
                    featureProjection: 'EPSG:3857'
                })

                let dailyPathSource = dailyPathLayer?.getSource();

                dailyPathSource?.clear();
                dailyPathSource?.addFeatures(pathFeature)
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }

    return (
        <div className="h-full w-full relative">
            <div style={{ height: '100%', width: '100%' }}
                id="mapDailyPath"
                className="map-container"
            >
            </div>


            <Card className='absolute bottom-5 right-5 p-4 space-y-4'>

                <div className="flex justify-between items-baseline">
                    <span>Durata</span>
                    <span className="text-xl text-muted-foreground">{timeMinutes ? timeMinutes : 0}′ {Math.round(timeSeconds ? timeSeconds : 0)}′′</span>
                </div>

                <Separator />

                <div className="flex justify-between items-baseline">
                    <span>Distanza</span>
                    <div><span className="text-xl text-muted-foreground">{distance ? distance : 0}</span> <span className="text-base text-muted-foreground">m</span></div>
                </div>

                <Separator />

                <span className='flex align-baseline'>Mezzo Locomozione </span>
                <ToggleGroup type="single"
                    variant="outline"
                    defaultValue="foot-walking"
                    onValueChange={
                        (value: string) => {
                            setTravelMode(value);
                        }
                    }
                >
                    <ToggleGroupItem value="wheelchair">
                        <Accessibility className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="foot-walking">
                        <Footprints className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="cycling-regular">
                        <Bike className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="driving-car">
                        <Car className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </Card>
        </div>


    );
}

export default MapDailyPath;
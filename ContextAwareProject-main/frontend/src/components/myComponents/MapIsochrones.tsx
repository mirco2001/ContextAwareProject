// import libreria openlayer
import { Feature, Map as MapOl } from 'ol';
import { Coordinate } from 'ol/coordinate';
import GeoJSON from 'ol/format/GeoJSON';
import { Geometry } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { transform } from 'ol/proj';
import { OSM, XYZ } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { Fill, Icon, RegularShape, Stroke, Style } from 'ol/style';

// import componenti shadecn
import {
    Card
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// import stili e icone
import { Footprints, Accessibility, Car, Bike } from "lucide-react"

// import libreria react
import { useEffect, useRef, useState } from 'react'

// import lib interne di utils e interfacce
import { moveMapTo } from '@/lib/utils';
import { geofenceNormalStyle } from '@/common/geofenceStyles';
import { LayerInfo } from '@/common/interfaces';
import { attributions, key, openrouteservice_key } from '@/common/keys';


function MapIsochrones(props: any) {
    // ==== variabili state globali ====

    // - per la mappa
    const [tileLayer, setTilelayer] = useState<TileLayer<any>>();
    const [mapIsochrones, setMapIsochrones] = useState<MapOl>();

    const OSM_source = useRef(new OSM());
    const aerial_source  = useRef(new XYZ({
        attributions: attributions,
        url: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + key,
        tileSize: 512,
        maxZoom: 20,
    }));

    // - per la geofence dei punti raggiungibili e il suo layer
    const [reachablePlaces, setReachablePlaces] = useState<Feature<Geometry>>()
    const [reachablePlacesLayer, setReachablePlacesLayer] = useState<VectorLayer<Feature<Geometry>>>()

    // per il calcolo della geofence dei punti raggiungibili
    // - modo di spostamento
    // - tempo dello spostamento 
    // - punto di partenza
    const [travelMode, setTravelMode] = useState<string>();
    const [travelTime, setTravelTime] = useState<number>();
    const [houseCoordinates, setHouseCoordinates] = useState<Coordinate>();

    // funzione per la creazione della mappa di base
    // (attivata all'avvio del componente)
    useEffect(() => {
        const tileLayerInstance = new TileLayer({
            preload: Infinity,
            source: getTileProvider(props.tileProvider),
        });

        setTilelayer(tileLayerInstance)

        const mapInstance = new MapOl({
            target: "mapIsochrones",
            layers: [tileLayerInstance],
            view: props.mapView,
        });

        setMapIsochrones(mapInstance);

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

    // funzione che, se è stata selezionata una casa, setta i parametri standar per calcolare 
    // la gofence dei punti raggiungibili e sposta la visuale sulla casa stessa
    // (avviata quando la mappa viene creata)
    useEffect(() => {
        // controllo che la mappa e la casa selezionata siano valide
        if (!mapIsochrones || !props.selectedHouse)
            return;

        // estraggio le coordinate della casa selezionata
        let selectedHousePoint = props.selectedHouse.getGeometry().getCoordinates();
        let selectedHouseCoord: Coordinate = transform(selectedHousePoint, 'EPSG:3857', 'EPSG:4326');

        // sposto la mappa verso la casa
        moveMapTo(selectedHouseCoord, 16, mapIsochrones);

        // setto i parametri standard per il calcolo della geofence dei punti raggiungibili
        setHouseCoordinates(selectedHouseCoord);
        setTravelMode("foot-walking");
        setTravelTime(60 * 5);

        // creo il layer in cui inserire la feature della casa selezionata
        let vectorSource = new VectorSource();
        vectorSource.addFeature(props.selectedHouse);

        let vectorLayer = new VectorLayer({
            source: vectorSource,
        })

        // imposto il layer ad uno z index alto in modo che 
        // si trovi sopra gli altri layer e la casa sia visibile
        vectorLayer.setZIndex(9);

        // aggiungo il layer alla mappa
        mapIsochrones?.addLayer(vectorLayer);

    }, [mapIsochrones])

    // metodo che aggiunge alla mappa tutti i layer dei POI
    // (avviato alla creazione della mappa)
    useEffect(() => {
        // controllo che i layer dei POI e che la mappa siano validi
        if (!props.poiLayers || !mapIsochrones)
            return

        // per ogni gruppo di layer (divisi per categoria)
        props.poiLayers.forEach((layerGroup: LayerInfo[]) => {

            layerGroup.forEach(layer => {
                // - imposto lo z index a 1 in modo che sia sopra ai layer impostati a 0
                //   (come ad esempio quelli delle geofence)
                layer.layer.setZIndex(1)
                // - aggiungo i singoli layer alla mappa
                mapIsochrones.addLayer(layer.layer)
            });

        });

    }, [mapIsochrones])

    // metodo che effettua che richiama l'api per il calcolo della geofence dei punti raggiungibili
    // ( metodo invocato quando vengono modificati:
    //                          * modalità spostamento
    //                          * mezzo spostamento     )
    useEffect(() => {
        // controllo che siano validi 
        // - coordinate della casa
        // - mezzo di spostamento
        // - tempo di spostamento
        if (!houseCoordinates || !travelMode || !travelTime)
            return;

        // chiamo il metodo che gestisce l'API
        apiCall(houseCoordinates, travelMode, travelTime);

    }, [travelMode, travelTime])

    // metodo che gestisce l'API
    function apiCall(startLocation: Coordinate, travelMode: string, maxTravelTime: number) {

        // effettuo la chiamata all'API inserendo i parametri che vengono passati
        fetch('https://api.openrouteservice.org/v2/isochrones/' + travelMode, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                'Authorization': openrouteservice_key,
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                locations: [startLocation],
                range: [maxTravelTime],
                range_type: 'time'
            })
        })
            .then(response => response.json())
            .then(data => {

                // la geofence dei punti raggiungibili e restituita dall'API come geojson
                // per questo vado a convertirla in una feature
                let feature = new GeoJSON().readFeatures(data, {
                    dataProjection: 'EPSG:4326', // La proiezione dei dati
                    featureProjection: 'EPSG:3857' // La proiezione della mappa
                });

                feature[0].setStyle(geofenceNormalStyle);

                // setto tale feature
                setReachablePlaces(feature[0]);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // metodo per nascondere le feature POI che sono fuori dalla geofence dei posti raggiungibili 
    // (viene invocato quando la geofence dei punti raggiungibili viene ricalcolata e impostata)
    useEffect(() => {
        // controllo che la mappa e la geofence dei posti raggiungibili siano valide
        if (!mapIsochrones || !reachablePlaces)
            return;

        // Rimuovi il layer esistente (se presente)
        if (reachablePlacesLayer)
            mapIsochrones?.removeLayer(reachablePlacesLayer);

        // Creo una nuova VectorSource e aggiungo la feature "reachablePlaces"
        let vectorSource = new VectorSource();
        vectorSource.addFeature(reachablePlaces);

        // Creo un nuovo VectorLayer con la VectorSource
        let vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        // Ottiengo la geometria "reachableGeometry" della feature "reachablePlaces"
        let reachableGeometry = reachablePlaces.getGeometry();

        // Definisco uno stile "non visibile"
        let invisibleStyle = new Style({
            fill: new Fill({
                color: 'rgba(0, 0, 0, 0)',
            }),
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0)',
                width: 0,
            })
        });

        // per ogni layer dei diversi gruppi di layer che indicano i POI
        props.poiLayers.forEach((layerGroup: LayerInfo[]) => {
            layerGroup.forEach((layer: LayerInfo) => {

                // - definisco uno stile che rappresenta il POI (basandomi sulle info in "LayerInfo")
                const style = [
                    new Style({
                        image: new RegularShape({
                            points: 64,
                            radius: 14,
                            fill: new Fill({
                                color: layer.layerColor
                            })
                        })
                    }),
                    new Style({
                        image: new Icon({
                            src: layer.layerIcon,
                            scale: 0.7,
                        }),
                    })
                ];

                // - per ogni feature all'interno del layer
                layer.layer.getSource()?.getFeatures().forEach(element => {

                    // -- trovo le coordinate della feature
                    let featureGeometry = element.getGeometry();
                    if(!featureGeometry)
                        return;

                    let featureCoord = featureGeometry.getCoordinates();

                    // -- Verifico se le sue coordinate intersecano reachableGeometry
                    if (!reachableGeometry?.intersectsCoordinate(featureCoord)) {

                        // se si applico lo stile di invisibilità
                        element.setStyle(invisibleStyle);
                    } else {
                        // altrimenti imposto lo stile normale del layer
                        element.setStyle(style);
                    }
                });
            });
        });

        // inserisco il layer della geofence dei posti raggiungibili e setto tale layer in uno state
        mapIsochrones?.addLayer(vectorLayer);
        setReachablePlacesLayer(vectorLayer);

    }, [reachablePlaces])



    return (
        <div className="h-full w-full relative">
            <div style={{ height: '100%', width: '100%' }}
                id="mapIsochrones"
                className="map-container"
            >
            </div>


            <Card className='absolute bottom-5 right-5 p-4 space-y-4'>

                <span className='flex align-baseline'>Durata Spostamento </span>
                <Select
                    defaultValue="5"
                    onValueChange={
                        (value: string) => {
                            setTravelTime(parseInt(value) * 60);
                        }
                    }>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 minuti</SelectItem>
                        <SelectItem value="10">10 minuti</SelectItem>
                        <SelectItem value="15">15 minuti</SelectItem>
                        <SelectItem value="20">20 minuti</SelectItem>
                    </SelectContent>
                </Select>

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
    )
}

export default MapIsochrones;

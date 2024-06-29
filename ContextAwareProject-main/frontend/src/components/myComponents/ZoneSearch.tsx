
// import di openlayer
import WKB from "ol/format/WKB";
import VectorSource from "ol/source/Vector";
import { useState, useEffect } from "react";
import Style from "ol/style/Style";
import Text from 'ol/style/Text.js';
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import { MapBrowserEvent, Feature } from "ol";
import { Interaction, DoubleClickZoom } from "ol/interaction";
import Geometry from "ol/geom/Geometry";

// componenti utilizzati
// - shadcn
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
// - componenti miei
import SelectedZoneList from "./SelectedZoneList";

// stili e icone
import { Trash } from "lucide-react";


function ZoneSearch(props: any) {

    // variabile per mantenere i dati sulle zone
    const [zonesData, setZonesData] = useState([]);
    const [test, setTest] = useState<number>(0);

    // ==== AGGIUNTA DELLE ZONE ALLA MAPPA ====
    // funzione per fare la richiesta sul db
    useEffect(() => {
        // "pesco" i dati sulle zone dal database e li salvo su zonesData 
        fetch("http://localhost:4000/getZone")
            .then(response => response.json())
            .then(data => {
                // se i dati sono stati presi con successo aggiorno lo "stato dei dati sulle zone"
                setZonesData(data)
            })
            .catch(error => {
                // se ci sono stati problemi visualizzo messaggio di errore
                console.error('Errore nella fetch:', error);
            });

    }, []);

    // funzione che crea uno stile per le geofenceche uguale a quello base 
    // ma con scritto il nome della zona sopra
    function normalStyleWithName(zoneName: string) {
        let newStyle: Style = props.geofenceNormalStyle.clone();


        let zoneNameText: Text = new Text({
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

    // funzione che si attiva ogni volta che lo "stato dei dati sulle zone" viene aggiornato
    useEffect(() => {

        // controllo che:
        // - i dati siano validi
        // - sia presente il vector layer
        if (zonesData.rows == undefined || !props.layer)
            return;

        // estraggo la "source" del vector layer 
        // controllo che sia valida
        let vSource: VectorSource = props.layer.getSource();

        if (!vSource)
            return;

        // Creo le feature da inserire nella vector source
        // - definisco conversione dal formato WKB
        const format = new WKB();

        vSource.clear();

        // - per ogni zona che è stata "recuperata"
        zonesData.rows.forEach(element => {

            // prendo la geometria, 
            // creo una feature con essa,
            // la aggiungo alla "vector source"
            const feature = format.readFeature(element.wkb_geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            feature.setStyle(normalStyleWithName(element.nomezona));
            feature.set('name', element.nomezona);

            vSource.addFeature(feature);
        });
    }, [zonesData]);

    // ==== INTERAZIONI CON LA MAPPA ====

    // funzione che si innesca al click su una zona
    var toggleAreaSelection = function (e: MapBrowserEvent<any>) {
        // controlla che la mappa sia valida
        if (!props.map)
            return;

        // per ogni feature che si trova "sotto il click del mouse"
        props.map.forEachFeatureAtPixel(e.pixel, function (f: Feature) {

            // controllo se si trova nella lista delle feature selezionate
            const selIndex = props.featuresInfo.indexOf(f);

            if (selIndex < 0) {
                // se si la rimuovo dalla lista e gli metto lo stile "normale"
                props.featuresInfo.push(f);
                f.setStyle(props.geofenceHlightStyle);
            } else {
                // se no la aggiungo nella lista e gli metto lo stile "selezionato"
                props.featuresInfo.splice(selIndex, 1);
                f.setStyle(normalStyleWithName(f.get('name')));
            }
        });

        // aggiorno lo "stato dei dati sulle zone" (selezionate)
        props.setFeaturesInfo(props.featuresInfo);
        setTest(props.featuresInfo.length);
    }

    // funzione che si attiva alla definizione della mappa
    useEffect(() => {
        // controllo che la mappa sia valida
        if (!props.map)
            return;

        // aggiungo il listener sul click in modo che faccia partire 
        // la funzione di selezione delle zone
        props.map.on('singleclick', toggleAreaSelection);

        // Disabilito "doppio click zoom" per evitare problemi con selezione veloce
        var dblClickInteraction: Interaction = new Interaction();

        // find DoubleClickZoom interaction
        props.map.getInteractions().getArray().forEach(function (interaction) {
            if (interaction instanceof DoubleClickZoom) {
                dblClickInteraction = interaction;
            }
        });
        // remove from map
        props.map.removeInteraction(dblClickInteraction);

    }, [props.map]);

    // funzione che azzera le aree selezionate
    function emptySelectedAreas() {

        // per ogni feature nella lista delle aree selezionate
        // re imposta lo stile "base"
        props.featuresInfo.forEach((feature:Feature<Geometry>) => {
            feature.setStyle(normalStyleWithName(feature.get('name')));
        });
        // svuoto la lista
        props.setFeaturesInfo([])
    }

    return (
        <>
            <p className="m-3 text-center font-medium leading-none">Tocca le zone a cui sei interessato</p>
            <Card className="my-5">
                <CardHeader>
                    <CardTitle>Aree Selezionate</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px]">
                        <SelectedZoneList featuresInfo={props.featuresInfo} />
                    </ScrollArea>
                </CardContent>
            </Card>
            <Button variant="destructive" onClick={emptySelectedAreas}>
                <Trash className="mr-2" /> Svuota
            </Button>

        </>
    );
}

export default ZoneSearch;
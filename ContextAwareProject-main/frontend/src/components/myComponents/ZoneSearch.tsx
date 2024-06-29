import WKB from "ol/format/WKB";
import VectorSource from "ol/source/Vector";
import { useState, useEffect } from "react";
import Style from "ol/style/Style";
import Text from 'ol/style/Text.js';
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"



import SelectedZoneList from "./SelectedZoneList";
import { MapBrowserEvent, Feature } from "ol";
import { FeatureLike } from "ol/Feature";
import { Interaction, DoubleClickZoom } from "ol/interaction";


function ZoneSearch(props: any) {

    // variabile per mantenere i dati sulle zone
    const [zonesData, setZonesData] = useState([]);
    const [test, setTest] = useState<number>(11);

    

    useEffect(() => {
        // "pesco" i dati sulle zone dal database e li salvo su zonesData 
        fetch("http://localhost:4000/getZone")
            .then(response => response.json())
            .then(data => {
                setZonesData(data)
            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });

    }, []);

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

    useEffect(() => {
        if (zonesData.rows == undefined || !props.layer)
            return;

        let vSource: VectorSource = props.layer.getSource();

        if (!vSource)
            return;

        // - definisco conversione dal formato WKB
        const format = new WKB();

        vSource.clear();

        // - per ogni zona che è stata "recuperata"
        zonesData.rows.forEach(element => {

            // prendo la geometria, 
            // creo una feature con essa,
            // la aggiungo alla "vector source"
            const feature = format.readFeature(element.geom, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            feature.setStyle(normalStyleWithName(element.nomezona));
            feature.set('name', element.nomezona);

            vSource.addFeature(feature);
        });

        // - creo un nuovo vector layer con la source che ho creato

    }, [zonesData]);

    var callback = function (e: MapBrowserEvent<any>) {
        if (!props.map)
            return;

        props.map.forEachFeatureAtPixel(e.pixel, function (f: Feature) {

            const selIndex = props.featuresInfo.indexOf(f);

            if (selIndex < 0) {
                props.featuresInfo.push(f);
                f.setStyle(props.geofenceHlightStyle);
                return;
            } else {
                props.featuresInfo.splice(selIndex, 1);
                f.setStyle(normalStyleWithName(f.get('name')));
            }
        });

        props.setFeaturesInfo(props.featuresInfo);
        setTest(22);
    }

    useEffect(() => {
        if (!props.map)
            return;

        props.map.un('singleclick', callback);
        props.map.on('singleclick', callback);

        // Disabilito doppio click per evitare problemi con selezione veloce

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

    return (
        <>
            <p className="m-3 text-center font-medium leading-none">Tocca le zone a cui sei interessato</p>
            <Card>
                <CardHeader>
                    <CardTitle>Aree Selezionate</CardTitle>
                </CardHeader>
                <CardContent>
                    {props.featuresInfo.length}
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </>
    );
}

export default ZoneSearch;
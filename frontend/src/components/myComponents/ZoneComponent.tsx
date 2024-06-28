import { MapBrowserEvent } from "ol";
import { FeatureLike } from "ol/Feature";
import WKB from "ol/format/WKB";
import { Interaction, DoubleClickZoom } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";


function ZoneSearch(props: any) {

    // variabile per mantenere i dati sulle zone
    const [zonesData, setZonesData] = useState([]);
    var selectedZones: FeatureLike[] = [];

    useEffect(() => {
        // "pesco" i dati sulle zone dal database è li salvo su zonesData 
        fetch("http://localhost:4000/getZone")
            .then(response => response.json())
            .then(data => {
                setZonesData(data)
            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });

    }, []);

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

            vSource.addFeature(feature);
        });

        // - creo un nuovo vector layer con la source che ho creato

    }, [zonesData]);

    var callback = function (e: MapBrowserEvent<any>) {
        if (!props.map)
            return;

        props.map.forEachFeatureAtPixel(e.pixel, function (f: any) {


            const selIndex = selectedZones.indexOf(f);


            if (selIndex < 0) {
                selectedZones.push(f);
                f.setStyle(props.geofenceHlightStyle);
                return;
            } else {
                selectedZones.splice(selIndex, 1);
                f.setStyle(undefined);
            }
        });

        console.log(selectedZones);
        props.setFeaturesInfo(selectedZones)
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



    function CreateZoneList() {
        if (!zonesData.rows)
            return <>Non selezionati</>

        return (
            selectedZones.map((nomezona, index) =>
                <div className=" flex items-center space-x-4 rounded-md border p-4">
                    {nomezona}
                </div>
            )
        )
    }

    return (
        <>
            <p className="m-3 text-center font-medium leading-none">Tocca le zone a cui sei interessato</p>
            <Card>
                <CardHeader>
                    <CardTitle>Aree Selezionate</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* {CreateZoneList()} */}
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </>
    );
}

export default ZoneSearch;
// import libreria openlayer
import Feature, { FeatureLike } from "ol/Feature";
import Text from 'ol/style/Text.js';
import { Fill, RegularShape, Stroke, Style } from "ol/style";

// import libreria react
import { useEffect, useState } from "react";

// import componenti shadecn
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"


// import stili e icone
import { Trash2, ChevronUp, ChevronDown, Building2, MapPin, EllipsisVertical } from "lucide-react"
import { Coordinate } from "ol/coordinate";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";


function ControlsDailyPath(props: any) {
    // ==== variabili state globali ====

    const [features, setFeatures] = useState<Feature[]>();

    const [featuresRenumbered, setFeaturesRenumbered] = useState<Feature[]>([])


    // - lista degli indirizzi (geocodificati) corrispondenti alla ricerca
    const [retrivenAddresses, setAddresses] = useState();

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

    // metodo per connettere l'evento di modifica della source (spostamento/cancellazione/aggiunta punti)
    // allo state che contiene la lista di esse così da mostrarle a schermo attraverso la funzione "handleFeatureChange"
    // (funzione attivata quando la dailyPointsSource viene settata)
    useEffect(() => {
        // riempo inizialmente la lista dei punti
        handleFeatureChange();

        props.dailyPointsSource.on('change', handleFeatureChange);

        return () => {
            props.dailyPointsSource.un('change', handleFeatureChange);
        }
    }, [props.dailyPointsSource])

    // ogni volta che il metodo viene chiamato lo stato di "FetureChanged" viene settato alla lista di feature
    // attualmente presenti in "props.dailyPointsSource"
    function handleFeatureChange() {
        setFeatures(props.dailyPointsSource.getFeatures())
    }

    // metodo che partendo da una lista di feature crea una lista di elementi in teragibili per
    // - modificare ordine feature
    // - cancellare feature
    // - visualizzare origine feature 
    function createList(features: Feature[] | undefined) {
        return features?.map((feature, index: number) =>

            <ContextMenu key={index}>
                <ContextMenuTrigger>
                    <Card
                        className="px-4 py-2 my-2 flex justify-between"
                    >

                        <div className="flex w-full justify-between content-center">
                            <MapPin className="mr-2" />
                            <span className="flex flex-row">
                                {feature.get("name")}
                            </span>

                            <div className="flex flex-row">
                                <span className="text-xl text-muted-foreground mr-2">
                                    {index + 1}
                                </span>
                                <EllipsisVertical className="m-auto" />
                            </div>
                        </div>


                    </Card>
                </ContextMenuTrigger>
                <ContextMenuContent>

                    <ContextMenuItem
                        onClick={() => moveFeature(feature, false)}
                        className="justify-between"
                    >
                        <span>Porta Su</span>
                        <ChevronUp className="h-4 w-4" />
                    </ContextMenuItem>
                    <ContextMenuItem
                        className="justify-between"
                        onClick={() => moveFeature(feature, true)}>
                        <span>Porta Giù</span>
                        <ChevronDown className="h-4 w-4" />
                    </ContextMenuItem>
                    <ContextMenuItem
                        className="justify-between bg-[#7F1D1D]"
                        onClick={() => removeFeature(feature)}>
                        <span>Rimuovi</span>
                        <Trash2 className="h-4 w-4" />
                    </ContextMenuItem>
                    
                </ContextMenuContent>
            </ContextMenu >
        );

    }

    // metodo attivato quando "featuresRenumbered" viene impostato va a settare lo stile delle feature in modo che 
    // risultino avere un'andamento crescente
    useEffect(() => {
        featuresRenumbered.forEach((element: Feature, index) => {

            element.setStyle(createDailyPointStyle(index + 1));

        });

    }, [featuresRenumbered])

    // metodo che svuota la lista delle feature inserite
    function clearAllFeature() {
        props.dailyPointsSource.clear();
        handleFeatureChange();
    }

    // metodo che rimuove una feaure specifica
    function removeFeature(feature: FeatureLike) {
        props.dailyPointsSource.removeFeature(feature);
    }

    // metodo che sposta la feature "feature" più in alto o in basso nella lista delle feature
    // - (true) in giù
    // - (false) in sù
    function moveFeature(feature: Feature, direction: boolean) {
        // copio la lista delle feature e mi salvo la posizione della feature che voglio spostare
        let features: Feature[] = props.dailyPointsSource.getFeatures();
        let featurePosition = features.indexOf(feature);

        // se la feature non è presente nella lista 
        if (featurePosition <= -1)
            return;

        // se la voglio spostare in una posizione non consentita data la direzione
        if (featurePosition >= features.length - 1 && direction)
            return;
        if (featurePosition < 0 && !direction)
            return;
        // ritorno

        // prelevo la feature dalla lista
        let removedElement = features.splice(featurePosition, 1)[0];

        // la inserisco nella nuova posizione
        direction
            ? features.splice(featurePosition + 1, 0, removedElement)
            : features.splice(featurePosition - 1, 0, removedElement)

        // re imposto la lista nella sorgente
        props.dailyPointsSource.clear();
        setFeaturesRenumbered(features);
        props.dailyPointsSource.addFeatures(features)
    }

    // ==== GEOCODING INDIRIZZO RICERCATO ====
    // funzione per effettuare la richiesta all'api per il geocoding
    function geocodingApiRequest(address: string) {
        // controllo che sia stato specificato un indirizzo
        if (address == "")
            return;

        // creo ed effettuo la richiesta
        var requestOptions = {
            method: 'GET',
        };

        fetch("https://api.geoapify.com/v1/geocode/autocomplete?text=" + address + "&apiKey=af9bd9269d274a5dabcf4bfef2f875e3", requestOptions)
            .then(response => response.json())
            .then(
                // se la richiesta va a buon aggiorno lo "stato" degli indirizzi trovati
                result => setAddresses(result)
            )
            .catch(error => console.log('error', error));
    }

    // funzione per creare interfaccia con tutti gli indirizzi "pescati" dalla richiesta
    function generateSuggestions(addresses: any) {
        // controllo che gli indirizzi siano validi
        if (addresses == null)
            return;

        // controllo che ci siano stati dei risultati
        if (addresses.features.length <= 0)
            return;

        // per ogni indirizzo ritrovato genero un "item"
        return addresses.features.map((addres, index: number) =>
                <CommandItem key={"address" + index}>
                    <div className="w-full flex justify-start flex-row content-center"
                        onClick={() => {

                            let addressLonLat: Coordinate = [addres.properties.lon, addres.properties.lat];

                            var oFeature = new Feature({
                                geometry: new Point(
                                    fromLonLat(addressLonLat)
                                )
                            });

                            let actualFeatureNumber = props.dailyPointsSource.getFeatures().length + 1;

                            oFeature.setStyle(createDailyPointStyle(actualFeatureNumber));
                            oFeature.set("name", addres.properties.address_line1)
                            props.dailyPointsSource.addFeature(oFeature);
                        }}>
                        <Building2 className="my-auto mr-2" />
                        <div>
                            <p> {addres.properties.address_line1} </p>
                            <p className="text-sm text-muted-foreground"> {addres.properties.address_line2} </p>
                        </div>
                    </div>
                </CommandItem>
        )
    }



    return (
        <div className="justify-between flex flex-col h-full">

            <div className="flex flex-col flex-none">
                <p className="m-3 text-center font-medium leading-none">Inserisci l'indirizzo a cui sei interessato</p>
                <div className="rounded-lg border mb-8">
                    <Command shouldFilter={false}>
                        <CommandInput placeholder="Indirizzo..." onInput={(e) =>
                            geocodingApiRequest(e.currentTarget.value)
                        } />
                        <Separator className="" />
                        <CommandList>
                            <ScrollArea className="h-[120px] p-2 3xl:h-[250px]">
                                <CommandEmpty>Nessun risultato trovato.</CommandEmpty>
                                <CommandGroup heading="Suggestions">
                                    {generateSuggestions(retrivenAddresses)}
                                </CommandGroup>
                            </ScrollArea>
                        </CommandList>
                    </Command>
                </div>
            </div>

            <Card className="flex flex-col flex-1 p-4 mb-6 justify-between">

                <div className="flex flex-none flex-col">
                    <CardTitle>Punti Giornalieri</CardTitle>
                    <CardDescription>Le posizioni che visiti tutti i giorni</CardDescription>
                </div>


                <ScrollArea
                    className="flex h-[34vh]">
                    {createList(features)}
                </ScrollArea>

                <Button
                    variant="destructive"
                    onClick={clearAllFeature}>

                    Resetta Punti
                </Button>

            </Card>
        </div>
    );
}
export default ControlsDailyPath;
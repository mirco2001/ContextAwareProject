// import libreria openlayer
import { useEffect, useState } from "react";
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorSource from "ol/source/Vector";
import { Coordinate } from "ol/coordinate";
import { Circle, Point } from "ol/geom";

// import componenti shadecn
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// icone e stili
import { Building2 } from "lucide-react";
import { moveMapTo } from "@/lib/utils";

function AddressSearch(props: any) {
    // dimensione standard del raggio di ricerca
    const defoultRadius: number = 500;

    // variabili di stato per mantenere
    // - lista degli indirizzi (geocodificati) corrispondenti alla ricerca
    const [retrivenAddresses, setAddresses] = useState();
    // - posizione lon_lat dell'indirizzo scelto
    const [chosenAddress, setChosenAddress] = useState<Coordinate>();
    // - dimensione del raggio di ricerca attuale
    const [searchRadius, setSearchRadius] = useState<number>(defoultRadius);

    // ==== DISEGNO DELL'AREA DI RICERCA ====
    // funzione che si attiva ogni volta che vengono aggiornati:
    // - punto di ricerca
    // - raggio di ricerca
    useEffect(() => {
        // controllo che il layer sia valido
        if (!props.layer)
            return;

        // estraggo la "sorgente" del layer e controllo che sia valida
        let vSource: VectorSource = props.layer.getSource();

        if (!vSource)
            return;

        // controllo che effettivamente i dati di ricerca siano presenti
        if (!chosenAddress || !searchRadius)
            return

        // definisco il cerchio di ricerca
        const geofence = new Feature({
            geometry: new Circle(fromLonLat(chosenAddress), searchRadius),
        });

        // nel centrodell'are di ricerca posiziono un'icon come marker (un punto)
        const center = new Feature({
            geometry: new Point(fromLonLat(chosenAddress)),
        });

        // pulisco eventuali geofence precedenti e inserisco le nuove
        vSource.clear();
        vSource.addFeature(geofence);
        vSource.addFeature(center);

    }, [chosenAddress, searchRadius]);

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
                        setChosenAddress(addressLonLat)
                        moveMapTo(addressLonLat, 14, props.map)
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
        <>
            <p className="m-3 text-center font-medium leading-none">Inserisci l'indirizzo a cui sei interessato</p>
            <div className="rounded-lg border mb-8">
                <Command className="h-10">
                    <CommandInput placeholder="Indirizzo..." onInput={(e) =>
                        geocodingApiRequest(e.currentTarget.value)
                    } />
                    <CommandList></CommandList>
                </Command>
                <Separator className="" />
                <Command>
                    <CommandList>
                        <ScrollArea className="h-[300px] p-2">
                            <CommandEmpty>Nessun risultato trovato.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                {generateSuggestions(retrivenAddresses)}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            </div>

            <p className="m-3 text-center font-medium leading-none">Sei interessato fino a {searchRadius} m da lì</p>
            <Slider defaultValue={[defoultRadius]} max={5000} step={3}
                onValueChange={(r) => { setSearchRadius(r[0]) }}
            />
        </>

    );
}

export default AddressSearch;
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



import { Building2 } from "lucide-react";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";

// - ricerca tramite indirizzo
function AddressSearch(props: any) {
    const defoultRadius: number = 500;

    const [retrivenAddresses, setAddresses] = useState();
    const [chosenAddress, setChosenAddress] = useState<Coordinate>();
    const [searchRadius, setSearchRadius] = useState<number>(defoultRadius);

    useEffect(() => {

        if (!props.layer)
            return;

        let vSource: VectorSource = props.layer.getSource();

        if (!vSource)
            return;

        if (!chosenAddress || !searchRadius)
            return

        const circle = new Circle(fromLonLat(chosenAddress), searchRadius);

        const iconStyle = new Style({
            image: new Icon({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '@/assets/piantinabologna.jpg',
            }),
        });

        const center = new Feature({
            geometry: new Point(fromLonLat(chosenAddress)),
            style: iconStyle
        });


        const feature = new Feature(circle);

        vSource.clear();
        vSource.addFeature(feature);
        vSource.addFeature(center);

    }, [chosenAddress, searchRadius]);

    function geocodingApiRequest(address: string) {
        if (address == "")
            return;

        var requestOptions = {
            method: 'GET',
        };

        fetch("https://api.geoapify.com/v1/geocode/autocomplete?text=" + address + "&apiKey=af9bd9269d274a5dabcf4bfef2f875e3", requestOptions)
            .then(response => response.json())
            .then(result => setAddresses(result))
            .catch(error => console.log('error', error));
    }

    function generateSuggestions(addresses: any) {
        if (addresses == null)
            return;

        if (addresses.features.length <= 0)
            return;

        return addresses.features.map((addres, index: number) =>
            <CommandItem key={"address" + index}>
                <div className="w-full flex justify-start flex-row content-center"
                    onClick={() => {

                        let addressLonLat: Coordinate = [addres.properties.lon, addres.properties.lat];
                        setChosenAddress(addressLonLat)
                        props.moveMapTo(addressLonLat, 14)
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
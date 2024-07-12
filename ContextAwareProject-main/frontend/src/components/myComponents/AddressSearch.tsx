import { useEffect, useState } from "react";
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorSource from "ol/source/Vector";
import { Coordinate } from "ol/coordinate";
import { Circle, Point } from 'ol/geom';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { Building2 } from "lucide-react";
import { moveMapTo } from "@/lib/utils";

function AddressSearch(props: any) {
    const defaultRadius = 500;
    const [retrivenAddresses, setAddresses] = useState(null);
    const [chosenAddress, setChosenAddress] = useState<Coordinate | null>(null);
    const [searchRadius, setSearchRadius] = useState<number>(defaultRadius);

    useEffect(() => {
        if (!props.layer) return;

        const vSource: VectorSource = props.layer.getSource();
        if (!vSource) return;

        if (!chosenAddress || !searchRadius) return;

        const geofence = new Feature({
            geometry: new Circle(fromLonLat(chosenAddress), searchRadius),
        });

        const center = new Feature({
            geometry: new Point(fromLonLat(chosenAddress)),
        });

        vSource.clear();
        vSource.addFeature(geofence);
        vSource.addFeature(center);

    }, [chosenAddress, searchRadius, props.layer]);

    function geocodingApiRequest(address: string) {
        if (address === "") return;

        fetch("https://api.geoapify.com/v1/geocode/autocomplete?text=" + address + "&apiKey=af9bd9269d274a5dabcf4bfef2f875e3")
            .then(response => response.json())
            .then(result => setAddresses(result))
            .catch(error => console.log('error', error));
    }

    function generateSuggestions(addresses: any) {
        if (!addresses) return null;

        if (addresses.features.length <= 0) return null;

        return addresses.features.map((address, index: number) => (
            <CommandItem
                className="pointer-events: auto"
                key={"address" + index}
                onClick={() => {
                    let addressLonLat: Coordinate = [address.properties.lon, address.properties.lat];
                    setChosenAddress(addressLonLat);
                    moveMapTo(addressLonLat, 14, props.map);
                }}
                style={{ cursor: "pointer" }}
            >
                <div className="w-full flex justify-start flex-row content-center">
                    <Building2 className="my-auto mr-2" />
                    <div>
                        <p> {address.properties.address_line1} </p>
                        <p className="text-sm text-muted-foreground"> {address.properties.address_line2} </p>
                    </div>
                </div>
            </CommandItem>
        ));
    }

    return (
        <>
            <p className="m-3 text-center font-medium leading-none">Inserisci l'indirizzo a cui sei interessato</p>
            <div className="rounded-lg border mb-8">
                <Command shouldFilter={false}>
                    <CommandInput placeholder="Indirizzo..." onInput={(e) => geocodingApiRequest(e.currentTarget.value)} />
                    <Separator className="" />
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
            <Slider defaultValue={[defaultRadius]} max={5000} step={3} onValueChange={(r) => setSearchRadius(r[0])} />
        </>
    );
}

export default AddressSearch;

// import libreria openlayer
import { useEffect, useState } from "react";
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
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


import { Building2 } from "lucide-react";

import VectorSource from "ol/source/Vector";
import { Coordinate } from "ol/coordinate";
import { Circle } from "ol/geom";


// ==== nel caso ====

// // Funzione per creare un poligono circolare
// function createCircularPolygon(center, radius, numPoints) {
//     var coords = [];
//     for (var i = 0; i < numPoints; ++i) {
//         var angle = (i * 2 * Math.PI) / numPoints;
//         var x = center[0] + radius * Math.cos(angle);
//         var y = center[1] + radius * Math.sin(angle);
//         coords.push([x, y]);
//     }
//     // Chiude il poligono
//     coords.push(coords[0]);

//     // Crea un ol.geom.Polygon
//     return new ol.geom.Polygon([coords]);
// }

// // Esempio di utilizzo
// var center = [0, 0]; // Coordinate del centro del cerchio
// var radius = 1000000; // Raggio del cerchio in metri (o altre unità di mappa)
// var numPoints = 64; // Numero di punti per approssimare il cerchio

// var circularPolygon = createCircularPolygon(center, radius, numPoints);

// console.log(circularPolygon);
// ==== nel caso ====

// - ricerca tramite indirizzo
function AddressSearch(props: any) {
    const defoultRadius:number = 500;

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

        const point = new Circle(fromLonLat(chosenAddress), searchRadius);

        const feature = new Feature(point);

        vSource.clear();
        vSource.addFeature(feature);

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

        // console.log(addresses.features);

        return addresses.features.map((addres, index) =>
            <CommandItem key={"address" + index}>
                <div className="w-full flex justify-start flex-row content-center"
                    onClick={() => {

                        let addressLonLat: Coordinate = [addres.properties.lon, addres.properties.lat];
                        setChosenAddress(addressLonLat)
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
            <div className="">
                <Command className="h-10">
                    <CommandInput id="test" placeholder="Type a command or search..." onInput={(e) =>
                        geocodingApiRequest(e.currentTarget.value)
                    } />
                    <CommandList></CommandList>
                </Command>

                <Command>
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            {generateSuggestions(retrivenAddresses)}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </div>

            <Slider defaultValue={[defoultRadius]} max={5000} step={3}
                onValueChange={(r) => { setSearchRadius(r[0]) }}
            />
        </>

    );
}

export default AddressSearch;
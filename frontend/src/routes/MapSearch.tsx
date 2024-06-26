// import libreria openlayer
import { OSM } from "ol/source";
import { useEffect, useState } from "react";
import { Feature, Map, View } from 'ol';
import { fromLonLat, transform } from 'ol/proj';
import Point from 'ol/geom/Point';
import GeoJSON from 'ol/format/GeoJSON.js';
import WKB from 'ol/format/WKB.js';

// import componenti shadecn
import { Button } from "@/components/ui/button"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Slider } from "@/components/ui/slider"



import { LocateFixed, Heart, Pencil, Eraser, PencilRuler, Building2 } from "lucide-react";

import VectorSource from "ol/source/Vector";
import { Draw, Modify, Snap, Select } from 'ol/interaction.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { pointerMove } from 'ol/events/condition.js';
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";

// import componenti react
import { Link } from "react-router-dom";
import { Circle, Geometry, SimpleGeometry } from "ol/geom";
import { Coordinate } from "ol/coordinate";

import UserProfile from '../UserProfile.ts'


function MapSearch(props: any) {

    // ======== VARIABILI GLOBALI ========
    // - mappa in ol    
    var map: Map;
    // - vectorLayer per la visualizzazione delle zone di ricerca
    const source = new VectorSource({ wrapX: false });
    const vector = new VectorLayer({
        source: source,
        style: {
            'fill-color': 'rgba(99, 179, 237, 0.6)',
            'stroke-color': '#2F4F4F',
            'stroke-width': 2,

            'circle-radius': 7,
            'circle-fill-color': '#ffcc33',
        },
    });
    // - stile geofence selezionate
    const selected = new Style({
        fill: new Fill({
            color: 'rgba(255, 99, 71, 0.6)',
        }),
        stroke: new Stroke({
            color: 'rgba(255, 99, 71, 0.8)',
            width: 2,
        }),
    });
    // - coordinate centro bologna
    const bolognaCenter = {
        lon_lat: fromLonLat([11.3394883, 44.4938134]),
        zoom: 14
    }
    // ===================================

    // creazione della mappa
    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        });

        map = new Map({
            target: "map",
            layers: [osmLayer, vector],
            view: new View({
                center: bolognaCenter.lon_lat,
                zoom: bolognaCenter.zoom,
            }),
        });

        return () => map.setTarget(undefined)
    }, []);

    // funzioni movimento sulla mappa
    function centerBologna() {
        let point = new Point(bolognaCenter.lon_lat);

        map.getView().fit(point, {
            padding: [100, 100, 100, 100],
            maxZoom: bolognaCenter.zoom,
            duration: 1000
        });
    }

    // funzione invio dei dati
    function searcFromInfo() {
        var features = source.getFeatures()
        var geometries: Array<any> = [];

        features.forEach(feature => {
            var featGeometry = feature.getGeometry()

            if (featGeometry == undefined)
                return;

            if (featGeometry instanceof SimpleGeometry)
                geometries.push(featGeometry.getCoordinates());
        });

        console.log(UserProfile.getServicesPreference(), geometries);
    }

    function switchSearch() {
        switch (props.searchType) {
            case "zone":
                return zoneSearch();
            case "draw":
                return geofenceSearch();
            case "address":
                return addressSearch();
        }

        return (<></>);
    }

    

    // metodi di ricerca
    // - ricerca tramite zona
    function zoneSearch() {
        const fetchData = async () => {
            const res = await fetch("http://localhost:4000/getZone");
            const data = await res.json();

            const format = new WKB();
            
            var dataTest = data.rows[0];

            const feature = format.readFeature(dataTest, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
        
            source.addFeature(feature);
            
            console.log(dataTest);
        };

        fetchData();



        return 1;
    }


    // - ricerca tramite geofence
    function geofenceSearch() {
        // ===== EVENTI MODIFICA GEOGENCE =====
        // - disegno di una geofence
        var draw = new Draw({
            source: source,
            type: "Polygon",
        });
        // - modifica di geofence esistenti
        var modify = new Modify({
            source: source
        });
        // - "snap" (avvicinamento) della posizione del mouse 
        //   alla più vicina geofence esistente
        var snap = new Snap({
            source: source
        });
        // - cancellazione della geofence selezionata dal mouse
        var deleteOnClick = new Select();
        deleteOnClick.on('select', function (e) {
            let selectedFeature = e.selected[0];

            if (selectedFeature) {
                source.removeFeature(selectedFeature);
            }
        });
        // - evento hover di una geofence nella modalità cancella
        const selectPointerMove = new Select({
            condition: pointerMove,
            style: selected,
        });


        function changeInteraction(interaction: string) {
            map.removeInteraction(draw);
            map.removeInteraction(modify);
            map.removeInteraction(snap);
            map.removeInteraction(deleteOnClick);
            map.removeInteraction(selectPointerMove);

            switch (interaction) {
                case "draw":
                    map.addInteraction(draw);
                    map.addInteraction(snap);
                    break;
                case "modify":
                    map.addInteraction(modify);
                    map.addInteraction(snap);
                    break;
                case "delete":
                    map.addInteraction(deleteOnClick);
                    map.addInteraction(selectPointerMove);
                    break;
            }
        }

        return (
            <div>
                <p className="m-3 text-center font-medium leading-none">Traccia la forma dell'area che ti interessa</p>
                <HoverCard>
                    <HoverCardTrigger>
                        <Tabs className="mx-3">
                            <TabsList className="flex h-50">
                                <TabsTrigger className="flex-1" value="draw" onClick={() => changeInteraction("draw")}><Pencil className="h-5 w-5" /></TabsTrigger>
                                <TabsTrigger className="flex-1" value="modify" onClick={() => changeInteraction("modify")}><PencilRuler className="h-5 w-5" /></TabsTrigger>
                                <TabsTrigger className="flex-1" value="delete" onClick={() => changeInteraction("delete")}><Eraser className="h-5 w-5" /></TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </HoverCardTrigger>
                    <HoverCardContent>
                        <p>Teieni premuto SHIFT per tracciare liberamente</p>
                    </HoverCardContent>
                </HoverCard>
            </div>
        );
    }



    // - ricerca tramite indirizzo
    function addressSearch() {

        const [latitudine, setLatitudine] = useState<number>(0)
        const [longitudine, setLongitudine] = useState<number>(0)
        const addPoint = () => {
            const point = new Point(fromLonLat([longitudine, latitudine])); // Cambia le coordinate secondo necessità
            const feature = new Feature(point);

            source.clear();
            source.addFeature(feature);
        };


        const [retrivenAddresses, setAddresses] = useState();

        var raggio: number;
        var coordinate: Coordinate;






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

        console.log("render");


        function generateSuggestions(addresses: any) {
            if (addresses == null)
                return;

            if (addresses.features.length <= 0)
                return;

            console.log(addresses.features);

            return addresses.features.map((addres, index) =>

                <CommandItem key={"address" + index}>
                    <div className="flex flex-row content-center"
                        onClick={() => {
                            setLatitudine(addres.properties.lat)
                            setLongitudine(addres.properties.lon)
                            addPoint();
                        }}>
                        <Building2 className="m-auto mr-2" />
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

                <Slider defaultValue={[500]} max={2000} step={3}
                    onValueChange={(r) => { }}
                />
            </>

        );
    }

    return (

        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
                <div style={{ height: '100%', width: '100%' }} id="map" className="map-container" />
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-5 left-5 z-10"
                    onClick={centerBologna}>
                    <LocateFixed className="h-4 w-4" />
                </Button>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel minSize={12} maxSize={25} className="flex flex-col justify-between">
                {switchSearch()}
                <div className="flex flex-row mx-3 my-6 h-[8%]">

                    <Link to='../form'>
                        <Button variant="secondary" className="mr-4 h-full"><Heart /></Button>
                    </Link>

                    <Button className="h-full flex-1" onClick={() => searcFromInfo()}>Cerca</Button>
                </div>
            </ResizablePanel>

        </ResizablePanelGroup>
    )
}

export default MapSearch;
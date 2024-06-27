// import libreria openlayer
import { OSM } from "ol/source";
import { useEffect, useState } from "react";
import { Feature, Map, MapBrowserEvent, View } from 'ol';
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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"




import { LocateFixed, Heart, Pencil, Eraser, PencilRuler, Building2 } from "lucide-react";

import VectorSource from "ol/source/Vector";
import { Draw, Modify, Snap, Select, DoubleClickZoom, Interaction } from 'ol/interaction.js';
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
import { FeatureLike } from "ol/Feature";


function MapSearch(props: any) {

    const [map, setMap] = useState<Map>();
    const [layer, setLayer] = useState<VectorLayer<Feature<Geometry>>>();


    // ======== VARIABILI GLOBALI ========
    // - mappa in ol  

    // - stile geofence selezionate
    const geofenceDeleteStyle = new Style({
        fill: new Fill({
            color: 'rgba(255, 99, 71, 0.6)',
        }),
        stroke: new Stroke({
            color: 'rgba(255, 99, 71, 0.8)',
            width: 2,
        }),
    });

    const geofenceNormalStyle = new Style({
        fill: new Fill({
            color: 'rgba(99, 179, 237, 0.6)',
        }),
        stroke: new Stroke({
            color: '#2F4F4F',
            width: 3,
        }),
    });

    const geofenceHlightStyle = new Style({
        fill: new Fill({
            color: '#EEE',
        }),
        stroke: new Stroke({
            color: '#3399CC',
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

        const mapInstance = new Map({
            target: "map",
            layers: [osmLayer],
            view: new View({
                center: bolognaCenter.lon_lat,
                zoom: bolognaCenter.zoom,
            }),
        });

        setMap(mapInstance);

        return () => {
            if (mapInstance)
                mapInstance.setTarget(undefined);
        }
    }, []);


    // funzioni movimento sulla mappa
    function centerBologna() {
        if (!map)
            return;

        let point = new Point(bolognaCenter.lon_lat);

        map.getView().fit(point, {
            padding: [100, 100, 100, 100],
            maxZoom: bolognaCenter.zoom,
            duration: 1000
        });
    }

    var getSelectedFeatures: any = undefined;

    // funzione invio dei dati
    function searcFromInfo() {
        var features = getSelectedFeatures()

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

    useEffect(() => {
        // se la mappa non è definita o non sono stati recuperati i dati sulle zone
        // non effettuo operazioni
        if (!map)
            return;

        // se un nuovo layer È STATO definito lo aggiungo alla mappa
        if (layer) {

            map.removeLayer(layer);
            map.addLayer(layer);
            return;
        }
    }, [map, layer]);



    // metodi di ricerca
    // - ricerca tramite zona
    function zoneSearch() {

        // variabile per mantenere i dati sulle zone
        const [zonesData, setZonesData] = useState([]);
        var selectedZones: FeatureLike[] = [];

        getSelectedFeatures = () => {
            return selectedZones;
        }

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
            // se la mappa non è definita o non sono stati recuperati i dati sulle zone
            // non effettuo operazioni
            if (zonesData.rows == undefined || layer)
                return;

            // se un layer NON È STATO definito

            // - creo una nuova "vector source"
            const vectorSource = new VectorSource();

            // - definisco conversione dal formato WKB
            const format = new WKB();

            // - per ogni zona che è stata "recuperata"
            zonesData.rows.forEach(element => {

                // prendo la geometria, 
                // creo una feature con essa,
                // la aggiungo alla "vector source"
                const feature = format.readFeature(element.geom, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });

                vectorSource.addFeature(feature);
            });

            // - creo un nuovo vector layer con la source che ho creato
            const newLayer = new VectorLayer({
                source: vectorSource,
                // stile delle feature (geometrie delle zone)
                style: geofenceNormalStyle
            })

            // - lo imposto come layer attuale
            setLayer(newLayer);


        }, [zonesData, layer]);

        var callback = function (e: MapBrowserEvent<any>) {
            if (!map)
                return;

            map.forEachFeatureAtPixel(e.pixel, function (f) {


                const selIndex = selectedZones.indexOf(f);


                if (selIndex < 0) {
                    selectedZones.push(f);
                    f.setStyle(geofenceHlightStyle);
                    return;
                } else {
                    selectedZones.splice(selIndex, 1);
                    f.setStyle(undefined);
                }
            });

            console.log(selectedZones);
        }

        if (!map)
            return;

        map.on('singleclick', callback);

        // Disabilito doppio click per evitare problemi con selezione veloce

        var dblClickInteraction: Interaction = new Interaction();

        // find DoubleClickZoom interaction
        map.getInteractions().getArray().forEach(function (interaction) {
            if (interaction instanceof DoubleClickZoom) {
                dblClickInteraction = interaction;
            }
        });
        // remove from map
        map.removeInteraction(dblClickInteraction);

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


    // - ricerca tramite geofence
    function geofenceSearch() {
        const source = new VectorSource({ wrapX: false });
        const vector = new VectorLayer({
            source: source,
            style: geofenceNormalStyle,
        });

        if (!map)
            return

        map.addLayer(vector);

        getSelectedFeatures = () => {
            return source.getFeatures();
        }

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
            style: geofenceDeleteStyle,
        });


        function changeInteraction(interaction: string) {
            if (!map)
                return;

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

        const [retrivenAddresses, setAddresses] = useState();
        const [chosenAddress, setChosenAddress] = useState();

        useEffect(() => {
            if (!chosenAddress || layer)
                return;

            
            const vectorSource = new VectorSource();


            const point = new Point(fromLonLat(chosenAddress));
            const feature = new Feature(point);
            
            vectorSource.addFeature(feature);

            console.log("feature creata", feature);

            const newLayer = new VectorLayer({
                source: vectorSource,
            })
            setLayer(newLayer);

        }, [chosenAddress, layer]);

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
                            setChosenAddress([addres.properties.lon, addres.properties.lat])
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
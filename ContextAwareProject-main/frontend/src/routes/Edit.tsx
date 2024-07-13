import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
    Card
} from "@/components/ui/card"

import { LocateFixed, Map } from "lucide-react"

import { Map as MapOl, View } from 'ol';
import { fromLonLat } from "ol/proj"
import { Point } from "ol/geom"
import { useEffect, useState, useRef, SetStateAction } from "react"
import { Coordinate } from "ol/coordinate"
import TileLayer from "ol/layer/Tile"
import { OSM, XYZ } from "ol/source"
import Feature, { FeatureLike } from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Icon, RegularShape, Style } from "ol/style"
import PoiToggleList from "@/components/myComponents/PoiToggleList"
import { Link } from "react-router-dom";
import { toLonLat } from 'ol/proj';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { attributions, key } from "@/common/keys";
import { AddPoI, PoiData, PoiData2 } from "@/common/interfaces"


const POIs = [
    {
        value: "Supermercati",
        label: "Supermercato",
    },
    {
        value: "Banche",
        label: "Banca",
    },
    {
        value: "Biblioteche",
        label: "Biblioteca",
    },
    {
        value: "Cinema",
        label: "Cinema",
    },
    {
        value: "Colonnine",
        label: "Colonnina",
    },
    {
        value: "Dopo Scuola",
        label: "Dopo Scuola",
    },
    {
        value: "Farmacie",
        label: "Farmacia",
    },
    {
        value: "Giochi Bimbi",
        label: "Giochi Bimbi",
    },
    {
        value: "Musei",
        label: "Museo",
    },
    {
        value: "Eventi",
        label: "Evento",
    },
    {
        value: "Stazioni Treno",
        label: "Stazione Ferroviaria",
    },
    {
        value: "Scuole",
        label: "Scuola",
    },
    {
        value: "Ristoranti",
        label: "Ristorante",
    },
    {
        value: "Parchi",
        label: "Parco",
    },
    {
        value: "Parcheggi",
        label: "Parcheggio",
    },
    {
        value: "Palestre",
        label: "Palestra",
    },
    {
        value: "Ospedali",
        label: "Ospedale",
    },
    {
        value: "Impianti Sportivi",
        label: "Impianto Sportivo",
    },
    {
        value: "Fermate Bus",
        label: "Fermata Bus",
    },
]


function Edit() {
    // ==== variabili state globali ====

    // - per la mappa
    const [map, setMap] = useState<MapOl>();
    const [tileProvider, setTileProvider] = useState<string>("osm");
    const [tileLayer, setTilelayer] = useState<TileLayer<any>>();
    const OSM_source = useRef(new OSM());
    const aerial_source = useRef(new XYZ({
        attributions: attributions,
        url: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + key,
        tileSize: 512,
        maxZoom: 20,
    }));


    const [open, setOpen] = useState(false);
    const [actualPOI, setActualPoi] = useState<PoiData2>({
        id: '',
        longitudine: '',
        latitudine: '',
        name: ''
    });
    const [open2, setOpen2] = useState(false);

    const [deletedList, setDeletedList] = useState<PoiData2[]>([]);
    const [addList, setAddList] = useState<AddPoI[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [lastClickCoordinate, setLastClickCoordinate] = useState<Coordinate | null>(null);
    const [featureDel, setFeatureDel] = useState<any>(null);

    useEffect(() => {
        const tileLayerInstance = new TileLayer({
            preload: Infinity,
            source: OSM_source.current,
        });

        setTilelayer(tileLayerInstance)

        const mapInstance = new MapOl({
            target: "map",
            layers: [tileLayerInstance],
            view: new View({
                center: fromLonLat(bolognaCenter.lon_lat),
                zoom: bolognaCenter.zoom,
            }),
        });

        setMap(mapInstance);

        setLastClickCoordinate(null);

        setFeatureDel(null);


        mapInstance.on('click', function (event) {
            const feature = mapInstance.forEachFeatureAtPixel(event.pixel, (feature: FeatureLike) => {
                setFeatureDel(feature);
                setOpen(true);
                setOpen2(false);
                const properties = feature.getProperties();
                setActualPoi({
                    id: properties.id,
                    longitudine: properties.longitudine,
                    latitudine: properties.latitudine,
                    name: properties.name
                });
                return true;
            });

            if (!feature) {
                setLastClickCoordinate(event.coordinate);
                setOpen(false);
                setOpen2(true);
                setActualPoi({
                    id: '',
                    longitudine: '',
                    latitudine: '',
                    name: ''
                })
            }

        });

        return () => {
            if (mapInstance) {
                mapInstance.setTarget(undefined);
            }
        };
    }, []);

    useEffect(() => {
        if (!tileProvider)
            return

        switch (tileProvider) {
            case "osm":
                tileLayer?.setSource(OSM_source.current);
                break;
            case "aerial":
                tileLayer?.setSource(aerial_source.current);
                break;
            default:
                tileLayer?.setSource(OSM_source.current);
        }
    }, [tileProvider])


    const bolognaCenter = {
        lon_lat: [11.3394883, 44.4938134],
        zoom: 14
    }

    function moveMapTo(position: Coordinate, zoom: number) {
        if (!map)
            return;

        let point = new Point(fromLonLat(position));

        map.getView().fit(point, {
            padding: [100, 100, 100, 100],
            maxZoom: zoom,
            duration: 1000
        });
    }

    function del(actualPOI: PoiData2) {
        setDeletedList([...deletedList, actualPOI]);
        setOpen(false);
        if (featureDel) {
            const style = [
                new Style({
                    image: new RegularShape({
                        points: 64,
                        radius: 18,
                        fill: new Fill({
                            color: 'violet'
                        }),
                    })
                }),
                new Style({
                    image: new Icon({
                        src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNpcmNsZS14Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxwYXRoIGQ9Im0xNSA5LTYgNiIvPjxwYXRoIGQ9Im05IDkgNiA2Ii8+PC9zdmc+",
                        scale: 1.7,
                    }),
                })
            ];
            featureDel.setStyle(style);
        }
    }

    function add(selectedValue: string) {
        if (lastClickCoordinate) {

            const [lon, lat] = toLonLat(lastClickCoordinate);

            const newEntry = {
                name: selectedValue,
                coordinates: { lon, lat },
            };

            setAddList([...addList, newEntry]);
            setOpen2(false);

            const marker = new Feature({
                geometry: new Point(lastClickCoordinate),
            });

            const style = [
                new Style({
                    image: new RegularShape({
                        points: 64,
                        radius: 18,
                        fill: new Fill({
                            color: 'violet'
                        }),
                    })
                }),
                new Style({
                    image: new Icon({
                        src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNpcmNsZS1hbGVydCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIvPjxsaW5lIHgxPSIxMiIgeDI9IjEyLjAxIiB5MT0iMTYiIHkyPSIxNiIvPjwvc3ZnPg==",
                        scale: 1.7,
                    }),
                })
            ];


            marker.setStyle(style);

            const vectorSource = new VectorSource();
            vectorSource.addFeature(marker);
            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });
            if(map)
                map.addLayer(vectorLayer);
            setLastClickCoordinate(null);
        }
    }

    function handleSelectChange(value: string | SetStateAction<string>) {
        setSelectedValue(value);
    }

    function apply(addList: AddPoI[], deletedList: PoiData2[]) {

        fetch('http://localhost:4000/DIPoI', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                addList: addList,
                deletedList: deletedList,
            }),
        });
    }

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className='relative'>
                <div style={{ height: '100%', width: '100%' }} id="map" className="map-container" />
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-5 left-5 z-10"
                    onClick={() => moveMapTo(bolognaCenter.lon_lat, bolognaCenter.zoom)}>
                    <LocateFixed className="h-4 w-4" />
                </Button>

                <Popover>
                    <PopoverTrigger
                        className="absolute top-5 right-5 z-10">
                        <Card className='p-2'>
                            <Map />
                        </Card>
                    </PopoverTrigger>
                    <PopoverContent align='end' className='w-min'>
                        <ToggleGroup
                            type="single"
                            value={tileProvider}
                            className='flex flex-col'
                            onValueChange={(value: string) => setTileProvider(value)}
                        >
                            <ToggleGroupItem className='w-full' value="osm">OSM</ToggleGroupItem>
                            <ToggleGroupItem className='w-full' value="aerial">Aerial</ToggleGroupItem>
                        </ToggleGroup>
                    </PopoverContent>
                </Popover>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel minSize={10} maxSize={20} className="flex flex-col justify-around px-6 pb-4">
                <PoiToggleList map={map} />
                <Link
                    className="flex-none"
                    to={'/home'}>
                    <Button
                        className="bg-[#307351] hover:bg-[#285f43] w-full"
                        variant={"destructive"}
                        onClick={() => apply(addList, deletedList)}
                    >
                        Applica Modifiche
                    </Button>
                </Link>
            </ResizablePanel>

            {open && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button style={{ display: 'none' }}>Trigger</button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Vuoi eliminare questo Punto di interesse?</DialogTitle>

                            <DialogDescription className="py-2">
                                <span>Il punto selezionato è della categoria </span>
                                <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">{actualPOI.name}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <Button variant="destructive" onClick={() => del(actualPOI)}>
                            Elimina
                        </Button>
                    </DialogContent>
                </Dialog>
            )}

            {open2 &&
                (
                    <Dialog open={open2} onOpenChange={setOpen2}>
                        <DialogTrigger asChild>
                            <button style={{ display: 'none' }}>Trigger</button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Vuoi aggiungere un Punto di interesse?</DialogTitle>

                                <DialogDescription>

                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-row w-full justify-between space-x-4">

                                <Select onValueChange={(value: string) => handleSelectChange(value)}>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue
                                            placeholder="Seleziona un tipo di PoI..."
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {POIs.map((poi) => (
                                                <SelectItem value={poi.value} key={poi.value}>{poi.label}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Button
                                    className="flex-none bg-[#307351] hover:bg-[#285f43]"
                                    variant="destructive" onClick={() => add(selectedValue)}>
                                    Aggiungi
                                </Button>

                            </div>
                        </DialogContent>
                    </Dialog>
                )}

        </ResizablePanelGroup>
    )
}

export default Edit;
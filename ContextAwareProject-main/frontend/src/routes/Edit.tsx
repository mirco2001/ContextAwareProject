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
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { LocateFixed } from "lucide-react"

import { Map as MapOl, View, Overlay } from 'ol';
import { fromLonLat } from "ol/proj"
import { Point } from "ol/geom"
import { useEffect, useState,useRef } from "react"
import { Coordinate } from "ol/coordinate"
import TileLayer from "ol/layer/Tile"
import { OSM } from "ol/source"
import Feature from 'ol/Feature';
import Text from 'ol/style/Text.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Icon, RegularShape, Style, Stroke, Circle as CircleStyle } from "ol/style"
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

    const [map, setMap] = useState<MapOl>();
    const [open, setOpen] = useState(false);
    const [actualPOI, setActualPoi] = useState({
        id: '',
        longitudine: '',
        latitudine: '',
        name: ''
    });
    const [open2, setOpen2] = useState(false);

    const [deletedList, setDeletedList] = useState([]);
    const [addList, setAddList] = useState([]);
    const [selectedValue, setSelectedValue] = useState("");
    const [lastClickCoordinate, setLastClickCoordinate] = useState(null);
    const [featureDel, setFeatureDel] = useState(null);

    useEffect(() => {

        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        });

        const mapInstance = new MapOl({
            target: "map",
            layers: [osmLayer],
            view: new View({
                center: fromLonLat(bolognaCenter.lon_lat),
                zoom: bolognaCenter.zoom,
            }),
        });

        setMap(mapInstance);

        setLastClickCoordinate(null);

        setFeatureDel(null);


        mapInstance.on('click', function(event) {
            const feature = mapInstance.forEachFeatureAtPixel(event.pixel, (feature) => {
                setFeatureDel(feature);
                setOpen(true);
                setOpen2(false);
                setActualPoi({
                    id: feature.values_.id,
                    longitudine: feature.values_.longitudine,
                    latitudine: feature.values_.latitudine,
                    name: feature.values_.name
                });
                return true;
            });

            if(!feature){
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

    function del(actualPOI) {
        setDeletedList([...deletedList, actualPOI]);
        setOpen(false);
        if(featureDel){
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

    function add(selectedValue) {
        if (lastClickCoordinate) {

            const [lon, lat] = toLonLat(lastClickCoordinate);

            console.log(lon,lat);

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
            map.addLayer(vectorLayer);
            setLastClickCoordinate(null);
        }
    }

    function handleSelectChange(value){
        setSelectedValue(value);
    }

    function apply(addList,deletedList){
        console.log(addList);
        console.log(deletedList);

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
            <ResizablePanel>
                <div style={{ height: '100%', width: '100%' }} id="map" className="map-container"/>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-5 left-5 z-10"
                    onClick={() => moveMapTo(bolognaCenter.lon_lat, bolognaCenter.zoom)}>
                    <LocateFixed className="h-4 w-4" />
                </Button>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel minSize={10} maxSize={20} className="flex flex-col justify-around px-6">
                <PoiToggleList map={map} />
                <Link to={'/home'}>
                    <Button
                        className="bg-green-500 hover:bg-green-700 w-full"
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
                        <DialogDescription>
                            {actualPOI.name}
                        </DialogDescription>
                        <DialogDescription>
                            <Button variant="destructive" onClick={() => del(actualPOI)}>
                                Elimina
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
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
                           <Select onValueChange={(value: String) => handleSelectChange(value)}>
                            <SelectTrigger className="w-[280px]">
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
                            <DialogDescription>
                                <Button variant="destructive" onClick={() => add(selectedValue)}>
                                    Aggiungi
                                </Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
           )}

        </ResizablePanelGroup>
    )
}

export default Edit;
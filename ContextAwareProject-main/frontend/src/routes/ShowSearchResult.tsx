// import libreria openlayer
import { Feature, Map as MapOl, View } from 'ol';
import { fromLonLat } from "ol/proj"
import { Geometry, Point } from "ol/geom"
import TileLayer from "ol/layer/Tile"
import { OSM, XYZ } from "ol/source"
import { getCenter } from 'ol/extent';
import WKB from "ol/format/WKB";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Fill, Icon, RegularShape, Stroke, Style } from "ol/style"
import { FeatureLike } from "ol/Feature";

// import libreria react
import { useEffect, useRef, useState } from "react"

// import componenti shadecn
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import {
    Card
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"


// import componenti miei
import PoiToggleList from "@/components/myComponents/PoiToggleList"
import MapIsochrones from "@/components/myComponents/MapIsochrones"
import MapDailyPath from "@/components/myComponents/MapDailyPath"
import ControlsDailyPath from "@/components/myComponents/ControlsDailyPath"

// import lib interne di utils e interfacce
import { getColor, moveMapTo } from "@/lib/utils";
import { HouseData, LayerInfo } from "@/common/interfaces"

// import stili e icone
import { LocateFixed, X, Map } from "lucide-react"
import { attributions, key } from '@/common/keys';

let lastFeature: FeatureLike | undefined;
let shouldShowInfo = true;

function SearchResult() {
    // ==== variabili state globali ====

    // - per la mappa
    const [tileProvider, setTileProvider] = useState<string>("osm");
    const [tileLayer, setTilelayer] = useState<TileLayer<any>>();
    const [mapView, setMapView] = useState<View | undefined>(undefined);;
    const [map, setMap] = useState<MapOl | undefined>(undefined);

    const OSM_source = useRef(new OSM());
    const aerial_source = useRef(new XYZ({
        attributions: attributions,
        url: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + key,
        tileSize: 512,
        maxZoom: 20,
    }));

    // - per i layer dei POI sulla mappa
    const [poiLayers, setPoiLayers] = useState<LayerInfo[][]>();

    // - per mostrare case e loro "info"
    const [houseSource, setHouseSource] = useState<VectorSource<Feature<Geometry>>>();
    const [bestHouseData, setBestHouseData] = useState<HouseData[]>([]);
    const [bestHouseScoreLimits, setBestHouseScoreLimits] = useState<[number, number]>([0, 0])

    // per la casa selezionata e il suo pup-up
    const info = document.getElementById('info');
    const [selectedHouse, setSelectedHouse] = useState<FeatureLike | undefined>();

    // source del layer per i punti del percorso giornaliero
    const [dailyPointsSource, setDailyPointsSource] = useState<VectorSource<Feature<Geometry>> | null>(new VectorSource());

    let PoiPanel = document.getElementById("PoiPanel")
    let DailyPathPanel = document.getElementById("DailyPathPanel")

    const bolognaCenter = {
        lon_lat: [11.3394883, 44.4938134],
        zoom: 14
    }

    // creazione della mappa
    // (attivata all'avvio del componente)
    useEffect(() => {
        const tileLayerInstance = new TileLayer({
            preload: Infinity,
            source: OSM_source.current,
        });

        setTilelayer(tileLayerInstance)

        const viewInstance = new View({
            center: fromLonLat(bolognaCenter.lon_lat),
            zoom: bolognaCenter.zoom,
        })

        setMapView(viewInstance);

        const mapInstance = new MapOl({
            target: "map",
            layers: [tileLayerInstance],
            view: viewInstance,
        });

        setMap(mapInstance);

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


    // fetch delle case rispetto al sondaggio dell'utente
    useEffect(() => {
        fetch('http://backend:4000/datiForm', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {
                setBestHouseData(data.infocase);
            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });
    }, []);

    // parsing dei dati ottenuti dal back-end sulle case 
    // (eseguito quando i dati ricevuti dal back vengono settati)
    useEffect(() => {
        // controllo che la mappa sia stata definita
        if (!map)
            return;

        if (DailyPathPanel && PoiPanel) {
            PoiPanel.style.display = "block";
            DailyPathPanel.style.display = "none";
        }

        // controllo che i dati recuperati siano validi
        if (!bestHouseData || bestHouseData.length < 1)
            return;

        // setto il valore iniziale per il punteggio "massimo" e "minimo" delle case
        // al valore della prima casa nella lista
        let maxScore: number = parseInt(bestHouseData[0].punteggio),
            minScore: number = parseInt(bestHouseData[0].punteggio);

        // inizializzo la vector source in cui saranno inserite le case
        let vSource: VectorSource = new VectorSource;
        // inizializzo il parser per la lettura del dato di posizione della casa
        const format = new WKB();

        // per ogni casa recuperata
        bestHouseData.forEach((house: { geom_casa: any; punteggio: string; id_casa: any; }) => {

            // - leggo con il parser la geometria della casa
            let houseGeometry = format.readGeometry(house.geom_casa, {
                dataProjection: 'EPSG:4326',
                featureProjection: map.getView().getProjection(),
            })

            // - trovo il punto centrale della casa 
            let houseCenter = getCenter(houseGeometry.getExtent());
            // - creo una feature con tale punto
            let houseFeature = new Feature({
                geometry: new Point(houseCenter),
            })

            // - setto i dati della casa sulla feature
            houseFeature.set("score", parseInt(house.punteggio));
            houseFeature.set("house_id", house.id_casa);

            // - aggiorno il punteggio minimo e massimo delle case se necessario
            if (maxScore < houseFeature.get("score"))
                maxScore = houseFeature.get("score");
            if (minScore > houseFeature.get("score"))
                minScore = houseFeature.get("score");

            // - imposto alla feature lo stile dell'icona della casa
            houseFeature.setStyle(createHouseMarkerStyle());
            // - aggiungo la feature alla vector source
            vSource.addFeature(houseFeature);
        });

        // con la vector source piena di tutti i dati sulle case creo un vector layer
        let vLayer = new VectorLayer({
            source: vSource,
        })

        // imposto il suo zIndex come prioritario in modo che si trovi sopra gli altri layer 
        // e lo aggiungo alla mappa
        vLayer.setZIndex(9)
        map?.addLayer(vLayer);

        // imposto gli state dei 
        // - valori minimo e massimo delle case
        setBestHouseScoreLimits([minScore, maxScore]);
        // - vector source della casa
        setHouseSource(vSource);


        // if (divDailyPath)
        //     divDailyPath.style.display = 'none';

    }, [bestHouseData]);

    // funzione per modificare l'icona di ogni case in modo che rappresenti il suo punteggio
    // (eseguito quando i valori sulla casa con punteggio maggiore e minore è stata impostata)
    useEffect(() => {
        // controllo che la source del layer delle case sia valido
        // e che i valori su punteggio minimo e massimo siano validi
        if (!houseSource || !bestHouseScoreLimits)
            return;

        // per ogni feature (che rappresenta una casa)
        houseSource.getFeatures().forEach((houseFeature: { get: (arg0: string) => number; setStyle: (arg0: any[]) => void; set: (arg0: string, arg1: string) => void; }) => {

            // viene generato uno stile con colore che rapresenta il punteggio
            let color = getColor(houseFeature.get("score"), bestHouseScoreLimits[0], bestHouseScoreLimits[1]);

            let colorString = "rgb(" + color.r + "," + color.g + "," + color.b + ")";

            houseFeature.setStyle(createHouseMarkerStyle(colorString))
            houseFeature.set("color", colorString)
        });

    }, [bestHouseScoreLimits, houseSource]);

    // funzione che crea il marcker della casa con il contorno del colore che gli viene passato
    function createHouseMarkerStyle(strokeColor: string = "rgba(255,255,255,1)") {
        return [
            new Style({
                image: new RegularShape({
                    points: 6,
                    radius: 20,
                    fill: new Fill({
                        color: "rgba(0,0,0,0.8)"
                    }),
                    stroke: new Stroke({
                        color: strokeColor,
                        width: 4
                    })
                })
            }),
            new Style({
                image: new Icon({
                    src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1ob3VzZSI+PHBhdGggZD0iTTE1IDIxdi04YTEgMSAwIDAgMC0xLTFoLTRhMSAxIDAgMCAwLTEgMXY4Ii8+PHBhdGggZD0iTTMgMTBhMiAyIDAgMCAxIC43MDktMS41MjhsNy01Ljk5OWEyIDIgMCAwIDEgMi41ODIgMGw3IDUuOTk5QTIgMiAwIDAgMSAyMSAxMHY5YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yeiIvPjwvc3ZnPg==",
                    scale: 0.7,
                }),
            })
        ];
    }

    // funzione per impostare lo stile "normale" dei poi 
    // a tutte le feature nei layer dei poi
    function showAllPoiFeatures() {
        // controllo che i layer dei poi siano stati dettati
        if (!poiLayers)
            return;

        // per ogni gruppo di layer poi (un gruppo è costituito dai layer della stessa categoria)
        poiLayers.forEach((layerGroup: LayerInfo[]) => {
            // per ogni layer
            layerGroup.forEach((layer: LayerInfo) => {

                // viene definito lo stile che rappresenta il punto POI
                // - "colore" punto
                // - "immagine" punto
                const style = [
                    new Style({
                        image: new RegularShape({
                            points: 64,
                            radius: 14,
                            fill: new Fill({
                                color: layer.layerColor
                            })
                        })
                    }),
                    new Style({
                        image: new Icon({
                            src: layer.layerIcon,
                            scale: 0.7,
                        }),
                    })
                ];

                // tale stile viene applicato a tutti le feature di quel layer
                layer.layer.getSource()?.getFeatures().forEach((element: { setStyle: (arg0: any[]) => void; }) => {
                    element.setStyle(style);
                });
            });
        });
    }

    // funzione che aggiunge gli eventi di click sulle feature che rappresentano le case
    // (eseguita una volta che la mappa è stata definita)
    useEffect(() => {
        // controllo che il pop-up e la mappa siano validi
        if (!map || !info)
            return;

        // setto inizialmente il pop-up in modo che non venga mostrato
        info.style.visibility = 'hidden';
        info.style.left = '0px';
        info.style.top = '0px';

        // al click sulla mappa
        map.on('click', function (e: { pixel: any; }) {
            // estraggo la feature "sotto il puntatore del mouse"
            let featuresAtPixel = map.getFeaturesAtPixel(e.pixel);

            // controllo che almeno una feature sia stata recuperata
            if (featuresAtPixel.length <= 0)
                return;

            // controllo che sia una casa vedendo se ha la proprietà "house_id"
            if (!featuresAtPixel[0].get("house_id"))
                return;

            // prendo la feature e la imposto come ultima feature selezionata
            lastFeature = featuresAtPixel[0];
            setSelectedHouse(lastFeature)

            // mostro e posiziono il popup al click
            popUpFollowFeature()
        });

        map.getView().on('change:center', function () {
            // mostro e posiziono il popup quando la mappa viene spostata
            popUpFollowFeature()
        });

    }, [map])

    // funzione che mostra e posiziona il popup sulla mappa vicino alla feature selezionata
    function popUpFollowFeature() {
        // controllo che pop-up e mappa siano selezionati
        if (!info || !map || !shouldShowInfo)
            return;

        // controllo che sia stata selezionata una feature altrimenti nascondo il pop-up
        if (!lastFeature) {
            info.style.visibility = 'hidden';
            return;
        }

        // estraggo le coordinate della feature selezionata
        // e trovo la sua posizione all'interno del div della mappa
        var geometry = lastFeature.getGeometry();
        //@ts-ignore
        var coordinate = geometry?.getCoordinates();
        var pixel = map.getPixelFromCoordinate(coordinate);

        // prendo le dimensioni del canvas della mappa
        let mapCanvasSize = map.getSize();

        // controllo se la feature e fuori dallo "spazio di visualizzazione"
        // nel caso nascondo il pop-up
        if (!mapCanvasSize ||
            (pixel[0] < 0 || mapCanvasSize[0] < pixel[0]) ||
            (pixel[1] < 0 || mapCanvasSize[1] < pixel[1])) {

            info.style.visibility = 'hidden';
            return;
        }

        // se tutto è andato bene mostro il pop-up vicino alla feature tenendo conto della 
        // - dimensione pop-up
        // - posizione in pixel della feature
        info.style.visibility = 'visible';
        info.style.left = (pixel[0] - info.offsetWidth - 20) + 'px';
        info.style.top = (pixel[1] - info.offsetHeight / 3) + 'px';

        // coloro il div in base al punteggio
        let divScore = document.getElementById("divScore");
        if (divScore)
            divScore.style.backgroundColor = lastFeature.get("color");
    }

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className='relative'>

                <Tabs defaultValue="selezione" className="w-full h-full relative">
                    <TabsList className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">

                        <TabsTrigger value="selezione" onClick={() => {
                            map?.setTarget(undefined)
                            map?.setTarget("map")
                            map?.updateSize()

                            showAllPoiFeatures()
                            moveMapTo(bolognaCenter.lon_lat, bolognaCenter.zoom, map);

                            if (info && selectedHouse){
                                shouldShowInfo = true;
                                info.style.visibility = 'visible';
                            }

                            if (!DailyPathPanel || !PoiPanel)
                                return;

                            PoiPanel.style.display = "block";
                            DailyPathPanel.style.display = "none";
                        }}>
                            Selezione
                        </TabsTrigger>

                        <TabsTrigger
                            disabled={selectedHouse == undefined}

                            value="isocrone"
                            onClick={() => {
                                if (info){
                                    shouldShowInfo = false;
                                    info.style.visibility = 'hidden';
                                }

                                if (!DailyPathPanel || !PoiPanel)
                                    return;

                                PoiPanel.style.display = "block";
                                DailyPathPanel.style.display = "none";
                            }}>
                            POI Raggiungibili
                        </TabsTrigger>

                        <TabsTrigger

                            disabled={selectedHouse == undefined}

                            value="Percorso Giornaliero"
                            onClick={() => {
                                if (info){
                                    shouldShowInfo = false;
                                    info.style.visibility = 'hidden';
                                }

                                if (!DailyPathPanel || !PoiPanel)
                                    return;

                                PoiPanel.style.display = "none";
                                DailyPathPanel.style.display = "block";
                            }}>
                            Percorso Giornaliero
                        </TabsTrigger>

                    </TabsList>

                    <TabsContent value="selezione" className="w-full h-full">
                        <div style={{ height: '100%', width: '100%' }}
                            id="map"
                            className="map-container relative">

                        </div>
                    </TabsContent>

                    <TabsContent value="isocrone" className="w-full h-full ">
                        <MapIsochrones
                            tileProvider={tileProvider}
                            mapView={mapView}

                            bolognaCenter={bolognaCenter}
                            selectedHouse={selectedHouse}
                            poiLayers={poiLayers}
                        />
                    </TabsContent>

                    <TabsContent
                        value="Percorso Giornaliero"
                        className="w-full h-full ">

                        <MapDailyPath
                            tileProvider={tileProvider}
                            mapView={mapView}

                            bolognaCenter={bolognaCenter}
                            selectedHouse={selectedHouse}

                            dailyPointsSource={dailyPointsSource}
                            setDailyPointsSource={setDailyPointsSource}
                        />
                    </TabsContent>
                </Tabs>


                <Card id="info" className='flex flex-col z-10 absolute overflow-hidden'>
                    <div id='divScore' className="p-4 flex justify-between select-none space-x-4">
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                            Casa Selezionata
                        </h4>

                        <X className="my-auto"
                            onClick={
                                () => {
                                    setSelectedHouse(undefined);
                                    lastFeature = undefined;

                                    if (info)
                                        info.style.visibility = 'hidden';
                                }}
                        />
                    </div>
                    <Separator />
                    <div className="p-4 space-y-4">
                        <span className="flex flex-row items-baseline select-none justify-between">
                            <p>Punteggio </p>
                            <p className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-lg font-semibold">
                                {selectedHouse?.get("score")}
                            </p>
                        </span>
                    </div>

                </Card>

                <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-5 left-5 z-10"
                    onClick={() => moveMapTo(bolognaCenter.lon_lat, bolognaCenter.zoom, map)}>
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

            <ResizablePanel minSize={10} maxSize={20} className="flex flex-col justify-around px-6">
                <div
                    id='PoiPanel'
                    className='h-full'>
                    <PoiToggleList
                        map={map}
                        setPoiLayers={setPoiLayers}
                    />
                </div>

                <div id='DailyPathPanel'>
                    <ControlsDailyPath
                        dailyPointsSource={dailyPointsSource}
                        setDailyPointsSource={setDailyPointsSource}
                    />
                </div>
            </ResizablePanel>

        </ResizablePanelGroup >
    )
}

export default SearchResult;
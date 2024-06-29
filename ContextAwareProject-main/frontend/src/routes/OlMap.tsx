import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Map, MapBrowserEvent, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import 'ol/ol.css';
import { Draw, Modify, Snap } from 'ol/interaction.js';
import Select from 'ol/interaction/Select.js';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { Polygon } from 'ol/geom';
import { FeatureLike } from 'ol/Feature';

import UserProfile from '../UserProfile.ts'



function OlMap() {

  // test passaggio valori da form
  const { state } = useLocation()
  // const { searchType } = state;

  var map: Map;

  var draw: Draw, snap: Snap, modify: Modify;
  var select: Select;
  var selectedZones: FeatureLike[] = [];

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

  const highlightStyle = new Style({
    fill: new Fill({
      color: '#EEE',
    }),
    stroke: new Stroke({
      color: '#3399CC',
      width: 2,
    }),
  });

  var callback = function (e: MapBrowserEvent<any>) {
    map.forEachFeatureAtPixel(e.pixel, function (f) {


      const selIndex = selectedZones.indexOf(f);


      if (selIndex < 0) {
        selectedZones.push(f);
        f.setStyle(highlightStyle);
      } else {
        selectedZones.splice(selIndex, 1);
        f.setStyle(undefined);
      }
    });

    console.log(selectedZones);

  }


  useEffect(() => {

    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    })

    map = new Map({
      target: "map",
      layers: [osmLayer, vector],
      view: new View({
        center: fromLonLat([11.3394883, 44.4938134]),
        zoom: 14,
      }),
    });



    draw = new Draw({
      source: source,
      type: "Polygon",
    });
    modify = new Modify({
      source: source
    });
    snap = new Snap({ 
      source: source 
    });
    
    map.addInteraction(draw);
    map.addInteraction(modify);
    map.addInteraction(snap);

    // const modify = new Modify({ source: source });
    // map.addInteraction(modify);


    return () => map.setTarget(undefined)
  }, []);

  //   const fetchData = async () => {
  //     const res = await fetch("http://localhost:4000/get");
  //     const data = await res.json();
  //     console.log(data);
  // };

  function goBologna() {
    let point = new Point(fromLonLat([11.3394883, 44.4938134]));


    map.getView().fit(point, {
      padding: [100, 100, 100, 100],
      maxZoom: 14,
      duration: 1000
    });
  }

  const fetchData = async () => {
    const res = await fetch("http://localhost:4000/getZone");
    const data = await res.json();
    console.log(data);
  };

  function Attiva() {
    // tenendo premuto shift si va in modalità free draw

    // metodo per prendere le geometrie
    // console.log(source.getFeatures()[0].getGeometry());

    map.removeInteraction(modify);
    map.removeInteraction(draw);

    map.on('click', callback);
    // fetchData();


    //Get the feature that's selected
    // var selectedFeature = source.getFeatures()[source.getFeatures().length - 1];
    // //Remove it from your feature source
    // source.removeFeature(selectedFeature)
  }

  function Disattiva() {
    map.addInteraction(modify);
    map.addInteraction(draw);

    map.un('click', callback);
  }


  return (

    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div style={{ height: '100%', width: '100%' }} id="map" className="map-container" />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel className='min-w-[200px]' >
          <Button onClick={() => { goBologna() }}>Centra Bologna</Button>
          <Button onClick={() => { Attiva() }}>Attiva</Button>
          <Button onClick={() => { Disattiva() }}>Disattiva</Button>
        </ResizablePanel>
      </ResizablePanelGroup>


    </>
  );
}

export default OlMap;
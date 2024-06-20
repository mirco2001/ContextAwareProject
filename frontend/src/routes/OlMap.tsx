import { useEffect } from 'react';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import 'ol/ol.css';
import Draw from 'ol/interaction/Draw.js';
import { fromLonLat } from 'ol/proj';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import Point from 'ol/geom/Point';


function OlMap() {
  var map: Map;
  var draw: Draw;
  const source = new VectorSource({wrapX: false});


  useEffect(() => {
    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    })

    map = new Map({
      target: "map",
      layers: [osmLayer],
      view: new View({
        center: fromLonLat([11.3394883, 44.4938134]),
        zoom: 14,
      }),
    });



    draw = new Draw({
      source: source,
      type: "Polygon",
    });
    map.addInteraction(draw);
    

    return () => map.setTarget(undefined)
  }, []);

  function goBologna() {
    let point = new Point(fromLonLat([11.3394883, 44.4938134]));

    console.log(draw);
    


    map.getView().fit(point, {
      padding: [100, 100, 100, 100],
      maxZoom: 14,
      duration: 1000
    });
  }

  return (

    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div style={{ height: '100%', width: '100%' }} id="map" className="map-container" />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel className='min-w-[200px]' >
          <Button onClick={() => {goBologna()}}>Centra Bologna</Button>
        </ResizablePanel>
      </ResizablePanelGroup>


    </>
  );
}

export default OlMap;
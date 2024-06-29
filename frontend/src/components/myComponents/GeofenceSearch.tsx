import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

import { Pencil, Eraser, PencilRuler } from "lucide-react";

import VectorSource from "ol/source/Vector";
import { Draw, Modify, Snap, Select } from 'ol/interaction.js';
import { pointerMove } from 'ol/events/condition.js';
import { useEffect } from "react";

function GeofenceSearch(props: any) {
    let draw:Draw, modify:Modify, snap:Snap, deleteOnClick:Select, selectPointerMove:Select;

    useEffect(() => {
        if(!props.layer)
            return;

        let vSource: VectorSource = props.layer.getSource();

        if (!vSource)
            return;

        // ===== EVENTI MODIFICA GEOGENCE =====
        // - disegno di una geofence
        draw = new Draw({
            source: vSource,
            type: "Polygon",
        });
        // - modifica di geofence esistenti
        modify = new Modify({
            source: vSource
        });
        // - "snap" (avvicinamento) della posizione del mouse 
        //   alla più vicina geofence esistente
        snap = new Snap({
            source: vSource
        });
        // - cancellazione della geofence selezionata dal mouse
        deleteOnClick = new Select();
        deleteOnClick.on('select', function (e) {
            let selectedFeature = e.selected[0];

            if (selectedFeature) {
                vSource.removeFeature(selectedFeature);
            }
        });
        // - evento hover di una geofence nella modalità cancella
        selectPointerMove = new Select({
            condition: pointerMove,
            style: props.geofenceDeleteStyle,
        });


    }, [props.layer]);


    function changeInteraction(interaction: string) {
        if (!props.map)
            return;

        props.map.removeInteraction(draw);
        props.map.removeInteraction(modify);
        props.map.removeInteraction(snap);
        props.map.removeInteraction(deleteOnClick);
        props.map.removeInteraction(selectPointerMove);

        switch (interaction) {
            case "draw":
                props.map.addInteraction(draw);
                props.map.addInteraction(snap);
                break;
            case "modify":
                props.map.addInteraction(modify);
                props.map.addInteraction(snap);
                break;
            case "delete":
                props.map.addInteraction(deleteOnClick);
                props.map.addInteraction(selectPointerMove);
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

export default GeofenceSearch;
// import delle librerie di openlayer
import { Feature } from "ol";
import { Geometry } from "ol/geom";


import { Separator } from "@/components/ui/separator"


// componente che rappresenta la lista delle aree selezionate
function SelectedZoneList(props: any) {
    
    function createZoneList(features:Feature<Geometry>[]) {

        return features.map((feature, index: number) =>
            <div key={"zone"+index} className="flex flex-col text-center p-2">
                <p className="p-1">{feature.get('name')}</p>
                <Separator />
            </div>
        );
    }

    if (props.featuresInfo <= 0)
        return <p className="text-sm text-muted-foreground">Nessuna ancora zona selezionata</p>

    return (
        <>
            {createZoneList(props.featuresInfo)}
        </>
    )
}

export default SelectedZoneList
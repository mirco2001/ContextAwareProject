import { Feature } from 'ol'
import React, { useEffect } from 'react'

function SelectedZoneList(props: any) {    
    function createZoneList(featureList : Feature[]){
        console.log(featureList.length);
        if (featureList.length <= 0)
            return <div>Nessuna selezione</div>

        

        return featureList.length;
    }



    return (
        <div>
            {props.featuresInfo.map((feature) => {
                <div>ciao</div>
            })}
        </div>
    )
}

export default SelectedZoneList
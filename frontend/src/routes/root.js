import { Outlet } from "react-router-dom";

function Root(){
    return (
        <>
            lavori in corso
            {/* sulla keyword "Outlet" si agganciano tutte le pagine "figlie" */}
            <Outlet /> 
        </>
    );
}

export default Root;
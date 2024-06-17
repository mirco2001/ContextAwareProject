import { Outlet } from "react-router-dom";

import { ModeToggle } from '../components/mode-toggle';




function Root() {

    return (
        <>
            <div className='p-3 flex justify-end'>
                <ModeToggle />
            </div>


            <Outlet />
        </>
    );
}

export default Root;
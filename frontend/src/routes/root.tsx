import { Outlet, Link } from "react-router-dom";

import { ModeToggle } from '../components/mode-toggle';
import { Home } from "lucide-react";



function Root() {

    return (
        <div className="flex flex-col h-dvh">
            <div className="h-[8%] px-3 py-5 flex justify-between items-center">
                <Link className="flex justify-start" to={`/home`}> <Home /> </Link>

                <ModeToggle />
            </div>

            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}

export default Root;
import { Outlet, Link } from "react-router-dom";

import { ModeToggle } from '../components/mode-toggle';
import { Home } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


function Root() {

    return (
        <div className="flex flex-col h-dvh">
            <div className="h-[8%] px-3 py-5 flex justify-between items-center">
                <Link to={`/home`}> <Home /> </Link>

                <div className="flex flex-row items-center">
                    <div className="m-2">
                        <ModeToggle />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><Link to='form'>Preferenze Servizi</Link> </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}

export default Root;
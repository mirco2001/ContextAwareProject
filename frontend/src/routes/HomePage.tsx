import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import "./HomePage.css"

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button"
import { Map, MapPin, Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { useState } from "react";

function HomePage() {

    const [destination, setDestination] = useState("mappa");

    return (
        <div className="h-[100%] bg-[url('@/assets/piantinabologna.jpg')] bg-cover">
            <div className="test bg-white/30 h-[100%] w-[100%] content-center">

                <Card className="h-[60%] w-[70%] lg:h-[50%] lg:w-[50%] mx-auto flex flex-col justify-around">
                    <CardHeader>
                        <CardTitle>Inizia La Ricerca</CardTitle>
                        <CardDescription>Come vorresti cercare la tua casa?</CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col justify-between py-0 px-3 lg:flex-row">

                        <Link className="flex-1 m-2 lg:h-20" to={`/` + destination}>
                            <Button className="h-full w-full">
                                <Map className="mr-2 h-6 w-6" /> Ricerca per Zona
                            </Button>
                        </Link>

                        <Link className="flex-1 m-2 lg:h-20" to={`/` + destination}>
                            <Button className="h-full w-full">
                                <Pencil className="mr-2 h-6 w-6" /> Disegna l'Area
                            </Button>
                        </Link>

                        <Link className="flex-1 m-2 lg:h-20" to={`/` + destination}>
                            <Button className="h-full w-full">
                                <MapPin className="mr-2 h-6 w-6" /> Ricerca l'Indirizzo
                            </Button>
                        </Link>

                    </CardContent>

                    <CardFooter>
                        <div className="flex items-center space-x-2 mx-auto">
                            <Checkbox id="terms2"
                                onCheckedChange={() => {
                                    destination == "mappa" ? setDestination("form"): setDestination("mappa")
                                }}
                            />
                            <label
                                htmlFor="terms2"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Includi Preferenze sui servizi nelle vicinanze
                            </label>
                        </div>
                    </CardFooter>
                </Card>

            </div>
        </div>
    );
}

export default HomePage;